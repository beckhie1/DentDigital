import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { clinics } from "@/lib/clinics";
import { sendMetaEvents } from "@/lib/meta-capi";

export const maxDuration = 60;

/**
 * CRM → Meta feedback loop (Conversion Leads).
 * Reads each clinic's lead sheet and reports funnel-stage transitions to Meta
 * via CAPI so ads can optimize for qualified leads, not just form fills:
 *   "Booket til time"      → appointment_booked  (value = offer price)
 *   "Møtte til time"       → exam_completed      (value = offer price)
 *   "Behandling startet"   → treatment_started
 * Earlier unsent stages are back-filled (a row that jumps straight to
 * "Møtte til time" also sends appointment_booked). Events reuse the fbp/fbc
 * browser IDs stored on the row at lead capture for high match quality.
 * Synced stages are stamped in the "Meta synk" column.
 *
 * Triggered by Vercel Cron (vercel.json). Protected by CRON_SECRET.
 */

/** Ordered funnel: status (lowercase) → CAPI event. */
const FUNNEL = [
  { status: "booket til time", event: "appointment_booked", withValue: true },
  { status: "møtte til time", event: "exam_completed", withValue: true },
  { status: "behandling startet", event: "treatment_started", withValue: false },
] as const;

// gdts-us layout: A Dato, C Navn, D E-post, E Telefon, H Status, O Meta synk,
// P Count, Q gclid, R gbraid, S..AO Apps Script OCT/enrichment columns,
// AP Event ID, AQ fbp, AR fbc
const US_RANGE = "US!A:AR";
const US_COLS = { epost: 3, telefon: 4, status: 7, synced: 14, fbp: 42, fbc: 43 };

async function sheetsToken(): Promise<string> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
  const auth = new GoogleAuth({
    credentials: JSON.parse(keyJson),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const t = await (await auth.getClient()).getAccessToken();
  if (!t.token) throw new Error("no sheets token");
  return t.token;
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  for (const clinic of clinics) {
    if (!clinic.active || !clinic.metaPixelId || clinic.leadsLayout !== "gdts-us") continue;

    const token = await sheetsToken();
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${clinic.spreadsheetId}/values/${encodeURIComponent(US_RANGE)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      results[clinic.slug] = `sheet read failed: ${res.status}`;
      continue;
    }
    const { values = [] } = (await res.json()) as { values?: string[][] };

    const toSync: {
      row: number; epost: string; telefon: string; fbp: string; fbc: string;
      events: { event: string; withValue: boolean }[]; synced: string;
    }[] = [];
    values.forEach((row, i) => {
      if (i === 0) return; // header
      const status = (row[US_COLS.status] ?? "").trim().toLowerCase();
      const stageIdx = FUNNEL.findIndex((s) => s.status === status);
      if (stageIdx === -1) return;
      const synced = (row[US_COLS.synced] ?? "").trim();
      // legacy stamps ("✓ 2026-07-16") predate stage names = appointment_booked sent
      const legacyBooked = /✓ \d/.test(synced);
      const events = FUNNEL.slice(0, stageIdx + 1).filter(
        (s) => !synced.includes(s.event) && !(s.event === "appointment_booked" && legacyBooked),
      );
      const epost = (row[US_COLS.epost] ?? "").trim();
      const telefon = (row[US_COLS.telefon] ?? "").trim();
      if (events.length && (epost || telefon)) {
        toSync.push({
          row: i + 1, epost, telefon,
          fbp: (row[US_COLS.fbp] ?? "").trim(),
          fbc: (row[US_COLS.fbc] ?? "").trim(),
          events: events.map((s) => ({ event: s.event, withValue: s.withValue })),
          synced,
        });
      }
    });

    let sent = 0;
    for (const lead of toSync) {
      try {
        await sendMetaEvents(
          clinic.metaPixelId,
          lead.events.map((s) => ({
            eventName: s.event,
            eventId: `crm-${clinic.slug}-r${lead.row}-${s.event}`,
            eventSourceUrl: `https://www.dentdigital.no/${clinic.slug}-tilbud`,
            email: lead.epost || undefined,
            phone: lead.telefon || undefined,
            fbp: lead.fbp || undefined,
            fbc: lead.fbc || undefined,
            value: s.withValue ? clinic.offer.price : undefined,
            currency: s.withValue ? "NOK" : undefined,
          })),
        );
        // stamp the row so stages are never sent twice
        const day = new Date().toISOString().slice(0, 10);
        const stamps = lead.events.map((s) => `✓ ${s.event} ${day}`).join(" | ");
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${clinic.spreadsheetId}/values/${encodeURIComponent(`US!O${lead.row}`)}?valueInputOption=RAW`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ values: [[lead.synced ? `${lead.synced} | ${stamps}` : stamps]] }),
          },
        );
        sent += lead.events.length;
      } catch (e) {
        console.error(`crm-sync ${clinic.slug} row ${lead.row}:`, e);
      }
    }
    results[clinic.slug] = { candidates: toSync.length, sent };
  }

  return NextResponse.json({ ok: true, results });
}
