"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { Resend } from "resend";
import { getClinicBySlug } from "@/lib/clinics";
import { appendRow, osloTimestamp, styleRow } from "@/lib/google-sheets";
import { GDTS_US_DROPDOWN_COLS, GDTS_US_ROW_FORMAT } from "@/lib/gdts-sheet-style";
import { sendMetaEvents } from "@/lib/meta-capi";

export interface LeadInput {
  clinicSlug: string;
  navn: string;
  epost: string;
  telefon: string;
  onsketDato: string;
  tannbleking?: string;
  kommentar: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  /** agency-style Meta URL tags: utm_content_id={{ad.id}}, age, gender, placement, device_type, ad_format */
  utmContentId?: string;
  metaAge?: string;
  metaGender?: string;
  metaPlacement?: string;
  metaDevice?: string;
  metaAdFormat?: string;
  /** which landing page produced the lead */
  kilde?: "tilbud" | "tannlegevakt" | "invisalign";
  /** browser-generated id shared with the pixel events for Meta dedup */
  eventId?: string;
  /** Meta browser cookies + page URL for Conversions API matching */
  fbp?: string;
  fbc?: string;
  pageUrl?: string;
  /** stable visitor id shared with the pixel for advanced matching */
  externalId?: string;
  /** "all" when the visitor accepted marketing cookies */
  consent?: string;
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
  const tannbleking = ["Ja", "Nei", "Usikker"].includes(String(input.tannbleking)) ? String(input.tannbleking) : "";
  const isInvisalign = input.kilde === "invisalign" && clinic.invisalign === true;
  const kommentar = isInvisalign ? "" : String(input.kommentar ?? "").trim().slice(0, 2000);
  const gjelder = isInvisalign ? "Invisalign tilbud -0 kr" : input.kilde === "tannlegevakt" ? "" : "komplett tannlegebesøk 590";
  const kilde = isInvisalign ? "Invisalign" : input.kilde === "tannlegevakt" ? "Tannlegevakt" : "Tilbud";

  const epostOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost) || (isInvisalign && epost === "");
  if (!navn || !telefon || !epostOk) {
    return { success: false, error: "Manglende eller ugyldige felt" };
  }

  const utm = [input.utmSource, input.utmMedium, input.utmCampaign, input.utmContent, input.utmTerm]
    .map((v) => String(v ?? "").trim().slice(0, 100))
    .filter(Boolean)
    .join(" / ");

  const [dato, tid] = osloTimestamp();

  // Standard layout (sheet created by scripts/onboard-clinic.mjs):
  // Dato | Tidspunkt | Navn | E-post | Telefon | Ønsket tidspunkt | Tannbleking | Kilde | Status | Antall kontaktpunkt | Kommentar | UTM | Event ID | fbp | fbc
  // "gdts-us" layout (clinic's own US tab):
  // Dato | TId | Navn | Gjelder | E-post | Telefon | Ønsket dato | Tannbleking? | Status | Antall kontaktpunkt | Kommentar | (blank) | Source | Ad Name | Ad ID
  //   | P Meta synk | Q Count | R gclid | S gbraid | T wbraid | U/V hashed phone/email
  //   | W timestamp | X fclid | Y referrer | Z permalink | AA post url
  //   | AB meta age range | AC meta gender | AD meta placement | AE meta device | AF meta ad format
  //   | AG..AP Apps Script OCT/Google columns | AQ Event ID | AR fbp | AS fbc
  const utmSource = String(input.utmSource ?? "").trim().slice(0, 100);
  const utmContent = String(input.utmContent ?? "").trim().slice(0, 100);
  // Ad ID: our older ads pass it as utm_term, the agency-style URL tags as utm_content_id.
  // An unexpanded "{{ad.id}}" macro (link set outside url_tags) is not an id.
  const utmTerm = [input.utmTerm, input.utmContentId]
    .map((v) => String(v ?? "").trim().slice(0, 100))
    .find((v) => v && !v.includes("{{")) ?? "";
  const meta = [input.metaAge, input.metaGender, input.metaPlacement, input.metaDevice, input.metaAdFormat]
    .map((v) => String(v ?? "").trim().slice(0, 60));

  // Meta identifiers stored on the row so the CRM sync can send high-match
  // funnel events later (booked/completed). Only with marketing consent.
  const hasMarketingConsent = input.consent === "all";
  const storedEventId = hasMarketingConsent ? String(input.eventId ?? "").slice(0, 64) || crypto.randomUUID() : "";
  const storedFbp = hasMarketingConsent ? String(input.fbp ?? "").slice(0, 100) : "";
  const storedFbc = hasMarketingConsent ? String(input.fbc ?? "").slice(0, 200) : "";

  const sheetWrite =
    clinic.leadsLayout === "gdts-us"
      ? appendRow(clinic.spreadsheetId, "US!A:AS", [
          dato, tid, navn, gjelder, epost, telefon, onsketDato, tannbleking, "Ny", "", kommentar, "", utmSource || kilde, utmContent, utmTerm,
          ...Array(12).fill(""), // P..AA: Meta synk + Apps Script OCT/enrichment columns — leave untouched
          ...meta, // AB..AF: age, gender, placement, device, ad format from the ad URL tags
          ...Array(10).fill(""), // AG..AP: Apps Script Google/OCT columns — leave untouched
          storedEventId, storedFbp, storedFbc,
        ])
      : appendRow(clinic.spreadsheetId, "Leads!A:O", [
          dato, tid, navn, epost, telefon, onsketDato, tannbleking, kilde, "Ny", "", kommentar, utm,
          storedEventId, storedFbp, storedFbc,
        ]);
  const email = () =>
    sendLeadEmail(clinic.email, clinic.name, { navn, epost, telefon, onsketDato, tannbleking, kommentar, kilde });

  // Background work after the response, so the visitor sees the thank-you as soon as the lead is saved.
  const tasks: Promise<unknown>[] = [];

  // Server-side Conversions API — mirrors the pixel with shared event_ids (dedup).
  // Only with marketing consent, matching the consent-gated browser pixel.
  // Standard "Lead" intentionally not sent — Meta flags it for dental/health ads.
  if (clinic.metaPixelId && hasMarketingConsent && input.kilde !== "tannlegevakt") {
    const h = await headers();
    const eventId = storedEventId;
    // Meta prefers IPv6 when the client has one; pick it over IPv4 from the proxy chain
    const ips = (h.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const clientIp = ips.find((ip) => ip.includes(":")) || ips[0] || undefined;
    const nameParts = navn.trim().split(/\s+/);
    const firstName = nameParts[0] || undefined;
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined;
    tasks.push(
      sendMetaEvents(clinic.metaPixelId, [
        {
          eventName: isInvisalign ? "invisalign_lead" : "exam_lead",
          eventId: isInvisalign ? `${eventId}.invisalign` : `${eventId}.exam`,
          eventSourceUrl: String(input.pageUrl ?? "").slice(0, 500) || `https://www.dentdigital.no/${clinic.slug}-tilbud`,
          email: epost,
          phone: telefon,
          firstName,
          lastName,
          country: "no",
          clientIp,
          userAgent: h.get("user-agent") ?? undefined,
          fbp: String(input.fbp ?? "").slice(0, 100) || undefined,
          fbc: String(input.fbc ?? "").slice(0, 200) || undefined,
          externalId: String(input.externalId ?? "").slice(0, 64) || undefined,
          value: isInvisalign ? 0 : clinic.offer.price, // Invisalign consultation is free: explicit 0 kr
          currency: "NOK",
        },
      ]),
    );
  }

  let row: number | null = null;
  try {
    row = await sheetWrite;
  } catch (e) {
    console.error("submitLead sheet failure:", e);
    // Sheet down: the email is now the only copy, so wait for it (never lose a lead silently).
    try {
      await email();
    } catch (e2) {
      console.error("submitLead email failure:", e2);
      after(() => Promise.allSettled(tasks));
      return { success: false, error: "Kunne ikke sende. Ring oss gjerne direkte." };
    }
  }

  if (row !== null) {
    tasks.push(email());
    if (clinic.leadsLayout === "gdts-us") {
      // Best-effort: the lead is already saved, so a styling failure must not fail it.
      tasks.push(styleRow(clinic.spreadsheetId, "US", row, GDTS_US_ROW_FORMAT, GDTS_US_DROPDOWN_COLS));
    }
  }
  after(async () => {
    const results = await Promise.allSettled(tasks);
    for (const r of results) {
      if (r.status === "rejected") console.error("submitLead background failure:", r.reason);
    }
  });
  return { success: true };
}

async function sendLeadEmail(
  to: string,
  clinicName: string,
  d: { navn: string; epost: string; telefon: string; onsketDato: string; tannbleking: string; kommentar: string; kilde: string },
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "DentDigital <post@dentdigital.no>",
    to: [to],
    replyTo: d.epost || undefined,
    subject: `Ny pasienthenvendelse – ${d.navn} (${d.kilde})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e4e4de;border-radius:12px;color:#111110;">
        <h1 style="font-size:20px;border-bottom:2px solid #00c2b8;padding-bottom:10px;">Ny pasienthenvendelse via ${esc(clinicName)}-siden</h1>
        <p><strong>Navn:</strong> ${esc(d.navn)}</p>
        <p><strong>Telefon:</strong> <a href="tel:${esc(d.telefon)}">${esc(d.telefon)}</a></p>
        <p><strong>E-post:</strong> ${esc(d.epost) || "–"}</p>
        ${d.onsketDato ? `<p><strong>Ønsket tidspunkt:</strong> ${esc(d.onsketDato)}</p>` : ""}
        ${d.tannbleking ? `<p><strong>Ønsker tannbleking:</strong> ${esc(d.tannbleking)}</p>` : ""}
        ${d.kommentar ? `<p><strong>Kommentar:</strong><br/>${esc(d.kommentar).replace(/\n/g, "<br/>")}</p>` : ""}
        <p style="margin-top:16px;"><strong>Kilde:</strong> ${esc(d.kilde)}-landingsside</p>
        <hr style="border:none;border-top:1px solid #e4e4de;margin:20px 0;"/>
        <p style="font-size:12px;color:#8b8b84;">Ring pasienten så raskt som mulig for å bekrefte timen. Henvendelsen er også lagret i Google-arket deres. – DentDigital</p>
      </div>
    `,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}
