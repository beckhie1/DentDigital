#!/usr/bin/env node
// Harvest dental clinics from Google Places API (New) Text Search.
// Usage: node harvest-places.mjs <city> [city2 ...]
// Requires GOOGLE_PLACES_API_KEY in env. Dedups against clinics.csv, skips chains.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.GOOGLE_PLACES_API_KEY;
let bearer;
if (!KEY) {
  // fallback: service-account OAuth, read raw from GDTS-secrets.env (sourcing mangles the JSON)
  let saRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!saRaw || !saRaw.startsWith("{")) {
    const secrets = fs.readFileSync(new URL("../GDTS-secrets.env", import.meta.url), "utf8");
    saRaw = secrets.match(/^GOOGLE_SERVICE_ACCOUNT_KEY=(.+)$/m)?.[1];
  }
  if (!saRaw) { console.error("Mangler GOOGLE_PLACES_API_KEY eller GOOGLE_SERVICE_ACCOUNT_KEY"); process.exit(1); }
  const sa = JSON.parse(saRaw);
  const { createSign } = await import("node:crypto");
  const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const jwtBody = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: sa.client_email, scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: sa.token_uri, iat: now, exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(jwtBody).sign(sa.private_key).toString("base64url");
  const tr = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtBody}.${sig}`,
  });
  if (!tr.ok) { console.error("OAuth-feil:", (await tr.text()).slice(0, 300)); process.exit(1); }
  bearer = (await tr.json()).access_token;
}

const cities = process.argv.slice(2);
if (!cities.length) { console.error("Bruk: node harvest-places.mjs <by> [by2 ...]"); process.exit(1); }

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CLINICS_CSV = path.join(DIR, "clinics.csv");
const OUT = path.join(DIR, "harvest", `places-${new Date().toISOString().slice(0, 10)}.csv`);

const CHAINS = /colosseum|oris (tannlege|dental)|odontia|tannhelsetjenesten|den offentlige|universitetstannklinikk/i;
const PUBLIC_DOMAIN = /fylke|kommune|\bbfk\.no|tkmidt|tkvest|tannhelserogaland/i;

const norm = s => s.toLowerCase()
  .replace(/\b(as|asa|da|anf|tannklinikk|tannlegesenter|tannlege|tannlegene|tannhelse)\b/g, "")
  .replace(/[^a-zæøå0-9]/g, "");
const domainOf = url => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };

// existing names + domains from clinics.csv
const known = { names: new Set(), domains: new Set() };
for (const line of fs.readFileSync(CLINICS_CSV, "utf8").split("\n").slice(1)) {
  const parts = line.split(",");
  if (parts.length < 5) continue;
  const n = norm(parts[0]);
  if (n) known.names.add(n);
  const d = domainOf(parts[4]?.trim());
  if (d) known.domains.add(d);
}
// also dedup against today's harvest file (append mode)
const existingOut = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").trim() : "";
for (const line of existingOut.split("\n").slice(1)) {
  const name = line.match(/^"([^"]*)"/)?.[1];
  if (name) known.names.add(norm(name));
  const web = line.match(/"(https?:[^"]*)"/)?.[1];
  const d = domainOf(web || "");
  if (d) known.domains.add(d);
}

async function searchCity(city) {
  const results = [];
  let pageToken;
  do {
    const body = { textQuery: `tannlege i ${city}`, languageCode: "no", regionCode: "NO", pageSize: 20 };
    if (pageToken) body.pageToken = pageToken;
    const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(KEY ? { "X-Goog-Api-Key": KEY } : { Authorization: `Bearer ${bearer}` }),
        "X-Goog-FieldMask": [
          "places.displayName", "places.formattedAddress", "places.nationalPhoneNumber",
          "places.websiteUri", "places.rating", "places.userRatingCount", "places.businessStatus",
          "nextPageToken",
        ].join(","),
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) { console.error(`  API-feil ${r.status}: ${(await r.text()).slice(0, 200)}`); break; }
    const j = await r.json();
    results.push(...(j.places || []));
    pageToken = j.nextPageToken;
    if (pageToken) await new Promise(res => setTimeout(res, 2000)); // token needs a moment
  } while (pageToken && results.length < 60);
  return results;
}

const rows = existingOut ? [] : [["clinic", "city", "address", "phone", "website", "rating", "reviews", "status"]];
let totNew = 0, totDupe = 0, totSkip = 0;

for (const city of cities) {
  const places = await searchCity(city);
  let nNew = 0;
  for (const p of places) {
    const name = p.displayName?.text || "";
    if (!name || p.businessStatus === "CLOSED_PERMANENTLY") { totSkip++; continue; }
    if (CHAINS.test(name)) { totSkip++; continue; }
    const dom = domainOf(p.websiteUri || "");
    if (PUBLIC_DOMAIN.test(dom)) { totSkip++; continue; }
    const dupe = known.names.has(norm(name)) || (dom && known.domains.has(dom));
    if (dupe) { totDupe++; continue; }
    known.names.add(norm(name)); if (dom) known.domains.add(dom);
    rows.push([
      name, city, p.formattedAddress || "", p.nationalPhoneNumber || "",
      p.websiteUri || "", p.rating ?? "", p.userRatingCount ?? "", "new",
    ].map(v => `"${String(v).replace(/"/g, '""')}"`));
    nNew++; totNew++;
  }
  console.log(`${city}: ${places.length} funnet, ${nNew} nye`);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const chunk = rows.map(r => (Array.isArray(r) ? r.join(",") : r)).join("\n");
fs.writeFileSync(OUT, (existingOut ? existingOut + "\n" : "") + chunk + "\n");
console.log(`\nTotalt: ${totNew} nye, ${totDupe} duplikater, ${totSkip} hoppet over (kjeder/stengt)`);
console.log(`Skrevet til ${OUT}`);
console.log("Neste steg: crawl e-post fra websites -> legg i clinics.csv");
