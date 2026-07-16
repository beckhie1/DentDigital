"use client";

import { useEffect, useState } from "react";
import { submitLead } from "@/app/actions/submit-lead";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-base placeholder:text-ink-40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent";

interface Props {
  clinicSlug: string;
  kilde: "tilbud" | "tannlegevakt";
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function LeadForm({ clinicSlug, kilde }: Props) {
  const [form, setForm] = useState({
    navn: "",
    epost: "",
    telefon: "",
    onsketDato: "",
    kommentar: "",
  });
  const [utm, setUtm] = useState({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utmSource: p.get("utm_source") ?? "",
      utmMedium: p.get("utm_medium") ?? "",
      utmCampaign: p.get("utm_campaign") ?? "",
      utmContent: p.get("utm_content") ?? "",
      utmTerm: p.get("utm_term") ?? "",
    });
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await submitLead({ clinicSlug, kilde, ...form, ...utm });
      if (result.success) {
        setSubmitted(true);
        window.fbq?.("track", "Lead");
        window.gtag?.("event", "conversion", {
          send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
        });
      } else {
        setError(result.error ?? "Noe gikk galt. Vennligst prøv igjen.");
      }
    } catch {
      setError("Noe gikk galt. Vennligst prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-3 py-10 text-center">
        <div className="text-5xl">✅</div>
        <h3 className="font-display text-2xl">Takk for din henvendelse!</h3>
        <p className="text-ink-60">Klinikken kontakter deg snart for å bekrefte timen din.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="navn" className="mb-1.5 block text-sm font-medium">Navn *</label>
        <input id="navn" required placeholder="Ditt fulle navn" value={form.navn} onChange={set("navn")} className={inputCls} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="epost" className="mb-1.5 block text-sm font-medium">E-post *</label>
          <input id="epost" type="email" required placeholder="din@epost.no" value={form.epost} onChange={set("epost")} className={inputCls} />
        </div>
        <div>
          <label htmlFor="telefon" className="mb-1.5 block text-sm font-medium">Telefon *</label>
          <input id="telefon" type="tel" inputMode="tel" required placeholder="4X XXX XXX" value={form.telefon} onChange={set("telefon")} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="onsketDato" className="mb-1.5 block text-sm font-medium">Ønsket dato og tid</label>
        <input id="onsketDato" placeholder="F.eks. mandag 20. juli kl. 10:00" value={form.onsketDato} onChange={set("onsketDato")} className={inputCls} />
      </div>

      <div>
        <label htmlFor="kommentar" className="mb-1.5 block text-sm font-medium">Kommentar</label>
        <textarea id="kommentar" rows={3} placeholder="Er det noe annet klinikken bør vite?" value={form.kommentar} onChange={set("kommentar")} className={`${inputCls} resize-none`} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-accent py-3.5 text-base font-semibold text-ink transition-all hover:bg-accent-bright active:scale-[0.98] disabled:opacity-50"
      >
        {submitting ? "Sender…" : "Bestill time nå"}
      </button>

      <p className="text-center text-xs text-ink-40">
        Ved å sende inn skjemaet godtar du vår{" "}
        <a href="/personvern" className="underline">personvernerklæring</a>.
      </p>
    </form>
  );
}
