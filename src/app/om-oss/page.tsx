"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";

const valueIcons = ["🌍", "🔒", "💡"];

export default function AboutPage() {
  const { lang } = useLang();
  const t = ui.about;

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
              {t.kicker[lang]}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {t.title[lang]}
            </h1>
            <p className="mt-5 text-lg text-slate-600">{t.sub[lang]}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 blur-2xl" />
            <Image
              src="/dental-technology-team.png"
              alt="DentDigital team"
              width={620}
              height={460}
              className="relative rounded-2xl shadow-2xl ring-1 ring-slate-900/10"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">{t.historyTitle[lang]}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600">
            {t.history[lang].map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t.valuesTitle[lang]}</h2>
            <p className="mt-3 text-slate-600">{t.valuesSub[lang]}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.values[lang].map((v, i) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                <span className="text-3xl" aria-hidden>{valueIcons[i]}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
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
            {t.ctaButton[lang]}
          </Link>
        </div>
      </section>
    </>
  );
}
