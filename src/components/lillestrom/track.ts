"use client";

import { getConsent } from "@/components/shell/ConsentBanner";
import { LT } from "@/lib/lillestrom";
import type { Attribution } from "@/lib/lillestrom-leads";

/** Client tracking for the Lillestrøm landing pages, ported from lillestromtannhelse.no/src/lib/track.ts. */

const ATTR_KEY = "lt_attr";
export const LEAD_KEY = "lt_lead";

/** DentDigital's banner has one switch: "all" covers the marketing consent the clinic site asks for. */
export const hasMarketingConsent = () => getConsent() === "all";

function tagsFromUrl(): Attribution {
  const q = new URLSearchParams(window.location.search);
  const fbclid = q.get("fbclid") ?? undefined;
  return {
    utmSource: q.get("utm_source") ?? undefined,
    utmMedium: q.get("utm_medium") ?? undefined,
    utmCampaign: q.get("utm_campaign") ?? undefined,
    utmTerm: q.get("utm_term") ?? undefined,
    utmContent: q.get("utm_content") ?? undefined,
    gclid: q.get("gclid") ?? undefined,
    gbraid: q.get("gbraid") ?? undefined,
    wbraid: q.get("wbraid") ?? undefined,
    fbclid,
    // Meta's click-id format, stamped with the click time for offline conversion uploads.
    fbc: fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined,
    adId: q.get("ad_id") ?? undefined,
  };
}

/** Keeps the first ad click of the browser session so a lead is attributed even after a reload. */
export function captureAttribution() {
  try {
    if (!hasMarketingConsent()) return;
    const fresh = tagsFromUrl();
    const hasClick = Object.values(fresh).some(Boolean);
    const stored = sessionStorage.getItem(ATTR_KEY);
    if (hasClick || !stored) {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify({ ...fresh, landingUrl: window.location.href.slice(0, 500), referrer: document.referrer.slice(0, 500) }));
    }
  } catch {}
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

/** Campaign tags and click ids in the current URL only (nothing stored on the device), so ad leads are attributed without cookie consent. */
export function campaignTagsFromUrl(): Attribution {
  return Object.fromEntries(Object.entries(tagsFromUrl()).filter(([, v]) => v)) as Attribution;
}

/** Loads the clinic's Meta pixel once; only call after marketing consent. */
function loadMetaPixel() {
  if (window.fbq) return;
  type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
  // Meta's standard queueing stub, so calls made before fbevents.js arrives are not lost.
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  }) as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  (window as unknown as { _fbq: unknown })._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", LT.metaPixelId);
}

/** PageView is the only standard event; everything else goes out as a custom event (see LT_LEAD_EVENT). */
export function metaTrack(event: string, params: Record<string, unknown> = {}, eventId?: string) {
  if (!hasMarketingConsent()) return;
  loadMetaPixel();
  // eventId must match the server-side Conversions API event so Meta counts the lead once.
  window.fbq?.(event === "PageView" ? "track" : "trackCustom", event, params, eventId ? { eventID: eventId } : undefined);
}
