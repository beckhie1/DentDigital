"use server";

import { Resend } from "resend";
import { getClinicBySlug } from "@/lib/clinics";
import { appendRow, osloTimestamp } from "@/lib/google-sheets";

export interface LeadInput {
  clinicSlug: string;
  navn: string;
  epost: string;
  telefon: string;
  onsketDato: string;
  kommentar: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  /** which landing page produced the lead */
  kilde?: "tilbud" | "tannlegevakt";
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function submitLead(input: LeadInput) {
  const clinic = getClinicBySlug(String(input.clinicSlug));
  if (!clinic || !clinic.active) return { success: false, error: "Ukjent klinikk" };

  const navn = String(input.navn ?? "").trim().slice(0, 150);
  const epost = String(input.epost ?? "").trim().slice(0, 200);
  const telefon = String(input.telefon ?? "").trim().slice(0, 30);
  const onsketDato = String(input.onsketDato ?? "").trim().slice(0, 200);
  const kommentar = String(input.kommentar ?? "").trim().slice(0, 2000);
  const kilde = input.kilde === "tannlegevakt" ? "Tannlegevakt" : "Tilbud";

  if (!navn || !telefon || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return { success: false, error: "Manglende eller ugyldige felt" };
  }

  const utm = [input.utmSource, input.utmMedium, input.utmCampaign, input.utmContent, input.utmTerm]
    .map((v) => String(v ?? "").trim().slice(0, 100))
    .filter(Boolean)
    .join(" / ");

  const [dato, tid] = osloTimestamp();

  // Row layout matches the sheet created by scripts/onboard-clinic.mjs:
  // Dato | Tidspunkt | Navn | E-post | Telefon | Ønsket tidspunkt | Kilde | Status | Antall kontaktpunkt | Kommentar | UTM
  const results = await Promise.allSettled([
    appendRow(clinic.spreadsheetId, "Leads!A:K", [
      dato, tid, navn, epost, telefon, onsketDato, kilde, "Ny", "", kommentar, utm,
    ]),
    sendLeadEmail(clinic.email, clinic.name, {
      navn, epost, telefon, onsketDato, kommentar, kilde,
    }),
  ]);

  const failures = results.filter((r) => r.status === "rejected");
  for (const f of failures) console.error("submitLead failure:", (f as PromiseRejectedResult).reason);

  // Consider it a success if at least one channel got the lead (never lose a lead silently).
  if (failures.length === results.length) {
    return { success: false, error: "Kunne ikke sende. Ring oss gjerne direkte." };
  }
  return { success: true };
}

async function sendLeadEmail(
  to: string,
  clinicName: string,
  d: { navn: string; epost: string; telefon: string; onsketDato: string; kommentar: string; kilde: string },
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "DentDigital <post@dentdigital.no>",
    to: [to],
    bcc: ["post@dentdigital.no"],
    replyTo: d.epost,
    subject: `Ny pasienthenvendelse – ${d.navn} (${d.kilde})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e4e4de;border-radius:12px;color:#111110;">
        <h1 style="font-size:20px;border-bottom:2px solid #00c2b8;padding-bottom:10px;">Ny pasienthenvendelse via ${esc(clinicName)}-siden</h1>
        <p><strong>Navn:</strong> ${esc(d.navn)}</p>
        <p><strong>Telefon:</strong> <a href="tel:${esc(d.telefon)}">${esc(d.telefon)}</a></p>
        <p><strong>E-post:</strong> ${esc(d.epost)}</p>
        ${d.onsketDato ? `<p><strong>Ønsket tidspunkt:</strong> ${esc(d.onsketDato)}</p>` : ""}
        ${d.kommentar ? `<p><strong>Kommentar:</strong><br/>${esc(d.kommentar).replace(/\n/g, "<br/>")}</p>` : ""}
        <p style="margin-top:16px;"><strong>Kilde:</strong> ${esc(d.kilde)}-landingsside</p>
        <hr style="border:none;border-top:1px solid #e4e4de;margin:20px 0;"/>
        <p style="font-size:12px;color:#8b8b84;">Ring pasienten så raskt som mulig for å bekrefte timen. Henvendelsen er også lagret i Google-arket deres. – DentDigital</p>
      </div>
    `,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}
