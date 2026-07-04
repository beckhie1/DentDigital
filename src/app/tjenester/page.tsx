"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";

const check = (
  <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function ServicesPage() {
  const { lang } = useLang();
  const t = ui.servicesPage;

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
            {t.kicker[lang]}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t.title[lang]}
          </h1>
          <p className="mt-5 text-lg text-slate-600">{t.sub[lang]}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {services.map((s) => (
            <div key={s.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
              <span className="text-3xl" aria-hidden>{s.icon}</span>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{s.title[lang]}</h2>
              <p className="mt-1.5 text-sm italic text-slate-500">{s.tagline[lang]}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {s.features[lang].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    {check}
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/tjenester/${s.slug}`} className="mt-5 text-sm font-semibold text-teal-700 hover:underline">
                {s.cta[lang]} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.benefitsTitle[lang]}</h2>
            <p className="mt-3 text-slate-600">{t.benefitsSub[lang]}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.benefits[lang].map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">
                {check}
                <span className="text-sm font-medium text-slate-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-teal-700 to-cyan-800 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">{t.ctaTitle[lang]}</h2>
          <p className="mt-4 text-teal-100">{t.ctaSub[lang]}</p>
          <Link href="/kontakt" className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-800 shadow-md transition-transform hover:scale-105">
            {ui.nav.contactCta[lang]}
          </Link>
        </div>
      </section>
    </>
  );
}
