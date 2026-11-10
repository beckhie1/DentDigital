"use server";

import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { randomUUID } from "node:crypto";
import { LT, LT_OFFERS, isLtSource, ltLandingUrl } from "@/lib/lillestrom";
import { appendLtLead, parseAttribution, sendLtCapiLead } from "@/lib/lillestrom-leads";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{8,20}$/;
// Norwegian numbers without country code; foreign numbers keep theirs.
const compactPhone = (s: string) => s.replace(/[^\d+]/g, "").replace(/^(?:\+47|0047)(?=\d{8}$)/, "");

type Field = "name" | "phone" | "email";
type Values = { name: string; phone: string; email: string; preferred: string; topic: string };

export type LtLeadState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: Values;
  /** Shared with the browser pixel so Meta deduplicates the Lead event. */
  eventId?: string;
};

// Per-instance throttle against form spam; the honeypot catches most bots before this.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const DOUBLE_SUBMIT_MS = 60_000;
const lastByPhone = new Map<string, number>();

function throttled(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) for (const [k, v] of recent) if (v.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
  return hits.length > MAX_PER_WINDOW;
}

/** The same number twice within a minute is a double click, not a new lead. */
function isDoubleSubmit(phone: string) {
  const now = Date.now();
  const last = lastByPhone.get(phone);
  lastByPhone.set(phone, now);
  if (lastByPhone.size > 500) for (const [k, t] of lastByPhone) if (now - t > DOUBLE_SUBMIT_MS) lastByPhone.delete(k);
  return last !== undefined && now - last < DOUBLE_SUBMIT_MS;
}

export async function submitLillestromLead(_prev: LtLeadState, formData: FormData): Promise<LtLeadState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  // Honeypot: bots fill hidden fields; pretend success so they don't retry.
  if (get("company")) return { status: "success" };

  const source = get("source");
  if (!isLtSource(source)) return { status: "error", message: "Noe gikk galt. Prøv igjen eller ring oss." };
  const offer = LT_OFFERS[source];

  const values: Values = {
    name: get("name").slice(0, 100),
    phone: get("phone").slice(0, 20),
    email: get("email").slice(0, 200),
    preferred: get("preferred").slice(0, 120),
    topic: get("topic"),
  };
  if (!(offer.topics as readonly string[]).includes(values.topic)) values.topic = offer.topics[0];

  const errors: LtLeadState["errors"] = {};
  if (values.name.length < 2) errors.name = "Skriv inn navnet ditt.";
  if (!PHONE.test(values.phone)) errors.phone = "Skriv inn et gyldig telefonnummer.";
  if (values.email && !EMAIL.test(values.email)) errors.email = "E-postadressen ser ikke riktig ut.";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const tel = compactPhone(values.phone);
  const head = await headers();
  const ip = (head.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (throttled(`ip:${ip}`)) return { status: "error", message: `Du har sendt flere forespørsler på kort tid. Ring oss på ${LT.phoneShort}.`, values };
  if (isDoubleSubmit(tel)) return { status: "success" };

  const attr = parseAttribution(get("attr"));
  const eventId = /^[0-9a-f-]{36}$/i.test(get("event_id")) ? get("event_id") : randomUUID();
  const marketing = get("mc") === "1";
  const jar = await cookies();
  const fbp = marketing ? jar.get("_fbp")?.value : undefined;
  const fbc = attr.fbc || (marketing ? jar.get("_fbc")?.value : undefined);

  // The sheet is the only channel for ad leads, so a failed write must not look like success.
  try {
    await appendLtLead({ ...values, phone: tel, source, ...attr, eventId, fbp });
  } catch (error) {
    console.error("Lillestrøm lead: could not write to the leads sheet", error);
    return { status: "error", message: `Forespørselen ble ikke sendt. Ring oss på ${LT.phoneShort}.`, values };
  }

  // Meta ad clicks are always reported (click id, IP, user agent); hashed contact details only with marketing consent.
  if (marketing || fbc) {
    const userAgent = head.get("user-agent") ?? undefined;
    after(() =>
      sendLtCapiLead({
        eventId,
        eventSourceUrl: attr.landingUrl || ltLandingUrl(source),
        email: marketing ? values.email : "",
        phone: marketing ? tel : "",
        fbc,
        fbp,
        ip: ip === "unknown" ? undefined : ip,
        userAgent,
        value: offer.value,
        source,
      }).catch((error) => console.error("Lillestrøm lead: Meta Conversions API failed", error)),
    );
  }
  return { status: "success", values, eventId };
}
