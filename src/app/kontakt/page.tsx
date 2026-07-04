"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  const { lang } = useLang();
  const t = ui.contact;

  const infoItems = [
    { icon: "✉️", label: t.email[lang], value: <a href="mailto:post@dentdigital.no" className="text-teal-700 hover:underline">post@dentdigital.no</a> },
    { icon: "📍", label: t.addressLabel[lang], value: <>DentDigital AS<br />Rødtvetveien 5<br />0955 Oslo</> },
    { icon: "🕒", label: t.hoursLabel[lang], value: t.hours[lang].split("\n").map((l) => <span key={l}>{l}<br /></span>) },
    { icon: "🌐", label: t.websiteLabel[lang], value: <a href="https://www.dentdigital.no" className="text-teal-700 hover:underline">www.dentdigital.no</a> },
  ];

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
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">{t.formTitle[lang]}</h2>
              <p className="mt-2 text-sm text-slate-600">{t.formSub[lang]}</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900">{t.infoTitle[lang]}</h2>
            <ul className="mt-6 space-y-5">
              {infoItems.map((item) => (
                <li key={item.label} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-lg" aria-hidden>
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              <Image src="/norway-map-locations.png" alt={t.coverage[lang]} width={520} height={380} className="w-full object-cover" />
              <p className="bg-white px-5 py-4 text-sm text-slate-600">{t.coverage[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t.faqTitle[lang]}</h2>
            <p className="mt-3 text-slate-600">{t.faqSub[lang]}</p>
          </div>
          <div className="mt-10 space-y-4">
            {t.faq[lang].map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {f.q}
                  <span className="text-teal-600 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
