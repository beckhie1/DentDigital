"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { submitLillestromLead, type LtLeadState } from "@/app/actions/submit-lillestrom-lead";
import { LT, LT_THANKS_PATH, type LtSource } from "@/lib/lillestrom";
import { LEAD_KEY, campaignTagsFromUrl, getAttribution, hasMarketingConsent } from "./track";

const input =
  "mt-1.5 block w-full rounded-xl border border-lt-line bg-white px-4 text-base text-lt-ink transition-colors placeholder:text-lt-ink-soft/70 hover:border-lt-cobalt/40 focus:border-lt-cobalt focus:outline-none aria-[invalid=true]:border-2 aria-[invalid=true]:border-red-600";
const label = "font-lt text-sm font-semibold text-lt-ink";

function FieldError({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-semibold text-red-700">
      {text}
    </p>
  );
}

/** Carries the ad click ids and utm tags to the server so the lead row shows which campaign it came from. */
function AttributionField() {
  const [fields, setFields] = useState({ attr: "", eventId: "", mc: "" });
  useEffect(() => {
    // Read after mount: sessionStorage does not exist during server rendering.
    const eventId = crypto.randomUUID();
    const sync = () => setFields({ attr: JSON.stringify({ ...campaignTagsFromUrl(), ...getAttribution() }), eventId, mc: hasMarketingConsent() ? "1" : "" });
    sync();
    window.addEventListener("dentdigital-consent", sync);
    return () => window.removeEventListener("dentdigital-consent", sync);
  }, []);
  return (
    <>
      <input type="hidden" name="attr" value={fields.attr} readOnly />
      <input type="hidden" name="event_id" value={fields.eventId} readOnly />
      <input type="hidden" name="mc" value={fields.mc} readOnly />
    </>
  );
}

type Props = {
  source: LtSource;
  topics: string[];
  submitLabel: string;
  preferredLabel?: string;
  preferredPlaceholder?: string;
};

export default function LeadForm({ source, topics, submitLabel, preferredLabel, preferredPlaceholder }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState<LtLeadState, FormData>(submitLillestromLead, { status: "idle" });
  const e = state.errors ?? {};
  const v = state.values;

  useEffect(() => {
    if (state.status !== "success") return;
    // The thank-you page fires the Meta Lead event once, using these details.
    try {
      sessionStorage.setItem(LEAD_KEY, JSON.stringify({ source, email: v?.email ?? "", phone: v?.phone ?? "", eventId: state.eventId ?? "" }));
    } catch {}
    router.push(`${LT_THANKS_PATH}?k=${source}`);
  }, [state.status, state.eventId, source, router, v?.email, v?.phone]);

  const invalid = (f: keyof typeof e) => (e[f] ? { "aria-invalid": true, "aria-describedby": `${source}-${f}-error` } : {});

  return (
    <form action={action} noValidate className="grid gap-4">
      <input type="hidden" name="source" value={source} />
      <AttributionField />

      <div>
        <label htmlFor={`${source}-name`} className={label}>
          Navn
        </label>
        <input id={`${source}-name`} name="name" required autoComplete="name" autoCapitalize="words" enterKeyHint="next" placeholder="Ditt fulle navn" defaultValue={v?.name} className={`${input} h-12`} {...invalid("name")} />
        <FieldError id={`${source}-name-error`} text={e.name} />
      </div>

      <div>
        <label htmlFor={`${source}-phone`} className={label}>
          Telefon
        </label>
        <input
          id={`${source}-phone`}
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="4x xxx xxx"
          defaultValue={v?.phone}
          className={`${input} h-12 tabular-nums`}
          {...invalid("phone")}
        />
        <FieldError id={`${source}-phone-error`} text={e.phone} />
      </div>

      {topics.length > 1 ? (
        <div>
          <label htmlFor={`${source}-topic`} className={label}>
            Hva gjelder det?
          </label>
          <select id={`${source}-topic`} name="topic" defaultValue={v?.topic ?? topics[0]} className={`${input} h-12`}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="topic" value={topics[0]} />
      )}

      <div>
        <label htmlFor={`${source}-email`} className={label}>
          E-post <span className="font-normal text-lt-ink-soft">(valgfritt)</span>
        </label>
        <input
          id={`${source}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          enterKeyHint={preferredLabel ? "next" : "send"}
          placeholder="din@epost.no"
          defaultValue={v?.email}
          className={`${input} h-12`}
          {...invalid("email")}
        />
        <FieldError id={`${source}-email-error`} text={e.email} />
      </div>

      {preferredLabel && (
        <div>
          <label htmlFor={`${source}-preferred`} className={label}>
            {preferredLabel} <span className="font-normal text-lt-ink-soft">(valgfritt)</span>
          </label>
          <input
            id={`${source}-preferred`}
            name="preferred"
            enterKeyHint="send"
            placeholder={preferredPlaceholder}
            maxLength={120}
            defaultValue={v?.preferred}
            className={`${input} h-12`}
          />
        </div>
      )}

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${source}-company`}>Firma</label>
        <input id={`${source}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-lt-frost p-4 text-sm font-semibold text-lt-ink">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending || state.status === "success"} className="lt-btn-primary w-full disabled:opacity-60">
        {pending || state.status === "success" ? "Sender …" : submitLabel}
      </button>
      <p className="-mt-1 text-center text-xs text-lt-ink-soft">
        Vi bruker opplysningene til å kontakte deg.{" "}
        <a href={LT.privacyUrl} className="font-semibold text-lt-cobalt underline-offset-4 hover:underline">
          Personvern
        </a>
      </p>
    </form>
  );
}
