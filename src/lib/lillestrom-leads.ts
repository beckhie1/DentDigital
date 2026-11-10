import { createHash } from "node:crypto";
import { getAccessToken } from "@/lib/google-sheets";
import { LT, LT_LEAD_EVENT, ltLandingUrl, type LtSource } from "@/lib/lillestrom";

/**
 * Server side of the Lillestrøm Tannhelse landing pages. Rows and CAPI events are
 * byte-for-byte what lillestromtannhelse.no sends, so the clinic's sheet, its
 * Apps Script and the offline-conversion uploads keep working unchanged.
 */

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  fbc?: string;
  adId?: string;
  landingUrl?: string;
  referrer?: string;
};

const ATTR_KEYS: (keyof Attribution)[] = ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent", "gclid", "gbraid", "wbraid", "fbclid", "fbc", "adId", "landingUrl", "referrer"];

/** Parses the hidden "attr" JSON field; keeps only known string keys, capped in length. */
export function parseAttribution(raw: unknown): Attribution {
  if (typeof raw !== "string" || !raw) return {};
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const out: Attribution = {};
    for (const key of ATTR_KEYS) {
      const value = data[key];
      if (typeof value === "string" && value) out[key] = value.slice(0, 500);
    }
    return out;
  } catch {
    return {};
  }
}

export type LeadRow = Attribution & {
  name: string;
  phone: string;
  email: string;
  preferred: string;
  topic: string;
  source: LtSource;
  eventId?: string;
  fbp?: string;
};

const sha256 = (s: string) => (s ? createHash("sha256").update(s).digest("hex") : "");
// Ad platforms match on E.164 digits without "+"; Norwegian 8-digit numbers get 47.
const normPhone = (p: string) => (/^\d{8}$/.test(p) ? `47${p}` : p.replace(/^\+|^00/, ""));

/** Column order mirrors the GDTS "US" tab (A–AR); K onwards is blacked out for reception. */
export async function appendLtLead(lead: LeadRow): Promise<void> {
  const now = new Date();
  const date = now.toLocaleDateString("nb-NO", { timeZone: "Europe/Oslo", day: "2-digit", month: "2-digit", year: "numeric" });
  const time = now.toLocaleTimeString("nb-NO", { timeZone: "Europe/Oslo", hour: "2-digit", minute: "2-digit", hour12: false });
  const platform = lead.gclid || lead.gbraid || lead.wbraid ? "google" : lead.fbclid ? "meta" : "nettside";

  // A leading apostrophe keeps Sheets from turning phone numbers into numbers (USER_ENTERED).
  const row = [
    date, time, lead.name, lead.email, `'${lead.phone}`, lead.preferred, lead.topic,
    "Ny", "", "", // H Status, I Antall kontaktpunkt, J Kommentar
    "", // K Leave this blank
    lead.utmSource || platform,
    [lead.utmCampaign, lead.utmContent].filter(Boolean).join(" / "),
    lead.adId ?? "",
    "", "", // O Meta synk, P Count
    lead.gclid ?? "", lead.gbraid ?? "", lead.wbraid ?? "",
    sha256(normPhone(lead.phone)), sha256(lead.email.trim().toLowerCase()),
    now.toISOString(),
    lead.fbclid ?? "", lead.referrer ?? "", lead.landingUrl ?? "", ltLandingUrl(lead.source),
    "", "", "", "", "", // AA–AE Meta age/gender/placement/device/ad format
    lead.utmTerm ?? "", "", "", "", "", "", "", // AF google keyword … AL g creative id
    "", "", "", lead.eventId ?? "", // AM OCT Uploaded, AN Conversion Value, AO Meta OCT Uploaded, AP Event ID
    lead.fbp ?? "", lead.fbc ?? "", // AQ fbp, AR fbc
  ].map((v) => (typeof v === "string" && /^[=+\-@]/.test(v) && !v.startsWith("'") ? `'${v}` : v));

  // OVERWRITE fills the next empty pre-formatted row (dropdowns, date format, blacked-out columns) instead of inserting a bare one.
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${LT.spreadsheetId}/values/Leads!A:AR:append?valueInputOption=USER_ENTERED&insertDataOption=OVERWRITE`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${await getAccessToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [row] }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!res.ok) throw new Error(`Sheets append failed: ${res.status} ${await res.text()}`);
}

export type CapiLead = {
  eventId: string;
  eventSourceUrl: string;
  email: string;
  phone: string;
  fbc?: string;
  fbp?: string;
  ip?: string;
  userAgent?: string;
  value: number;
  source: LtSource;
};

/** Server copy of the browser lead event; the shared event_id lets Meta count it once. */
export async function sendLtCapiLead(lead: CapiLead): Promise<void> {
  const token = process.env.LILLESTROM_META_CAPI_TOKEN;
  if (!token) {
    console.warn("Lillestrøm CAPI skipped: LILLESTROM_META_CAPI_TOKEN is not set");
    return;
  }

  const user_data: Record<string, unknown> = { country: [sha256("no")] };
  if (lead.email) user_data.em = [sha256(lead.email.trim().toLowerCase())];
  if (lead.phone) user_data.ph = [sha256(normPhone(lead.phone))];
  if (lead.fbc) user_data.fbc = lead.fbc;
  if (lead.fbp) user_data.fbp = lead.fbp;
  if (lead.ip) user_data.client_ip_address = lead.ip;
  if (lead.userAgent) user_data.client_user_agent = lead.userAgent;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: LT_LEAD_EVENT,
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.eventSourceUrl,
        user_data,
        custom_data: { value: lead.value, currency: "NOK", content_name: lead.source },
      },
    ],
  };
  if (process.env.LILLESTROM_META_TEST_EVENT_CODE) body.test_event_code = process.env.LILLESTROM_META_TEST_EVENT_CODE;

  const res = await fetch(`https://graph.facebook.com/v25.0/${LT.metaPixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${text.slice(0, 300)}`);
  console.info("Lillestrøm CAPI", LT_LEAD_EVENT, lead.eventId, lead.source, text.slice(0, 300));
}
