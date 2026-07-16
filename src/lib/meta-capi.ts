import { createHash } from "node:crypto";

/**
 * Meta Conversions API — server-side events for a clinic dataset.
 * Mirrors the browser pixel events with shared event_ids so Meta deduplicates.
 * Requires env META_CAPI_ACCESS_TOKEN.
 */

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Meta-normalized hashes: email lowercase/trimmed, phone digits-only with country code. */
export function hashEmail(email: string): string | undefined {
  const e = email.trim().toLowerCase();
  return e ? sha256(e) : undefined;
}

export function hashPhone(phone: string, defaultCountry = "47"): string | undefined {
  let p = phone.replace(/\D/g, "");
  if (!p) return undefined;
  p = p.replace(/^00/, "");
  if (p.length === 8) p = defaultCountry + p; // bare Norwegian number
  return sha256(p);
}

export interface CapiEvent {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

export async function sendMetaEvents(datasetId: string, events: CapiEvent[]): Promise<void> {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) throw new Error("META_CAPI_ACCESS_TOKEN is not configured");

  const now = Math.floor(Date.now() / 1000);
  const data = events.map((e) => ({
    event_name: e.eventName,
    event_time: now,
    event_id: e.eventId,
    action_source: "website",
    event_source_url: e.eventSourceUrl,
    user_data: {
      em: e.email ? [hashEmail(e.email)] : undefined,
      ph: e.phone ? [hashPhone(e.phone)] : undefined,
      client_ip_address: e.clientIp || undefined,
      client_user_agent: e.userAgent || undefined,
      fbp: e.fbp || undefined,
      fbc: e.fbc || undefined,
    },
  }));

  const res = await fetch(`https://graph.facebook.com/v21.0/${datasetId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, access_token: token }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Meta CAPI error: ${res.status} ${body}`);
  }
}
