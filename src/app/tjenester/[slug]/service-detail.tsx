"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { getService, services } from "@/lib/services";

const check = (
  <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function ServiceDetail({ slug }: { slug: string }) {
  const { lang } = useLang();
  const service = getService(slug)!;
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
              {ui.nav.services[lang]}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {service.title[lang]}
            </h1>
            <p className="mt-5 text-lg text-slate-600">{service.tagline[lang]}</p>
            <Link href="/kontakt" className="mt-8 inline-block rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-colors hover:bg-teal-700">
              {service.cta[lang]} →
            </Link>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 blur-2xl" />
            <Image
              src={service.image}
              alt={service.title[lang]}
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
          <h2 className="text-2xl font-bold text-slate-900">
            {lang === "no" ? "Hva vi leverer" : "What we deliver"}
          </h2>
          <ul className="mt-6 space-y-4">
            {service.features[lang].map((f) => (
              <li key={f} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                {check}
                <span className="text-slate-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            {lang === "no" ? "Andre tjenester" : "Other services"}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((s) => (
              <Link key={s.slug} href={`/tjenester/${s.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="text-2xl" aria-hidden>{s.icon}</span>
                <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-teal-700">
                  {s.title[lang]}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{s.short[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-teal-700 to-cyan-800 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">{ui.servicesPage.ctaTitle[lang]}</h2>
          <p className="mt-4 text-teal-100">{ui.servicesPage.ctaSub[lang]}</p>
          <Link href="/kontakt" className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-800 shadow-md transition-transform hover:scale-105">
            {ui.nav.contactCta[lang]}
          </Link>
        </div>
      </section>
    </>
  );
}
