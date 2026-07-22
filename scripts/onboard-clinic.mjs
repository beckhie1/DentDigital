#!/usr/bin/env node
/**
 * DentDigital — onboard a new clinic in one command.
 *
 * Creates the clinic's Google Sheet (Leads + Tilbakemeldinger tabs), shares it
 * with the clinic and you, and appends the clinic to src/lib/clinics.ts.
 * Push to deploy — the three landing pages are generated at build time:
 *
 *   dentdigital.no/{slug}-tilbud
 *   dentdigital.no/{slug}-tannlegevakt
 *   dentdigital.no/{feedbackCode}
 *
 * Usage:
 *   node scripts/onboard-clinic.mjs \
 *     --name "Groruddalen Tannlegesenter" \
 *     --email "post@klinikken.no" \
 *     --phone "+47 92 02 92 02" \
 *     --address "Kakkelovnskroken 3, 0954 Oslo" \
 *     --review-url "https://search.google.com/local/writereview?placeid=..." \
 *     [--vakt-phone "+47 ..."]        (defaults to --phone)
 *     [--share-with you@gmail.com]    (extra editor on the sheet)
 *     [--sheet-id <existing id>]      (skip sheet creation, reuse an existing one)
 *     [--dry-run]                     (print what would happen, change nothing)
 *
 * One-time setup:
 *   1. Runtime (Vercel): GOOGLE_SERVICE_ACCOUNT_KEY in .env.local + Vercel env — the
 *      service account only APPENDS rows to sheets shared with it.
 *   2. Creation (this CLI): sheets are created AS YOU via gcloud user credentials, so
 *      you own them in your Drive. One-time:
 *        gcloud auth application-default login \
 *          --scopes="openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets"
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { GoogleAuth } from "google-auth-library";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = resolve(ROOT, "src/lib/clinics.ts");
const MARKER = "// ⟪ONBOARD:INSERT⟫";

/* ── args ─────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
};
const name = get("--name");
const email = get("--email");
const phone = get("--phone");
const address = get("--address");
const reviewUrl = get("--review-url");
const vaktPhone = get("--vakt-phone");
const shareWith = get("--share-with");
const existingSheetId = get("--sheet-id");
const dryRun = args.includes("--dry-run");

if (!name || !email || !phone || !address || !reviewUrl) {
  console.error(`Mangler påkrevde felt.

Bruk:
  node scripts/onboard-clinic.mjs \\
    --name "Klinikk Navn" --email "post@klinikk.no" --phone "+47 ..." \\
    --address "Gate 1, 0001 Oslo" --review-url "https://search.google.com/local/writereview?placeid=..."

Valgfritt: --vakt-phone, --share-with, --sheet-id, --dry-run`);
  process.exit(1);
}

/* ── derive slug + feedback code ──────────────────────────── */
const slug = name
  .toLowerCase()
  .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const registrySrc = readFileSync(REGISTRY, "utf8");
if (!registrySrc.includes(MARKER)) {
  console.error(`Fant ikke markøren "${MARKER}" i src/lib/clinics.ts`);
  process.exit(1);
}
if (registrySrc.includes(`slug: "${slug}"`)) {
  console.error(`Klinikk med slug "${slug}" finnes allerede i registeret.`);
  process.exit(1);
}

function genCode() {
  // 7 chars, unambiguous lowercase alphanumerics
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  const bytes = randomBytes(7);
  for (const b of bytes) code += alphabet[b % alphabet.length];
  return code;
}
let feedbackCode = genCode();
while (registrySrc.includes(`"${feedbackCode}"`)) feedbackCode = genCode();

/* ── google auth ──────────────────────────────────────────── */
function loadServiceKey() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  try {
    const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
    const m = env.match(/^GOOGLE_SERVICE_ACCOUNT_KEY=(.*)$/m);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  } catch {}
  return null;
}

/** Runtime writer identity — the sheet must be shared with this address. */
function serviceAccountEmail() {
  const keyJson = loadServiceKey();
  if (!keyJson) return null;
  try {
    return JSON.parse(keyJson).client_email ?? null;
  } catch {
    return null;
  }
}

/**
 * Sheets are created AS YOU (user credentials via gcloud ADC) so that you own
 * them — service accounts have zero Drive quota and cannot own files.
 */
async function getUserToken() {
  const auth = new GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
  } catch (e) {
    console.error(`Kunne ikke hente brukertoken (${e.message}).

Kjør én gang:
  gcloud auth application-default login \\
    --scopes="openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets"`);
    process.exit(1);
  }
}

async function api(url, method, token, body) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${await res.text()}`);
  return res.json();
}

/* ── create + share the sheet ─────────────────────────────── */
const LEAD_HEADERS = [
  "Dato", "Tidspunkt", "Navn", "E-post", "Telefon", "Ønsket tidspunkt",
  "Tannbleking", "Kilde", "Status", "Antall kontaktpunkt", "Kommentar", "UTM",
  "Event ID", "fbp", "fbc", "Meta synk",
];
const FEEDBACK_HEADERS = ["Dato", "Tidspunkt", "Vurdering", "Navn", "Telefon", "Kommentar", "Fulgt opp"];

async function createSheet(token) {
  const created = await api("https://sheets.googleapis.com/v4/spreadsheets", "POST", token, {
    properties: { title: `Leads-${name}-dentdigital`, locale: "no_NO", timeZone: "Europe/Oslo" },
    sheets: [
      { properties: { title: "Leads", gridProperties: { frozenRowCount: 1 } } },
      { properties: { title: "Tilbakemeldinger", gridProperties: { frozenRowCount: 1 } } },
    ],
  });
  const id = created.spreadsheetId;

  // header rows
  await api(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchUpdate`,
    "POST",
    token,
    {
      valueInputOption: "RAW",
      data: [
        { range: "Leads!A1", values: [LEAD_HEADERS] },
        { range: "Tilbakemeldinger!A1", values: [FEEDBACK_HEADERS] },
      ],
    },
  );

  // share: clinic + the runtime service account get editor access.
  // (You own the file — no share needed for yourself.)
  const saEmail = serviceAccountEmail();
  const grants = [{ role: "writer", type: "user", emailAddress: email }];
  if (saEmail) grants.push({ role: "writer", type: "user", emailAddress: saEmail });
  if (shareWith) grants.push({ role: "writer", type: "user", emailAddress: shareWith });
  for (const g of grants) {
    const notify = g.emailAddress !== saEmail; // no notification email to the robot
    await api(
      `https://www.googleapis.com/drive/v3/files/${id}/permissions?sendNotificationEmail=${notify}`,
      "POST",
      token,
      g,
    );
  }
  return { id, saEmail };
}

/* ── registry entry ───────────────────────────────────────── */
function registryEntry(spreadsheetId) {
  const vakt = vaktPhone ? `\n    vaktPhone: ${JSON.stringify(vaktPhone)},` : "";
  return `  {
    slug: ${JSON.stringify(slug)},
    name: ${JSON.stringify(name)},
    email: ${JSON.stringify(email)},
    phone: ${JSON.stringify(phone)},
    address: ${JSON.stringify(address)},
    spreadsheetId: ${JSON.stringify(spreadsheetId)},
    googleReviewUrl: ${JSON.stringify(reviewUrl)},
    feedbackCode: ${JSON.stringify(feedbackCode)},${vakt}
    active: true,
    offer: DEFAULT_OFFER,
  },
  ${MARKER}`;
}

/* ── run ──────────────────────────────────────────────────── */
console.log(`\nOnboarder: ${name}`);
console.log(`  slug:          ${slug}`);
console.log(`  feedback-kode: ${feedbackCode}`);

if (dryRun) {
  console.log("\n--dry-run: ingen endringer gjort. Registeroppføring som ville blitt lagt til:\n");
  console.log(registryEntry(existingSheetId ?? "<ny-sheet-id>"));
  process.exit(0);
}

let spreadsheetId = existingSheetId;
if (!spreadsheetId) {
  const { id, saEmail } = await createSheet(await getUserToken());
  spreadsheetId = id;
  console.log(`  Google Sheet:  https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
  console.log(`  Eier:          deg (personlig Google-konto)`);
  console.log(`  Delt med:      ${email}${saEmail ? `, ${saEmail} (runtime)` : ""}${shareWith ? `, ${shareWith}` : ""}`);
  if (!saEmail)
    console.warn("  ⚠️ Fant ikke service-kontoen i .env.local — del arket manuelt med den, ellers feiler runtime-skriving.");
} else {
  console.log(`  Google Sheet:  https://docs.google.com/spreadsheets/d/${spreadsheetId} (eksisterende)`);
}

writeFileSync(REGISTRY, registrySrc.replace(MARKER, registryEntry(spreadsheetId)));
console.log(`  Registeroppdatering: src/lib/clinics.ts ✓`);

console.log(`
Sider (live etter neste deploy):
  https://www.dentdigital.no/${slug}-tilbud
  https://www.dentdigital.no/${slug}-tannlegevakt
  https://www.dentdigital.no/${feedbackCode}

Neste steg:
  1. npm run build            (verifiser)
  2. git acp "onboard: ${name}"   → Vercel deployer automatisk
  3. Sjekk at GOOGLE_SERVICE_ACCOUNT_KEY er satt i Vercel env
`);
