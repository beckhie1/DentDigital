"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";
import { articles } from "@/lib/articles";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
      {children}
    </p>
  );
}

const check = (
  <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function HomePage() {
  const { lang } = useLang();
  const t = ui.home;
  const c = ui.common;
  const featured = services.filter((s) => s.featured);
  const latestArticles = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="animate-fade-up">
            <Kicker>{t.badge[lang]}</Kicker>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              {t.heroTitle[lang]}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">{t.heroSub[lang]}</p>
            <ul className="mt-6 space-y-2.5">
              {t.heroPoints[lang].map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                  {check}
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kontakt" className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-lg">
                {c.startToday[lang]}
              </Link>
              <Link href="/tjenester" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-400 hover:text-teal-700">
                {c.exploreServices[lang]}
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              <span className="text-2xl font-extrabold text-teal-700">50+</span>{" "}
              {t.heroStat[lang]}
            </p>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-teal-200/40 to-cyan-200/40 blur-2xl" />
            <Image
              src="/dental-software-dashboard.png"
              alt="DentDigital dashboard"
              width={640}
              height={480}
              className="relative rounded-2xl shadow-2xl ring-1 ring-slate-900/10"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker>{t.servicesKicker[lang]}</Kicker>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t.servicesTitle[lang]}
            </h2>
            <p className="mt-4 text-slate-600">{t.servicesSub[lang]}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s.slug}
                href={`/tjenester/${s.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title[lang]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700">
                    {s.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{s.short[lang]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
                    {c.readMore[lang]}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tjenester" className="inline-block rounded-lg border border-teal-600 px-6 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-600 hover:text-white">
              {c.seeAllServices[lang]}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">{t.statsTitle[lang]}</h2>
            <p className="mt-3 text-teal-100">{t.statsSub[lang]}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {t.stats[lang].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-extrabold">{s.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-teal-200">
                  {s.label}
                </p>
                <p className="mt-2 text-sm text-teal-100">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker>{t.whyKicker[lang]}</Kicker>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t.whyTitle[lang]}
            </h2>
            <p className="mt-4 text-slate-600">{t.whySub[lang]}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.whyPoints[lang].map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  {check}
                </div>
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/om-oss" className="text-sm font-semibold text-teal-700 hover:underline">
              {t.whyLink[lang]} →
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker>{t.articlesKicker[lang]}</Kicker>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t.articlesTitle[lang]}
            </h2>
            <p className="mt-4 text-slate-600">{t.articlesSub[lang]}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {latestArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/fagartikler/${a.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={a.image}
                    alt={a.title[lang]}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-700 backdrop-blur">
                    {a.category[lang]}
                  </span>
                </div>
                <div className="p-6">
                  <time className="text-xs text-slate-500" dateTime={a.date}>
                    {new Date(a.date).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                  <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-teal-700">
                    {a.title[lang]}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{a.excerpt[lang]}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/fagartikler" className="inline-block rounded-lg border border-teal-600 px-6 py-3 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-600 hover:text-white">
              {c.seeAllArticles[lang]}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-700 to-cyan-800 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
            {t.ctaKicker[lang]}
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t.ctaTitle[lang]}</h2>
          <p className="mt-4 text-teal-100">{t.ctaSub[lang]}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/kontakt" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-800 shadow-md transition-transform hover:scale-105">
              {c.startToday[lang]}
            </Link>
            <Link href="/tjenester" className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              {c.exploreServices[lang]}
            </Link>
          </div>
          <p className="mt-6 text-sm text-teal-200">{t.ctaNote[lang]}</p>
        </div>
      </section>
    </>
  );
}
