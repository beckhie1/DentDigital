#!/usr/bin/env node
/**
 * DentDigital vaskefirma-outreach (Resend).
 * Usage:
 *   node outreach/send-vask.mjs                 -> dry-run, viser neste batch
 *   node outreach/send-vask.mjs --test you@x.no -> sender ETT eksemplar til deg selv
 *   node outreach/send-vask.mjs --send          -> sender neste batch (default 10)
 *   node outreach/send-vask.mjs --send --limit 5
 * Sendte adresser logges i ~/.dentdigital/outreach/vask-sent.log og hoppes over.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const DIR = dirname(fileURLToPath(import.meta.url));
const CSV = resolve(DIR, "kilder", "vaskefirma-oslo.csv");
const LOG = resolve(homedir(), ".dentdigital", "outreach", "vask-sent.log");
const FROM = "Muhammad Umar Nadeem <post@dentdigital.no>";
const REPLY_TO = "post@dentdigital.no";
const MAX_ANSATTE = 250; // giganter (ISS, Compass, Coor m.fl.) har egne markedsavdelinger

const args = process.argv.slice(2);
const SEND = args.includes("--send");
const TEST = args.includes("--test") ? args[args.indexOf("--test") + 1] : null;
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : 10;

const key = (() => {
  const env = readFileSync(resolve(homedir(), ".dentdigital", ".env.local"), "utf8");
  const m = env.match(/^RESEND_API_KEY="?([^"\n]+)"?/m);
  if (!m) throw new Error("RESEND_API_KEY not found");
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

/** "LIVING CLEAN RENHOLD AS" -> "Living Clean Renhold" (til visning/emne) */
function displayName(raw) {
  const cleaned = raw
    .replace(/\s+(AS|ASA|ENK|NUF|DA|ANS)$/i, "")
    .toLowerCase()
    .replace(/(^|[\s\-/&(])([a-zæøåäöü])/g, (m, pre, ch) => pre + ch.toUpperCase());
  return cleaned.trim();
}

function subject(firma) {
  return `Flere vaskeoppdrag fra Google – ${firma}`;
}

function textBody(firma) {
  return `Hei,

Jeg heter Muhammad Umar Nadeem og er forretningsutvikler i DentDigital – vi hjelper lokale servicebedrifter med å hente flere kunder fra nett.

Jeg søkte på «flyttevask Oslo» og la merke til at ${firma} er vanskelig å finne. Det betyr i praksis at kundene ender opp hos konkurrentene.

Dette fikser vi for dere:

- Nettside som konverterer besøkende til forespørsler
- Google- og Meta-annonser rettet mot folk som søker vask i Oslo akkurat nå
- Optimalisert Google Maps-profil så dere dukker opp i lokalsøk
- Flere ferske 5-stjerners Google-omtaler – og ryddig håndtering av dårlige

Interessert i en uforpliktende prat? Svar på denne e-posten.

Med vennlig hilsen

Muhammad Umar Nadeem
Business Development Manager
DentDigital
post@dentdigital.no · www.dentdigital.no

--
Du mottar denne e-posten fordi ${firma} er offentlig registrert i Brønnøysundregistrene.
Ikke interessert? Svar «nei takk», så hører du ikke fra oss igjen.`;
}

function htmlBody(firma) {
  const p = (t) => `<p style="margin:0 0 16px;">${t}</p>`;
  const points = [
    ["Nettside som konverterer", "Moderne nettside der besøkende faktisk sender forespørsel – ikke bare ser og forsvinner."],
    ["Google- og Meta-annonser", "Annonser rettet mot folk som søker vask i Oslo akkurat nå – målt på henvendelser, ikke klikk."],
    ["Synlig på Google Maps", "Optimalisert bedriftsprofil så dere dukker opp når noen søker «renhold nær meg»."],
    ["Bedre Google-omtaler", "Systematisk innsamling av ferske 5-stjerner – og ryddig håndtering av de dårlige."],
  ]
    .map(
      ([t, d]) => `<tr>
      <td style="vertical-align:top;padding:0 12px 14px 0;width:22px;">
        <div style="width:22px;height:22px;border-radius:50%;background:#e6f7f0;color:#0d8a5f;font-size:13px;font-weight:700;text-align:center;line-height:22px;">&#10003;</div>
      </td>
      <td style="vertical-align:top;padding:0 0 14px;">
        <strong>${t}</strong><br>
        <span style="color:#555552;font-size:14px;">${d}</span>
      </td>
    </tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="nb"><body style="margin:0;padding:0;background:#f4f4f2;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e4;">
    <div style="background:#111110;padding:20px 32px;">
      <span style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Dent<span style="color:#4fd1a5;">Digital</span></span>
    </div>
    <div style="padding:32px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#111110;">
      ${p("Hei,")}
      ${p("Jeg heter Muhammad Umar Nadeem og er forretningsutvikler i <strong>DentDigital</strong> – vi hjelper lokale servicebedrifter med å hente flere kunder fra nett.")}
      ${p(`Jeg søkte på «flyttevask Oslo» og la merke til at <strong>${firma}</strong> er vanskelig å finne. Det betyr i praksis at kundene ender opp hos konkurrentene.`)}
      ${p("<strong>Dette fikser vi for dere:</strong>")}
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;">
${points}
      </table>
      <div style="text-align:center;margin:28px 0;">
        <a href="mailto:post@dentdigital.no?subject=${encodeURIComponent("Interessert – " + firma)}"
           style="display:inline-block;background:#111110;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;">
          Svar meg på e-post &rarr;
        </a>
        <div style="margin-top:10px;font-size:13px;color:#8a8a86;">Uforpliktende – svar på denne e-posten, så tar jeg kontakt.</div>
      </div>
      ${p("Med vennlig hilsen")}
      <p style="margin:0;">
        <strong>Muhammad Umar Nadeem</strong><br>
        <span style="color:#555552;">Business Development Manager</span><br>
        <span style="color:#555552;">DentDigital</span><br>
        <a href="mailto:post@dentdigital.no" style="color:#0d8a5f;">post@dentdigital.no</a> · <a href="https://www.dentdigital.no" style="color:#0d8a5f;">dentdigital.no</a>
      </p>
    </div>
  </div>
  <div style="text-align:center;padding:16px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;color:#a0a09c;">
    Du mottar denne e-posten fordi ${firma} er offentlig registrert i Brønnøysundregistrene.<br>
    Ikke interessert? Svar «nei takk», så hører du ikke fra oss igjen.
  </div>
</div>
</body></html>`;
}

async function sendOne(to, firma) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: REPLY_TO,
      subject: subject(firma),
      html: htmlBody(firma),
      text: textBody(firma),
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return (await res.json()).id;
}

// ---- main ----
const rows = parseCsv(readFileSync(CSV, "utf8")).slice(1); // skip header
const sent = new Set(
  existsSync(LOG)
    ? readFileSync(LOG, "utf8").split("\n").map((l) => l.split("\t")[1]).filter(Boolean)
    : []
);

const queue = rows
  .map(([name, orgnr, form, ansatte, nace, website, email]) => ({
    name, orgnr, ansatte: parseInt(ansatte) || 0, email: (email || "").trim().toLowerCase(),
  }))
  .filter((c) => c.email && !sent.has(c.email) && c.ansatte <= MAX_ANSATTE);

if (TEST) {
  const firma = "Eksempel Renhold";
  const id = await sendOne(TEST, firma);
  console.log(`test sendt til ${TEST} (${id})`);
  process.exit(0);
}

const batch = queue.slice(0, LIMIT);
console.log(`kø: ${queue.length} | batch: ${batch.length}${SEND ? "" : "  (DRY-RUN, bruk --send)"}`);
for (const c of batch) {
  const firma = displayName(c.name);
  if (!SEND) { console.log(`  → ${firma} <${c.email}> (${c.ansatte} ansatte)`); continue; }
  try {
    const id = await sendOne(c.email, firma);
    appendFileSync(LOG, `${new Date().toISOString()}\t${c.email}\t${c.name}\t${id}\n`);
    console.log(`✓ sent  ${firma} <${c.email}>`);
  } catch (e) {
    console.log(`✗ FAILED ${firma} <${c.email}>: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 15000));
}
