#!/usr/bin/env node
/**
 * Merge harvested clinics (crawler results + chain agent research) into clinics.csv.
 * Dedupes against existing rows, sent.log, and within the new batch.
 * Writes to BOTH repo CSV and live ~/.dentdigital/outreach/clinics.csv.
 * Usage: node outreach/merge-harvest.mjs [--dry]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const HARVEST = resolve(DIR, "harvest");
const CSV_REPO = resolve(DIR, "clinics.csv");
const CSV_LIVE = resolve(process.env.HOME, ".dentdigital", "outreach", "clinics.csv");
const SENT = resolve(process.env.HOME, ".dentdigital", "outreach", "sent.log");
const DRY = process.argv.includes("--dry");

const norm = (s = "") => s.toLowerCase().replace(/\s+(as|asa|ans|da|enk|sa)$/i, "").replace(/[^a-zæøå0-9]/g, "");
const PLACEHOLDER_RE = /@(yourdomain|example|domain|email|test|mysite|sitename|company|mail)\.(com|no|net|org)$/i;
// big chains excluded — targeting individual clinic owners only
const CHAIN_RE = /^(oris dental|colosseum|odontia)\b|@(orisdental|colosseum|odontia)\.no/i;
// strip "v/Person Name" / "ved Person Name" suffixes from registry names
const cleanClinic = (s = "") => s.replace(/\s+(v\/|ved\s+)\S.*$/i, "").trim();

// ---------- existing state ----------
const repoCsv = readFileSync(CSV_REPO, "utf8");
const existingEmails = new Set(), existingNames = new Set();
for (const l of repoCsv.split("\n").slice(1)) {
  const em = l.match(/[\w.+-]+@[\w.-]+/)?.[0];
  if (em) existingEmails.add(em.toLowerCase());
  if (l.trim()) existingNames.add(norm(l.split(",")[0]));
}
if (existsSync(SENT)) for (const l of readFileSync(SENT, "utf8").split("\n")) {
  const em = l.split("\t")[0];
  if (em) existingEmails.add(em.toLowerCase());
}

// ---------- title-case registry ALL-CAPS names ----------
const LOWER = new Set(["og", "i", "på", "ved", "av", "for", "til"]);
function titleCase(name) {
  if (name !== name.toUpperCase()) return name; // already mixed case
  return name.toLowerCase().split(/\s+/).map((w, i) => {
    if (i > 0 && LOWER.has(w)) return w;
    if (/^(as|asa|ans|da)$/.test(w)) return w.toUpperCase();
    return w.replace(/^./, c => c.toUpperCase()).replace(/([-/.])(\p{Ll})/gu, (_, d, c) => d + c.toUpperCase());
  }).join(" ");
}

// ---------- subject templates (rotate for variety) ----------
const SUBJECTS = [
  (c) => `Flere pasienter til ${c} – gratis oppstartsmåned`,
  (c) => `Flere timebestillinger til ${c} – gratis oppstartsmåned`,
  (c) => `Fyll kalenderen hos ${c} – gratis oppstartsmåned`,
];

// ---------- collect candidates ----------
const candidates = [];

// 1. crawler results
const crawlFile = resolve(HARVEST, "crawl-results.json");
if (existsSync(crawlFile)) {
  for (const r of Object.values(JSON.parse(readFileSync(crawlFile, "utf8")))) {
    if (!r.email) continue;
    candidates.push({
      clinic: cleanClinic(titleCase(r.name)),
      city: r.city || r.municipality || "",
      email: r.email.toLowerCase(),
      website: r.foundDomain ? `https://${r.foundDomain}` : "",
      source: "brreg-crawl",
    });
  }
}

// 2. chain files (pipe-delimited: Name|City|Email|URL)
for (const f of readdirSync(HARVEST).filter(f => f.startsWith("chains-"))) {
  for (const line of readFileSync(resolve(HARVEST, f), "utf8").split("\n")) {
    const parts = line.trim().split("|");
    if (parts.length < 4 || !parts[2].includes("@")) continue;
    const [name, city, email, url] = parts.map(s => s.trim());
    candidates.push({
      clinic: name,
      city: city.replace(/\s*\(.*\)$/, ""), // "Lysaker (Bærum)" -> "Lysaker"
      email: email.toLowerCase(),
      website: url.split("/").slice(0, 3).join("/"),
      source: f.replace("chains-", "").replace(".txt", ""),
    });
  }
}

// ---------- dedupe & build rows ----------
const newEmails = new Set(), newNames = new Set();
const rows = [];
let skipped = { email: 0, name: 0, invalid: 0 };
for (const c of candidates) {
  if (CHAIN_RE.test(c.clinic) || CHAIN_RE.test(c.email)) { skipped.invalid++; continue; }
  if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(c.email) || /[^\x00-\x7F]/.test(c.email) || PLACEHOLDER_RE.test(c.email)) { skipped.invalid++; continue; }
  if (existingEmails.has(c.email) || newEmails.has(c.email)) { skipped.email++; continue; }
  const nk = norm(c.clinic);
  if (existingNames.has(nk) || newNames.has(nk)) { skipped.name++; continue; }
  newEmails.add(c.email); newNames.add(nk);
  const subject = SUBJECTS[rows.length % SUBJECTS.length](c.clinic);
  const esc = (s) => /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  rows.push([c.clinic, c.city, "", c.email, c.website, subject, "ready"].map(esc).join(","));
}

console.log(`Candidates: ${candidates.length}. New rows: ${rows.length}. Skipped — dup email: ${skipped.email}, dup name: ${skipped.name}, invalid: ${skipped.invalid}`);
const bySource = {};
for (const c of candidates) bySource[c.source] = (bySource[c.source] || 0) + 1;
console.log("By source:", bySource);

if (DRY) { console.log("\nSample:\n" + rows.slice(0, 8).join("\n")); process.exit(0); }

const block = rows.join("\n") + "\n";
for (const f of [CSV_REPO, CSV_LIVE]) {
  const cur = readFileSync(f, "utf8");
  writeFileSync(f, cur.endsWith("\n") ? cur + block : cur + "\n" + block);
}
console.log(`Appended ${rows.length} rows to repo + live CSV.`);
