"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";

export type ConsentValue = "all" | "necessary";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem("dentdigital-consent");
  return v === "all" || v === "necessary" ? v : null;
}

/** GDPR consent banner. Gates any future analytics behind "all". */
export default function ConsentBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const choose = (value: ConsentValue) => {
    window.localStorage.setItem("dentdigital-consent", value);
    setVisible(false);
  };

  if (!visible) return null;
  const t = ui.consent;

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
