#!/usr/bin/env node
/**
 * DentDigital outreach sender (Resend).
 * Usage:
 *   node outreach/send.mjs                 -> dry-run, shows first batch
 *   node outreach/send.mjs --test you@x.no -> sends ONE sample to yourself
 *   node outreach/send.mjs --send          -> sends next batch (default 8)
 *   node outreach/send.mjs --send --limit 5
 * Already-sent addresses are logged in outreach/sent.log and skipped.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const CSV = resolve(DIR, "clinics.csv");
const LOG = resolve(DIR, "sent.log");
const FROM = "Muhammad Umar Nadeem <post@dentdigital.no>";
const REPLY_TO = "post@dentdigital.no";

const args = process.argv.slice(2);
const SEND = args.includes("--send");
const PREVIEW = args.includes("--preview");
const TEST = args.includes("--test") ? args[args.indexOf("--test") + 1] : null;
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : 8;

const key = (() => {
  const env = readFileSync(resolve(DIR, "..", ".env.local"), "utf8");
  const m = env.match(/^RESEND_API_KEY="?([^"\n]+)"?/m);
  if (!m) throw new Error("RESEND_API_KEY not found in .env.local");
  return m[1];
})();

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); field = ""; if (row.some(f => f.trim())) rows.push(row); row = []; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); if (row.some(f => f.trim())) rows.push(row); }
  return rows;
}

/** Towns within ~50 km of Oslo — only these get the «kommer gjerne innom» offer. */
const NEAR_OSLO = [
  "oslo", "lørenskog", "lillestrøm", "strømmen", "kjeller", "fetsund", "rælingen",
  "skedsmokorset", "nittedal", "gjerdrum", "jessheim", "kløfta", "ullensaker",
  "nannestad", "maura", "eidsvoll", "årnes", "bjørkelangen", "enebakk",
  "bekkestua", "lysaker", "sandvika", "hosle", "fornebu", "bærum", "asker",
  "sætre", "spikkestad", "billingstad", "drammen", "lierbyen", "lier",
  "ski", "langhus", "kolbotn", "sofiemyr", "oppegård", "greverud", "nesodden",
  "vestby", "drøbak", "moss",
];

function isNearOslo(city = "") {
  const c = city.toLowerCase();
  return NEAR_OSLO.some((t) => c.includes(t));
}

function closingLine(city, html = false) {
  return isNearOslo(city)
    ? "Har du 15 minutter til en uforpliktende prat denne uken? Jeg kommer gjerne innom klinikken hvis det er enklere."
    : "Har du 15 minutter til en uforpliktende prat denne uken – over telefon eller Teams, når det passer deg?";
}

function body({ contact_name, clinic, city }) {
  const hei = contact_name ? `Hei ${contact_name},` : "Hei,";
  return `${hei}

Jeg heter Muhammad Umar Nadeem og driver DentDigital – vi jobber utelukkende med digital markedsføring for tannklinikker i Norge.

Jeg kom over ${clinic} og ser et klart potensial for å hente flere pasienter fra Google og sosiale medier enn dere gjør i dag. Det som skiller oss fra generelle byråer: vi har et eget medieteam som produserer profesjonelle videoer skreddersydd for tannbehandlinger – Invisalign, tannbleking, førstegangsundersøkelse – innhold som faktisk konverterer til timebestillinger, ikke generiske stockbilder.

Kort om hva vi leverer:

- Google- og Meta-annonsering målt på bookede timer – ikke klikk
- Profesjonell videoproduksjon tilpasset deres behandlinger
- Nettside/landingssider bygget for flere timebestillinger
- Automatisk pasientoppfølging og systematisk innsamling av flere Google-anmeldelser

Første måned er gratis – dere betaler kun de faktiske annonsekostnadene til Google og Meta. Vi tar ingenting for arbeidet i denne perioden.

${closingLine(city)}

Med vennlig hilsen

Muhammad Umar Nadeem
Business Development Manager
DentDigital – Digital partner for norske tannklinikker
post@dentdigital.no · www.dentdigital.no`;
}

function htmlBody({ contact_name, clinic, city }) {
  const hei = contact_name ? `Hei ${contact_name},` : "Hei,";
  const p = (t) => `<p style="margin:0 0 16px;">${t}</p>`;
  return `<!DOCTYPE html>
<html lang="nb"><body style="margin:0;padding:24px;background:#fafaf8;">
<div style="max-width:600px;margin:0 auto;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#111110;">
${p(hei)}
${p("Jeg heter Muhammad Umar Nadeem og driver DentDigital – vi jobber utelukkende med digital markedsføring for tannklinikker i Norge.")}
${p(`Jeg kom over <strong>${clinic}</strong> og ser et klart potensial for å hente flere pasienter fra Google og sosiale medier enn dere gjør i dag. Det som skiller oss fra generelle byråer: vi har et eget medieteam som produserer profesjonelle videoer skreddersydd for tannbehandlinger – Invisalign, tannbleking, førstegangsundersøkelse – innhold som faktisk konverterer til timebestillinger, ikke generiske stockbilder.`)}
${p("<strong>Kort om hva vi leverer:</strong>")}
<ul style="margin:0 0 16px;padding-left:20px;">
  <li style="margin-bottom:6px;">Google- og Meta-annonsering målt på bookede timer – ikke klikk</li>
  <li style="margin-bottom:6px;">Profesjonell videoproduksjon tilpasset deres behandlinger</li>
  <li style="margin-bottom:6px;">Nettside/landingssider bygget for flere timebestillinger</li>
  <li style="margin-bottom:6px;">Automatisk pasientoppfølging og systematisk innsamling av flere Google-anmeldelser</li>
</ul>
${p("<strong>Første måned er gratis</strong> – dere betaler kun de faktiske annonsekostnadene til Google og Meta. Vi tar ingenting for arbeidet i denne perioden.")}
${p(closingLine(city))}
${p("Med vennlig hilsen")}

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-left:3px solid #00c2b8;">
  <tr><td style="padding:10px 16px;">
    <p style="margin:0;font-size:16px;font-weight:700;color:#111110;">Muhammad Umar Nadeem</p>
    <p style="margin:2px 0 8px;font-size:13px;color:#55554f;">Business Development Manager</p>
    <p style="margin:0;font-size:15px;font-weight:800;letter-spacing:-0.02em;">Dent<span style="color:#007a73;">Digital</span></p>
    <p style="margin:2px 0 0;font-size:12px;color:#8b8b84;">Digital partner for norske tannklinikker</p>
    <p style="margin:6px 0 0;font-size:13px;">
      <a href="https://www.dentdigital.no" style="color:#007a73;text-decoration:none;">www.dentdigital.no</a>
      &nbsp;·&nbsp;
      <a href="mailto:post@dentdigital.no" style="color:#007a73;text-decoration:none;">post@dentdigital.no</a>
    </p>
  </td></tr>
</table>
</div>
</body></html>`;
}

const [header, ...rows] = parseCsv(readFileSync(CSV, "utf8"));
const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
const sent = existsSync(LOG) ? new Set(readFileSync(LOG, "utf8").split("\n").map(l => l.split("\t")[0]).filter(Boolean)) : new Set();

const seen = new Set();
const queue = rows
  .map(r => ({
    clinic: r[col.clinic], city: r[col.city], contact_name: r[col.contact_name],
    email: (r[col.email] || "").trim().toLowerCase(), subject: r[col.subject], status: r[col.status] || "",
  }))
  .filter(c => c.email && c.status.startsWith("ready") && !sent.has(c.email) && !seen.has(c.email) && seen.add(c.email));

async function sendOne(to, subject, c) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, text: body(c), html: htmlBody(c) }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json.id;
}

if (PREVIEW) {
  const { writeFileSync } = await import("node:fs");
  // verify clinic-name interpolation across the entire queue
  let bad = 0;
  for (const c of queue) {
    if (!body(c).includes(c.clinic) || !htmlBody(c).includes(`<strong>${c.clinic}</strong>`) || !c.subject.includes("–")) {
      console.log(`⚠ check: "${c.clinic}" — subject: "${c.subject}"`);
      bad++;
    }
  }
  console.log(`Verified ${queue.length} emails: clinic name correctly placed in ${queue.length - bad}, flagged ${bad}.`);
  const c = queue[0];
  writeFileSync(resolve(DIR, "preview.html"), htmlBody(c));
  console.log(`Preview written for "${c.clinic}" -> outreach/preview.html`);
  process.exit(0);
}

if (TEST) {
  const c = queue[0] ?? { clinic: "Eksempel Tannklinikk", city: "Oslo", contact_name: "", subject: "Test – gratis oppstartsmåned", email: TEST };
  const id = await sendOne(TEST, `[TEST] ${c.subject}`, c);
  console.log(`Test sent to ${TEST} (id ${id}) using data for "${c.clinic}"`);
  process.exit(0);
}

const batch = queue.slice(0, LIMIT);
console.log(`${queue.length} unsent recipients in queue. Batch: ${batch.length}. Mode: ${SEND ? "SEND" : "dry-run"}\n`);

for (const c of batch) {
  if (!SEND) {
    console.log(`— ${c.clinic} <${c.email}>\n  Subject: ${c.subject}\n  ${body(c).split("\n")[0]} … (${body(c).length} chars)\n`);
    continue;
  }
  try {
    const id = await sendOne(c.email, c.subject, c);
    appendFileSync(LOG, `${c.email}\t${c.clinic}\t${new Date().toISOString()}\t${id}\n`);
    console.log(`✓ sent  ${c.clinic} <${c.email}>`);
  } catch (e) {
    console.error(`✗ FAILED ${c.clinic} <${c.email}>: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 1200));
}
if (!SEND) console.log("Dry-run only. Add --send to actually send, --test you@example.com for a sample.");
