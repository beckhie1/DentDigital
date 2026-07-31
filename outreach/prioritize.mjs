#!/usr/bin/env node
/**
 * Reorder clinics.csv by outreach priority (sent.log makes already-sent rows harmless):
 *   0 = Pakistani-owned/linked clinics (kilder/pak-oslo-clinics.csv + name heuristic)
 *   1 = Oslo & surrounding (same town list as send.mjs NEAR_OSLO)
 *   2 = everything else
 * Stable within groups. Applies to BOTH repo and live CSV.
 * Usage: node outreach/prioritize.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const FILES = [resolve(DIR, "clinics.csv"), resolve(process.env.HOME, ".dentdigital", "outreach", "clinics.csv")];
const PAK_SRC = resolve(DIR, "kilder", "pak-oslo-clinics.csv");
const DRY = process.argv.includes("--dry");

const NEAR_OSLO = [
  "oslo", "lørenskog", "lillestrøm", "strømmen", "kjeller", "fetsund", "rælingen",
  "skedsmokorset", "nittedal", "gjerdrum", "jessheim", "kløfta", "ullensaker",
  "nannestad", "maura", "eidsvoll", "årnes", "bjørkelangen", "enebakk",
  "bekkestua", "lysaker", "sandvika", "hosle", "fornebu", "bærum", "asker",
  "sætre", "spikkestad", "billingstad", "drammen", "lierbyen", "lier",
  "ski", "langhus", "kolbotn", "sofiemyr", "oppegård", "greverud", "nesodden",
  "vestby", "drøbak", "moss",
];

// Person-name tokens common among Pakistani-Norwegian clinic owners (word-boundary matched).
const PAK_TOKENS = [
  "khan", "malik", "butt", "hussain", "hussein", "qureshi", "zaidi", "ahmed", "ahmad",
  "raza", "iqbal", "sheikh", "shaikh", "syed", "akhtar", "anwar", "aziz", "bhatti",
  "chaudhry", "chaudhary", "javed", "kazmi", "mahmood", "mehmood", "mirza", "mushtaq",
  "nawaz", "rashid", "sarwar", "tariq", "yousaf", "yousuf", "zafar", "dilshad",
  "rafique", "arshad", "aslam", "bashir", "farooq", "hameed", "hamid", "hassan",
  "kausar", "saeed", "salman", "shahzad", "abbas", "afnan", "sadia", "aisha",
];
const PAK_RE = new RegExp(`\\b(${PAK_TOKENS.join("|")})\\b`, "i");
const FALSE_POS = /mo i rana/i;

// clinic names explicitly on the Pakistani list (kilder)
const norm = (s = "") => s.toLowerCase().replace(/\s*\(.*\)$/, "").trim();
const pakNames = new Set(
  readFileSync(PAK_SRC, "utf8").split("\n").slice(1)
    .map(l => norm(l.split(",")[0])).filter(Boolean)
);

function priority(row) {
  const cells = row.split(",");
  const clinic = cells[0] ?? "", city = cells[1] ?? "", contact = cells[2] ?? "";
  const hay = `${clinic} ${contact}`;
  if (pakNames.has(norm(clinic))) return 0;
  if (!FALSE_POS.test(hay) && PAK_RE.test(hay)) return 0;
  const c = city.toLowerCase();
  if (NEAR_OSLO.some(t => c.includes(t))) return 1;
  return 2;
}

for (const f of FILES) {
  const lines = readFileSync(f, "utf8").split("\n");
  const header = lines[0];
  const rows = lines.slice(1).filter(l => l.trim());
  const groups = [[], [], []];
  for (const r of rows) groups[priority(r)].push(r);
  if (DRY) {
    console.log(`${f}\n  pak: ${groups[0].length}, near-oslo: ${groups[1].length}, rest: ${groups[2].length}`);
    console.log("  pak rows:", groups[0].map(r => r.split(",")[0]).join(" | "));
    continue;
  }
  writeFileSync(f, [header, ...groups[0], ...groups[1], ...groups[2]].join("\n") + "\n");
  console.log(`${f}: reordered (pak ${groups[0].length} → near-oslo ${groups[1].length} → rest ${groups[2].length})`);
}
