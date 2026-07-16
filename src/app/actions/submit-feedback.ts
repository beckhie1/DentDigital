"use server";

import { Resend } from "resend";
import { getClinicBySlug } from "@/lib/clinics";
import { appendRow, osloTimestamp } from "@/lib/google-sheets";

export interface FeedbackInput {
  clinicSlug: string;
  rating: number; // 1–4 (5-star flows go straight to Google review, never here)
  name: string;
  phone: string;
  comment: string;
}

const EMOJIS = ["😞", "😕", "😐", "😊", "😁"];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function submitFeedback(input: FeedbackInput) {
  const clinic = getClinicBySlug(String(input.clinicSlug));
  if (!clinic || !clinic.active) return { success: false, error: "Ukjent klinikk" };

  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 0)));
  const name = String(input.name ?? "").trim().slice(0, 150);
  const phone = String(input.phone ?? "").trim().slice(0, 30);
  const comment = String(input.comment ?? "").trim().slice(0, 2000);
  if (!rating) return { success: false, error: "Mangler vurdering" };

  const [dato, tid] = osloTimestamp();

  // Row layout matches the sheet created by scripts/onboard-clinic.mjs:
  // Dato | Tidspunkt | Vurdering | Navn | Telefon | Kommentar | Fulgt opp
  const results = await Promise.allSettled([
    appendRow(clinic.spreadsheetId, "Tilbakemeldinger!A:G", [
      dato, tid, `${rating}/5`, name, phone, comment, "",
    ]),
    sendFeedbackAlert(clinic.email, clinic.name, { rating, name, phone, comment }),
  ]);

  const failures = results.filter((r) => r.status === "rejected");
  for (const f of failures) console.error("submitFeedback failure:", (f as PromiseRejectedResult).reason);

  if (failures.length === results.length) {
    return { success: false, error: "Kunne ikke sende tilbakemeldingen" };
  }
  return { success: true };
}

async function sendFeedbackAlert(
  to: string,
  clinicName: string,
  d: { rating: number; name: string; phone: string; comment: string },
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(apiKey);
  const emoji = EMOJIS[d.rating - 1] ?? "❓";

  const { error } = await resend.emails.send({
    from: "DentDigital <post@dentdigital.no>",
    to: [to],
    bcc: ["post@dentdigital.no"],
    subject: `⚠️ Tilbakemelding ${emoji} ${d.rating}/5 – ${d.name || "anonym pasient"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e4e4de;border-radius:12px;color:#111110;">
        <h1 style="font-size:20px;border-bottom:2px solid #00c2b8;padding-bottom:10px;">Negativ tilbakemelding – ${esc(clinicName)}</h1>
        <div style="font-size:32px;margin:16px 0;">${emoji} ${d.rating}/5</div>
        ${d.name ? `<p><strong>Navn:</strong> ${esc(d.name)}</p>` : ""}
        ${d.phone ? `<p><strong>Telefon:</strong> <a href="tel:${esc(d.phone)}">${esc(d.phone)}</a></p>` : ""}
        ${d.comment ? `<p><strong>Kommentar:</strong><br/>${esc(d.comment).replace(/\n/g, "<br/>")}</p>` : ""}
        <hr style="border:none;border-top:1px solid #e4e4de;margin:20px 0;"/>
        <p style="font-size:12px;color:#8b8b84;">Pasienten ønsker å bli kontaktet. Rask oppfølging kan snu opplevelsen. Tilbakemeldingen er også lagret i Google-arket deres. – DentDigital</p>
      </div>
    `,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}
