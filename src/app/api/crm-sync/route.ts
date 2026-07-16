import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { clinics } from "@/lib/clinics";
import { sendMetaEvents } from "@/lib/meta-capi";

export const maxDuration = 60;

/**
 * CRM → Meta feedback loop (Conversion Leads).
 * Reads each clinic's lead sheet, finds rows marked "Booket til time" that
 * haven't been reported yet, and sends an `appointment_booked` CAPI event so
 * Meta can optimize for qualified leads. Synced rows are stamped in the
 * "Meta synk" column.
 *
 * Triggered by Vercel Cron (vercel.json). Protected by CRON_SECRET.
 */

const QUALIFIED_STATUS = "booket til time";
const EVENT_NAME = "appointment_booked";

// gdts-us layout: A Dato, C Navn, D E-post, E Telefon, H Status, O Meta synk
const US_RANGE = "US!A:O";
const US_COLS = { epost: 3, telefon: 4, status: 7, synced: 14 };

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

    const toSync: { row: number; epost: string; telefon: string }[] = [];
    values.forEach((row, i) => {
      if (i === 0) return; // header
      const status = (row[US_COLS.status] ?? "").trim().toLowerCase();
      const synced = (row[US_COLS.synced] ?? "").trim();
      const epost = (row[US_COLS.epost] ?? "").trim();
      const telefon = (row[US_COLS.telefon] ?? "").trim();
      if (status === QUALIFIED_STATUS && !synced && (epost || telefon)) {
        toSync.push({ row: i + 1, epost, telefon });
      }
    });

    let sent = 0;
    for (const lead of toSync) {
      try {
        await sendMetaEvents(clinic.metaPixelId, [
          {
            eventName: EVENT_NAME,
            eventId: `crm-${clinic.slug}-r${lead.row}`,
            eventSourceUrl: `https://www.dentdigital.no/${clinic.slug}-tilbud`,
            email: lead.epost || undefined,
            phone: lead.telefon || undefined,
          },
        ]);
        // stamp the row so it is never sent twice
        const stamp = new Date().toISOString().slice(0, 10);
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${clinic.spreadsheetId}/values/${encodeURIComponent(`US!O${lead.row}`)}?valueInputOption=RAW`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ values: [[`✓ ${stamp}`]] }),
          },
        );
        sent++;
      } catch (e) {
        console.error(`crm-sync ${clinic.slug} row ${lead.row}:`, e);
      }
    }
    results[clinic.slug] = { candidates: toSync.length, sent };
  }

  return NextResponse.json({ ok: true, results });
}
