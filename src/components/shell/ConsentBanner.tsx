"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { matchHandle } from "@/lib/clinics";

export type ConsentValue = "all" | "necessary";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem("dentdigital-consent");
  return v === "all" || v === "necessary" ? v : null;
}

/** GDPR consent banner. Gates any future analytics behind "all". */
export default function ConsentBanner() {
  const { lang } = useLang();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const choose = (value: ConsentValue) => {
    window.localStorage.setItem("dentdigital-consent", value);
    window.dispatchEvent(new Event("dentdigital-consent"));
    setVisible(false);
  };

  if (!visible) return null;
  const t = ui.consent;

  const seg = pathname?.replace(/^\/+|\/+$/g, "") ?? "";
  const landing = seg && !seg.includes("/") ? matchHandle(seg) : null;

  if (landing) {
    const cta = landing.clinic.branding?.cta ?? "#00c2b8";
    const onCta = landing.clinic.branding?.onCta ?? "#111110";
    return (
      <div className="fixed inset-0 z-[9000] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-[2px] sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie consent"
          className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 text-center shadow-2xl"
        >
          <div className="mb-2 text-3xl">🍪</div>
          <h2 className="font-display mb-2 text-lg font-semibold">
            Få best mulig opplevelse
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-60">
            Vi bruker informasjonskapsler for at siden skal fungere best mulig, og for at
            klinikken skal kunne følge opp henvendelsen din.{" "}
            <Link href="/cookies" className="underline">
              {t.more.no}
            </Link>
          </p>
          <button
            onClick={() => choose("all")}
            style={{ background: cta, color: onCta }}
            className="w-full rounded-xl py-3.5 text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {t.accept.no}
          </button>
          <button
            onClick={() => choose("necessary")}
            className="mt-3 text-xs text-ink-40 underline hover:text-ink"
          >
            {t.necessary.no}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[9000] mx-auto max-w-xl rounded-2xl border border-line bg-canvas p-5 shadow-2xl shadow-ink/10 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <p className="text-sm leading-relaxed text-ink-60">
        {t.text[lang]}{" "}
        <Link href="/cookies" className="link-sweep font-medium text-ink">
          {t.more[lang]}
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => choose("all")}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-ink"
        >
          {t.accept[lang]}
        </button>
        <button
          onClick={() => choose("necessary")}
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-60 transition-colors hover:border-ink hover:text-ink"
        >
          {t.necessary[lang]}
        </button>
      </div>
    </div>
  );
}
