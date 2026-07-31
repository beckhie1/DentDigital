#!/usr/bin/env node
/**
 * Harvest all Norwegian dental clinics from Brønnøysundregisteret (open data, NLOD).
 * NACE 86.230 = Tannhelsetjenester. Pulls underenheter (physical locations) —
 * these carry the street address/city — and enriches with parent enhet (website).
 * Output: outreach/harvest/brreg-clinics.json
 * Usage: node outreach/harvest-brreg.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(DIR, "harvest");
mkdirSync(OUT_DIR, { recursive: true });

const BASE = "https://data.brreg.no/enhetsregisteret/api";

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

async function fetchAll(kind) {
  // API caps page*size at 10000; 5.9k rows fits.
  const key = kind === "enheter" ? "enheter" : "underenheter";
  const all = [];
  for (let page = 0; ; page++) {
    const j = await getJson(`${BASE}/${kind}?naeringskode=86.230&size=500&page=${page}`);
    const items = j._embedded?.[key] ?? [];
    all.push(...items);
    process.stdout.write(`\r${kind}: ${all.length}/${j.page.totalElements}`);
    if (page >= j.page.totalPages - 1 || !items.length) break;
  }
  console.log();
  return all;
}

const PUBLIC_RE = /fylkeskommune|kommune(?!n\b)|helseforetak|universitet|høgskole|tannhelsetjenesten i|den offentlige|kompetansesenter|forsvaret|staten/i;

function cleanName(n = "") {
  return n
    .replace(/\s+(AS|ASA|ANS|DA|ENK|SA)$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Looks like a real multi-person clinic rather than a personal contractor company:
// personal companies are typically "TANNLEGE OLA NORDMANN" / "OLA NORDMANN" / "NORDMANN DENTAL".
function looksLikeClinic(name = "") {
  const n = name.toLowerCase();
  if (/(tannklinikk|tannlegesenter|tannhelsesenter|tannlegekontor|tannlegene|tannhelse|dental|dentist|smil|odontia|colosseum|oris)/.test(n)) return true;
  // "tannlege <person name>" → personal; keep only if it also has a place-ish word
  return false;
}

const main = async () => {
  const [units, parents] = await Promise.all([fetchAll("underenheter"), fetchAll("enheter")]);
  const parentByOrg = new Map(parents.map(p => [p.organisasjonsnummer, p]));

  const rows = [];
  for (const u of units) {
    if (u.slettedato || u.nedleggelsesdatoIEnhetsregisteret) continue; // closed
    const parent = parentByOrg.get(u.overordnetEnhet);
    if (parent?.slettedato || parent?.konkurs) continue;
    if (parent?.organisasjonsform?.kode && ["KOMM", "FYLK", "STAT", "ORGL", "SF"].includes(parent.organisasjonsform.kode)) continue;
    const rawName = u.navn || parent?.navn || "";
    if (PUBLIC_RE.test(rawName) || PUBLIC_RE.test(parent?.navn ?? "")) continue;

    const addr = u.beliggenhetsadresse ?? {};
    const city = addr.poststed ? addr.poststed.charAt(0) + addr.poststed.slice(1).toLowerCase() : "";
    const website = (u.hjemmeside || parent?.hjemmeside || "").trim().toLowerCase();

    rows.push({
      orgnr: u.organisasjonsnummer,
      parentOrgnr: u.overordnetEnhet ?? "",
      name: cleanName(rawName),
      clinicLike: looksLikeClinic(rawName),
      city,
      postcode: addr.postnummer ?? "",
      municipality: addr.kommune ? addr.kommune.charAt(0) + addr.kommune.slice(1).toLowerCase() : "",
      website,
      employees: u.antallAnsatte ?? 0,
      founded: u.oppstartsdato ?? "",
    });
  }

  // Dedupe: same cleaned name + postcode (chains register duplicates)
  const seen = new Set();
  const deduped = rows.filter(r => {
    const k = `${r.name.toLowerCase()}|${r.postcode}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  writeFileSync(resolve(OUT_DIR, "brreg-clinics.json"), JSON.stringify(deduped, null, 1));
  const withSite = deduped.filter(r => r.website).length;
  const clinicLike = deduped.filter(r => r.clinicLike).length;
  console.log(`Active private locations: ${deduped.length}`);
  console.log(`  clinic-like names: ${clinicLike}`);
  console.log(`  with website in registry: ${withSite}`);
  const byCounty = {};
  for (const r of deduped) byCounty[r.postcode.slice(0, 1)] = (byCounty[r.postcode.slice(0, 1)] || 0) + 1;
  console.log("  by postcode region:", byCounty);
};

main();
