#!/usr/bin/env node
/**
 * Find websites + emails for harvested clinics (outreach/harvest/brreg-clinics.json).
 * 1. Candidate domains: registry website, else name-slug guesses (.no) verified by DNS.
 * 2. Fetch homepage (+ /kontakt variants), extract best email.
 * Output: outreach/harvest/crawl-results.json (checkpointed — resumable).
 * Usage: node outreach/crawl-emails.mjs [--limit N]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns/promises";

const DIR = dirname(fileURLToPath(import.meta.url));
const IN = resolve(DIR, "harvest", "brreg-clinics.json");
const OUT = resolve(DIR, "harvest", "crawl-results.json");
const CSV_LIVE = resolve(process.env.HOME, ".dentdigital", "outreach", "clinics.csv");
const CSV_REPO = resolve(DIR, "clinics.csv");

const args = process.argv.slice(2);
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const CONCURRENCY = 25;
const TIMEOUT = 9000;

// ---------- existing data (dedupe) ----------
function csvNames(file) {
  if (!existsSync(file)) return { names: new Set(), domains: new Set(), emails: new Set() };
  const lines = readFileSync(file, "utf8").split("\n").slice(1).filter(Boolean);
  const names = new Set(), domains = new Set(), emails = new Set();
  for (const l of lines) {
    const cells = l.split(",");
    if (cells[0]) names.add(norm(cells[0]));
    const em = l.match(/[\w.+-]+@[\w.-]+/)?.[0];
    if (em) { emails.add(em.toLowerCase()); domains.add(em.split("@")[1]); }
    const site = l.match(/https?:\/\/([^,/]+)/)?.[1];
    if (site) domains.add(site.replace(/^www\./, ""));
  }
  return { names, domains, emails };
}
function norm(s = "") {
  return s.toLowerCase().replace(/\s+(as|asa|ans|da|enk|sa)$/i, "").replace(/[^a-zæøå0-9]/g, "");
}

const ex1 = csvNames(CSV_LIVE), ex2 = csvNames(CSV_REPO);
const knownNames = new Set([...ex1.names, ...ex2.names]);
const knownDomains = new Set([...ex1.domains, ...ex2.domains]);
const knownEmails = new Set([...ex1.emails, ...ex2.emails]);

// ---------- input ----------
const all = JSON.parse(readFileSync(IN, "utf8"));
const targets = all
  .filter(r => r.clinicLike || r.website)
  .filter(r => !knownNames.has(norm(r.name)))
  .filter(r => !r.website || !knownDomains.has(r.website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]));

// ---------- helpers ----------
function slugVariants(name) {
  const base = name.toLowerCase()
    .replace(/\s+(as|asa|ans|da|enk|sa)$/i, "")
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9 ]/g, "").trim();
  const joined = base.replace(/ /g, "");
  const dashed = base.replace(/ /g, "-");
  const v = new Set([`${joined}.no`]);
  if (dashed !== joined) v.add(`${dashed}.no`);
  return [...v].filter(d => d.length > 7 && d.length < 40);
}

async function domainAlive(domain) {
  try { await dns.lookup(domain); return true; } catch { return false; }
}

async function fetchPage(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36" },
    });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return null;
    return { html: (await r.text()).slice(0, 400_000), finalUrl: r.url };
  } catch { return null; } finally { clearTimeout(t); }
}

const BAD_EMAIL = /(example|sentry|wix|squarespace|godaddy|wordpress|\.png|\.jpg|\.gif|\.webp|\.svg|no-?reply|privacy|webmaster|@[\d.]+$|schema)/i;
function decodeCfEmail(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ r);
  return out;
}
function extractEmails(html) {
  const out = new Set();
  for (const m of html.matchAll(/mailto:([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/gi)) out.add(m[1].toLowerCase());
  for (const m of html.matchAll(/\b([\w.+-]+@[\w-]+(?:\.[\w-]+)+\.(?:no|com|net|org))\b/gi)) out.add(m[1].toLowerCase());
  // Cloudflare email obfuscation
  for (const m of html.matchAll(/data-cfemail="([0-9a-f]+)"/gi)) {
    const e = decodeCfEmail(m[1]);
    if (e.includes("@")) out.add(e.toLowerCase());
  }
  // common at-obfuscation: navn [at] domene.no
  for (const m of html.matchAll(/\b([\w.+-]+)\s*(?:\[at\]|\(at\)|\s@\s)\s*([\w-]+(?:\.[\w-]+)+\.no)\b/gi)) out.add(`${m[1]}@${m[2]}`.toLowerCase());
  return [...out].filter(e => !BAD_EMAIL.test(e) && e.length < 50);
}

const PARKED_RE = /(domene\s*til\s*salgs|domain\s*(is\s*)?for\s*sale|parked\s*domain|domeneshop.*ledig|buy\s*this\s*domain|dan\.com|sedo)/i;

function pickBest(emails, domain) {
  const onDomain = emails.filter(e => e.endsWith("@" + domain) || e.endsWith("." + domain));
  const pool = onDomain.length ? onDomain : emails;
  const pref = ["post@", "kontakt@", "hei@", "hello@", "info@", "booking@", "resepsjon@", "firmapost@", "mail@", "kontor@"];
  for (const p of pref) { const hit = pool.find(e => e.startsWith(p)); if (hit) return hit; }
  return pool[0] ?? "";
}

async function processClinic(c) {
  // 1. determine candidate domains
  const candidates = [];
  if (c.website) candidates.push(c.website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]);
  else candidates.push(...slugVariants(c.name));

  for (const domain of candidates) {
    if (knownDomains.has(domain)) return { ...c, skip: "domain-known" };
    if (!(await domainAlive(domain)) && !(await domainAlive("www." + domain))) continue;
    for (const base of [`https://${domain}`, `https://www.${domain}`, `http://${domain}`]) {
      const home = await fetchPage(base);
      if (!home) continue;
      if (PARKED_RE.test(home.html.slice(0, 20_000))) break; // parked — next candidate
      let emails = extractEmails(home.html);
      if (!emails.length) {
        // try contact pages — links from homepage first, then conventions
        const contactHref = home.html.match(/href="([^"]*(?:kontakt|contact)[^"]*)"/i)?.[1];
        const tries = [contactHref, "/kontakt", "/kontakt-oss", "/om-oss"].filter(Boolean);
        for (const path of tries.slice(0, 3)) {
          const url = path.startsWith("http") ? path : new URL(path, home.finalUrl || base).href;
          const page = await fetchPage(url);
          if (page) emails = extractEmails(page.html);
          if (emails.length) break;
        }
      }
      const finalDomain = (() => { try { return new URL(home.finalUrl).hostname.replace(/^www\./, ""); } catch { return domain; } })();
      const email = pickBest(emails, finalDomain);
      return { ...c, foundDomain: finalDomain, finalUrl: home.finalUrl, email, guessed: !c.website };
    }
  }
  return { ...c, foundDomain: "", email: "" };
}

// ---------- run with checkpointing ----------
const done = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const queue = targets.filter(t => !done[t.orgnr]).slice(0, LIMIT);
console.log(`Targets: ${targets.length} total, ${Object.keys(done).length} already crawled, ${queue.length} to do.`);

let processed = 0, found = 0;
async function worker() {
  while (queue.length) {
    const c = queue.shift();
    const res = await processClinic(c);
    done[c.orgnr] = res;
    processed++;
    if (res.email) found++;
    if (processed % 25 === 0) {
      writeFileSync(OUT, JSON.stringify(done));
      process.stdout.write(`\r${processed} crawled, ${found} emails found`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
writeFileSync(OUT, JSON.stringify(done));
console.log(`\nDone. ${processed} crawled this run, ${found} new emails. Results -> ${OUT}`);
