"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LEAD_KEY, captureAttribution, hasMarketingConsent, metaTrack } from "./track";
import { LT_LEAD_EVENT, LT_OFFERS, isLtSource } from "@/lib/lillestrom";

/** PageView, call/booking clicks and attribution capture for the clinic's pixel; nothing loads without consent. */
export function LtTracking() {
  const [marketing, setMarketing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => {
      captureAttribution();
      setMarketing(hasMarketingConsent());
    };
    update();
    window.addEventListener("dentdigital-consent", update);
    return () => window.removeEventListener("dentdigital-consent", update);
  }, []);

  useEffect(() => {
    if (marketing) metaTrack("PageView");
  }, [marketing, pathname]);

  // One delegated listener instead of editing every phone/booking link.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element | null)?.closest("a")?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) metaTrack("phone_click");
      else if (href.includes("opusdentalonline.com")) metaTrack("booking_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

/** Fires the lead event once per submitted form; a reload or a direct visit does not count. */
export function LtLeadConversion() {
  useEffect(() => {
    let lead: { source?: string; eventId?: string } | null = null;
    try {
      const raw = sessionStorage.getItem(LEAD_KEY);
      lead = raw ? JSON.parse(raw) : null;
      sessionStorage.removeItem(LEAD_KEY);
    } catch {}
    if (!lead) return;
    const value = lead.source && isLtSource(lead.source) ? LT_OFFERS[lead.source].value : 549;
    metaTrack(LT_LEAD_EVENT, { value, currency: "NOK", content_name: lead.source }, lead.eventId || undefined);
  }, []);
  return null;
}
