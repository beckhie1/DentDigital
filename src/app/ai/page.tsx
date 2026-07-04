"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";

const icons = ["💬", "📚", "🔎", "📨", "📈"];

export default function AiPage() {
  const { lang } = useLang();
  const t = ui.ai;

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
              AI
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {t.title[lang]}
            </h1>
            <p className="mt-5 text-lg text-slate-600">{t.sub[lang]}</p>
            <Link href="/kontakt" className="mt-8 inline-block rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-colors hover:bg-teal-700">
              {ui.nav.contactCta[lang]}
            </Link>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 blur-2xl" />
            <Image
              src="/dental-software-dashboard.png"
              alt={t.title[lang]}
              width={620}
              height={460}
              className="relative rounded-2xl shadow-2xl ring-1 ring-slate-900/10"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.servicesTitle[lang]}</h2>
            <p className="mt-4 text-slate-600">{t.servicesSub[lang]}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.services[lang].map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg">
                <span className="text-3xl" aria-hidden>{icons[i]}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
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
