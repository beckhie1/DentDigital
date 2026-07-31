#!/usr/bin/env node
/**
 * Monthly check for NEWLY REGISTERED dental clinics (NACE 86.230) in Brønnøysundregisteret.
 * New establishments = warmest leads (no website/marketing yet, easier onboarding).
 *
 * - Queries enheter + underenheter registered since last run (state file keeps date + seen orgnrs).
 * - Filters public sector / closed / personal ENK noise, dedupes vs clinics.csv + sent.log.
 * - Tries to find an email (registry website or DNS-verified slug guess -> crawl).
 * - WITH email  -> inserted at TOP of both CSVs (repo + live) => sent first by daily drip.
 * - WITHOUT email -> appended to call-list.csv (kilde=brreg-ny) for manual follow-up.
 *
 * Usage: node outreach/check-new-clinics.mjs [--dry] [--since YYYY-MM-DD]
 * Scheduled: launchd com.dentdigital.newclinics (1st of month 09:00), logs to ~/.dentdigital/outreach/new-clinics.log
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns/promises";

const DIR = dirname(fileURLToPath(import.meta.url));
const HOME = process.env.HOME;
const LIVE_DIR = resolve(HOME, ".dentdigital", "outreach");
const CSV_LIVE = resolve(LIVE_DIR, "clinics.csv");
const CSV_REPO = resolve(HOME, "Documents/DEV/DentDigital/DentDigital/outreach/clinics.csv");
const CALL_LIST = resolve(HOME, "Documents/DEV/DentDigital/DentDigital/outreach/call-list.csv");
const SENT = resolve(LIVE_DIR, "sent.log");
const STATE = resolve(LIVE_DIR, "new-clinics-state.json");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const SINCE_ARG = args.includes("--since") ? args[args.indexOf("--since") + 1] : null;

const BASE = "https://data.brreg.no/enhetsregisteret/api";
const TIMEOUT = 9000;

// ---------- state ----------
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : { lastRun: null, seen: {} };
const defaultSince = () => {
  if (state.lastRun) {
    const d = new Date(state.lastRun);
    d.setDate(d.getDate() - 7); // overlap: brreg registrations can lag
    return d.toISOString().slice(0, 10);
  }
  const d = new Date();
  d.setDate(d.getDate() - 60);
  return d.toISOString().slice(0, 10);
};
const SINCE = SINCE_ARG || defaultSince();
console.log(`[${new Date().toISOString().slice(0, 16)}] Checking brreg for dental clinics registered since ${SINCE}${DRY ? " (dry)" : ""}`);

// ---------- brreg ----------
async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: "application/json" } });
      if (r.ok) return r.json();
      if (r.status === 429) { await new Promise(s => setTimeout(s, 2000 * (i + 1))); continue; }
      throw new Error(`${r.status} ${url}`);
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise(s => setTimeout(s, 1000 * (i + 1)));
    }
  }
}

async function fetchNew(kind) {
  const all = [];
  for (let page = 0; ; page++) {
    const j = await getJson(`${BASE}/${kind}?naeringskode=86.230&fraRegistreringsdatoEnhetsregisteret=${SINCE}&size=200&page=${page}`);
    const items = j._embedded?.[kind] ?? [];
    all.push(...items);
    if (page >= (j.page?.totalPages ?? 1) - 1 || !items.length) break;
  }
  return all;
}

const PUBLIC_RE = /fylkeskommune|kommune(?!n\b)|helseforetak|universitet|høgskole|tannhelsetjenesten i|den offentlige|kompetansesenter|forsvaret|staten/i;
// big chains excluded — targeting individual clinic owners only
const CHAIN_RE = /^(oris dental|colosseum|odontia)\b/i;
// real establishment vs personal contractor company ("Tannlege Ola Nordmann ENK")
const CLINIC_RE = /(tannklinikk|tannlegesenter|tannhelse|tannlegekontor|tannlegene|dental|dentist|smil|klinikk|tenner|protese|\btann\b|odontia|colosseum|oris)/i;
const norm = (s = "") => s.toLowerCase().replace(/\s+(as|asa|ans|da|enk|sa)$/i, "").replace(/[^a-zæøå0-9]/g, "");
const cleanName = (n = "") => n.replace(/\s+(AS|ASA|ANS|DA|ENK|SA)$/i, "").replace(/\s+(v\/|ved\s+)\S.*$/i, "").replace(/\s{2,}/g, " ").trim();
const LOWER = new Set(["og", "i", "på", "ved", "av", "for", "til"]);
function titleCase(name) {
  if (name !== name.toUpperCase()) return name;
  return name.toLowerCase().split(/\s+/).map((w, i) => {
    if (i > 0 && LOWER.has(w)) return w;
    return w.replace(/^./, c => c.toUpperCase()).replace(/([-/.])(\p{Ll})/gu, (_, d, c) => d + c.toUpperCase());
  }).join(" ");
}

// ---------- existing data (dedupe) ----------
const existingEmails = new Set(), existingNames = new Set();
for (const f of [CSV_REPO, CSV_LIVE]) {
  if (!existsSync(f)) continue;
  for (const l of readFileSync(f, "utf8").split("\n").slice(1)) {
    if (!l.trim()) continue;
    const em = l.match(/[\w.+-]+@[\w.-]+/)?.[0];
    if (em) existingEmails.add(em.toLowerCase());
    existingNames.add(norm(l.replace(/^"([^"]+)".*/, "$1").split(",")[0]));
  }
}
if (existsSync(SENT)) for (const l of readFileSync(SENT, "utf8").split("\n")) {
  const em = l.split("\t")[0];
  if (em) existingEmails.add(em.toLowerCase());
}

// ---------- email crawl helpers (from crawl-emails.mjs) ----------
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
      signal: ctrl.signal, redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36" },
    });
    if (!r.ok) return null;
    if (!(r.headers.get("content-type") || "").includes("text/html")) return null;
    return { html: (await r.text()).slice(0, 400_000), finalUrl: r.url };
  } catch { return null; } finally { clearTimeout(t); }
}
const BAD_EMAIL = /(example|sentry|wix|squarespace|godaddy|wordpress|\.png|\.jpg|\.gif|\.webp|\.svg|no-?reply|privacy|webmaster|@[\d.]+$|schema)/i;
const PARKED_RE = /(domene\s*til\s*salgs|domain\s*(is\s*)?for\s*sale|parked\s*domain|domeneshop.*ledig|buy\s*this\s*domain|dan\.com|sedo)/i;
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
  for (const m of html.matchAll(/data-cfemail="([0-9a-f]+)"/gi)) {
    const e = decodeCfEmail(m[1]);
    if (e.includes("@")) out.add(e.toLowerCase());
  }
  for (const m of html.matchAll(/\b([\w.+-]+)\s*(?:\[at\]|\(at\)|\s@\s)\s*([\w-]+(?:\.[\w-]+)+\.no)\b/gi)) out.add(`${m[1]}@${m[2]}`.toLowerCase());
  return [...out].filter(e => !BAD_EMAIL.test(e) && e.length < 50);
}
function pickBest(emails, domain) {
  const onDomain = emails.filter(e => e.endsWith("@" + domain) || e.endsWith("." + domain));
  const pool = onDomain.length ? onDomain : emails;
  const pref = ["post@", "kontakt@", "hei@", "hello@", "info@", "booking@", "resepsjon@", "firmapost@", "mail@", "kontor@"];
  for (const p of pref) { const hit = pool.find(e => e.startsWith(p)); if (hit) return hit; }
  return pool[0] ?? "";
}
async function findEmail(clinic) {
  const candidates = [];
  if (clinic.website) candidates.push(clinic.website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]);
  candidates.push(...slugVariants(clinic.name));
  for (const domain of [...new Set(candidates)]) {
    if (!(await domainAlive(domain)) && !(await domainAlive("www." + domain))) continue;
    for (const base of [`https://${domain}`, `https://www.${domain}`, `http://${domain}`]) {
      const home = await fetchPage(base);
      if (!home) continue;
      if (PARKED_RE.test(home.html.slice(0, 20_000))) break;
      let emails = extractEmails(home.html);
      if (!emails.length) {
        const contactHref = home.html.match(/href="([^"]*(?:kontakt|contact)[^"]*)"/i)?.[1];
        for (const path of [contactHref, "/kontakt", "/kontakt-oss"].filter(Boolean).slice(0, 3)) {
          const url = path.startsWith("http") ? path : new URL(path, home.finalUrl || base).href;
          const page = await fetchPage(url);
          if (page) emails = extractEmails(page.html);
          if (emails.length) break;
        }
      }
      const finalDomain = (() => { try { return new URL(home.finalUrl).hostname.replace(/^www\./, ""); } catch { return domain; } })();
      return { email: pickBest(emails, finalDomain), domain: finalDomain };
    }
  }
  return { email: "", domain: "" };
}

// ---------- main ----------
const [newUnits, newParents] = await Promise.all([fetchNew("underenheter"), fetchNew("enheter")]);
console.log(`brreg: ${newUnits.length} underenheter + ${newParents.length} enheter registered since ${SINCE}`);

// merge: prefer underenheter (physical location); add enheter without a matching new underenhet
const parentOrgOfUnits = new Set(newUnits.map(u => u.overordnetEnhet));
const raw = [
  ...newUnits.map(u => ({ ...u, _addr: u.beliggenhetsadresse, _kind: "underenhet" })),
  ...newParents.filter(p => !parentOrgOfUnits.has(p.organisasjonsnummer))
    .map(p => ({ ...p, _addr: p.forretningsadresse, _kind: "enhet" })),
];

const parentByOrg = new Map(newParents.map(p => [p.organisasjonsnummer, p]));
const clinics = [];
const seenKeys = new Set();
for (const u of raw) {
  if (u.slettedato || u.nedleggelsesdatoIEnhetsregisteret || u.konkurs) continue;
  if (["KOMM", "FYLK", "STAT", "ORGL", "SF"].includes(u.organisasjonsform?.kode)) continue;
  const rawName = u.navn || "";
  if (PUBLIC_RE.test(rawName)) continue;
  if (CHAIN_RE.test(rawName)) { state.seen[u.organisasjonsnummer] = { name: rawName, action: "chain-skip" }; continue; }
  if (state.seen[u.organisasjonsnummer]) continue; // handled in a previous run

  // enrich underenhet with parent website if needed
  let website = (u.hjemmeside || "").trim().toLowerCase();
  if (!website && u.overordnetEnhet) {
    const p = parentByOrg.get(u.overordnetEnhet)
      ?? await getJson(`${BASE}/enheter/${u.overordnetEnhet}`).catch(() => null);
    website = (p?.hjemmeside || "").trim().toLowerCase();
  }

  const addr = u._addr ?? {};
  const name = cleanName(titleCase(rawName));
  const key = `${norm(name)}|${addr.postnummer ?? ""}`;
  if (seenKeys.has(key) || existingNames.has(norm(name))) { state.seen[u.organisasjonsnummer] = { name, action: "dup" }; continue; }
  seenKeys.add(key);
  clinics.push({
    orgnr: u.organisasjonsnummer,
    name,
    city: addr.poststed ? addr.poststed.charAt(0) + addr.poststed.slice(1).toLowerCase() : "",
    website,
    registered: u.registreringsdatoEnhetsregisteret ?? "",
  });
}
console.log(`New unique clinics after filtering: ${clinics.length}`);

// ---------- find emails ----------
const withEmail = [], noEmail = [];
for (const c of clinics) {
  const { email, domain } = await findEmail(c);
  if (email && !/[^\x00-\x7F]/.test(email) && !existingEmails.has(email)) {
    withEmail.push({ ...c, email, domain });
    existingEmails.add(email);
  } else {
    noEmail.push(c);
  }
  process.stdout.write(`\rcrawled ${withEmail.length + noEmail.length}/${clinics.length}, emails: ${withEmail.length}`);
}
if (clinics.length) console.log();

// ---------- retry earlier no-email clinics (new sites go live 1-3 months after registration) ----------
const justSeen = new Set(clinics.map(c => c.orgnr));
const callListCity = new Map();
if (existsSync(CALL_LIST)) for (const l of readFileSync(CALL_LIST, "utf8").split("\n").slice(1)) {
  const cells = l.split(",");
  if (cells[0]) callListCity.set(norm(cells[0]), cells[1] ?? "");
}
const retryQueue = Object.entries(state.seen).filter(([orgnr, e]) =>
  e.action === "call-list" && (e.retries ?? 0) < 3 && !justSeen.has(orgnr));
const retryHits = [];
for (const [orgnr, e] of retryQueue) {
  if (existingNames.has(norm(e.name))) { e.action = "queued"; continue; } // queued via manual research
  const { email, domain } = await findEmail({ name: e.name, website: e.website || "" });
  if (email && !/[^\x00-\x7F]/.test(email) && !existingEmails.has(email)) {
    existingEmails.add(email);
    retryHits.push({ orgnr, name: e.name, city: e.city || callListCity.get(norm(e.name)) || "", email, domain, registered: e.date ?? "" });
  } else {
    e.retries = (e.retries ?? 0) + 1;
    if (e.retries >= 3) e.action = "retry-exhausted";
  }
}
if (retryQueue.length) console.log(`Retried ${retryQueue.length} earlier no-email clinics -> ${retryHits.length} new emails found.`);
withEmail.push(...retryHits);

// ---------- write ----------
const esc = (s) => /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const csvRows = withEmail.map(c => [
  c.name, c.city, "", c.email,
  c.domain ? `https://${c.domain}` : "",
  `Nyoppstartet klinikk? Fyll kalenderen hos ${c.name} – gratis oppstartsmåned`,
  "ready – ny klinikk",
].map(esc).join(","));

// only clinic-like names go to the call list; personal ENKs are logged to state only
const callTargets = noEmail.filter(c => CLINIC_RE.test(c.name));
const personalSkipped = noEmail.filter(c => !CLINIC_RE.test(c.name));
const callRows = callTargets.map(c => [c.name, c.city, "", "", `brreg-ny ${c.registered}`, "finn kontakt", ""].map(esc).join(","));

if (DRY) {
  console.log("\n--- would insert at TOP of clinics.csv ---");
  console.log(csvRows.join("\n") || "(none)");
  console.log("\n--- would append to call-list.csv ---");
  console.log(callRows.join("\n") || "(none)");
  process.exit(0);
}

if (csvRows.length) {
  for (const f of [CSV_REPO, CSV_LIVE]) {
    try {
      const lines = readFileSync(f, "utf8").split("\n");
      lines.splice(1, 0, ...csvRows); // insert right after header => sent first
      writeFileSync(f, lines.join("\n"));
    } catch (e) {
      console.error(`WARN could not update ${f}: ${e.message}`); // launchd has no Documents access (TCC)
    }
  }
}
if (callRows.length) {
  const block = callRows.join("\n") + "\n";
  try {
    const cur = existsSync(CALL_LIST) ? readFileSync(CALL_LIST, "utf8") : "clinic,city,phone,owner,kilde,status,neste\n";
    writeFileSync(CALL_LIST, (cur.endsWith("\n") ? cur : cur + "\n") + block);
  } catch (e) {
    const fallback = resolve(LIVE_DIR, "call-list-new.csv");
    const cur = existsSync(fallback) ? readFileSync(fallback, "utf8") : "clinic,city,phone,owner,kilde,status,neste\n";
    writeFileSync(fallback, (cur.endsWith("\n") ? cur : cur + "\n") + block);
    console.error(`WARN call-list.csv blocked (${e.message}) -> wrote ${fallback}`);
  }
}

// mark retried hits as queued on the call list (best-effort)
if (retryHits.length && existsSync(CALL_LIST)) {
  try {
    const cl = readFileSync(CALL_LIST, "utf8").split("\n").map(l => {
      const hit = retryHits.find(h => l.startsWith(h.name + ","));
      return hit ? l.replace(/finn kontakt[^,]*/, "e-post funnet – i e-postkø") : l;
    }).join("\n");
    writeFileSync(CALL_LIST, cl);
  } catch { /* TCC under launchd — state file still tracks it */ }
}

for (const c of withEmail) state.seen[c.orgnr] = { name: c.name, email: c.email, action: "queued", date: c.registered };
for (const c of callTargets) state.seen[c.orgnr] = { name: c.name, city: c.city, website: c.website || "", action: "call-list", date: c.registered, retries: 0 };
for (const c of personalSkipped) state.seen[c.orgnr] = { name: c.name, action: "personal-skip", date: c.registered };
state.lastRun = new Date().toISOString().slice(0, 10);
writeFileSync(STATE, JSON.stringify(state, null, 1));

console.log(`Queued at top of clinics.csv: ${withEmail.length}. Added to call-list: ${callRows.length}. Personal ENK skipped: ${personalSkipped.length}. State -> ${STATE}`);
for (const c of withEmail) console.log(`  + ${c.name} (${c.city}) <${c.email}> reg. ${c.registered}`);
