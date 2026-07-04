"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";
import { articles } from "@/lib/articles";
import { Reveal, RevealLines, CountUp } from "@/components/motion/Reveal";
import ParticleField from "@/components/home/ParticleField";

const heroLines = {
  no: ["Digitalt partnerskap", "for norske", "tannklinikker."],
  en: ["Digital partnership", "for Norwegian", "dental clinics."],
};

const marqueeItems = {
  no: ["Nettsider", "Lokal SEO", "IT-drift", "Opus-integrasjon", "Sikkerhetskopi", "GDPR", "Datainnsikt", "AI-løsninger"],
  en: ["Websites", "Local SEO", "IT Operations", "Opus Integration", "Backup", "GDPR", "Data Insight", "AI Solutions"],
};

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
      {/* Hero — signature section */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden">
        <ParticleField className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas via-canvas/60 to-transparent" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-4 pb-10 pt-14 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-60">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t.badge[lang]}
          </Reveal>

          <div className="max-w-4xl">
            <h1 className="font-display text-[length:var(--text-display-xl)] font-semibold leading-[1.02] text-ink">
              <RevealLines lines={heroLines[lang]} />
            </h1>
            <Reveal className="reveal-fade mt-6 max-w-xl text-lg leading-relaxed text-ink-60" delay={350}>
              {t.heroSub[lang]}
            </Reveal>
            <Reveal className="reveal-fade mt-8 flex flex-wrap items-center gap-4" delay={500}>
              <Link
                href="/kontakt"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-colors duration-300 hover:bg-accent-ink"
              >
                {c.startToday[lang]}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/tjenester" className="link-sweep text-sm font-semibold text-ink">
                {c.exploreServices[lang]}
              </Link>
            </Reveal>
          </div>

          <Reveal className="reveal-fade hairline flex flex-wrap items-center gap-x-10 gap-y-3 pt-5 text-sm text-ink-60" delay={650}>
            {t.heroPoints[lang].map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="dark-section overflow-hidden border-y border-line-dark bg-dark py-4" aria-hidden>
        <div className="marquee-track gap-0">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {marqueeItems[lang].map((item) => (
                <span key={item + dup} className="flex items-center gap-6 pr-6 font-display text-sm font-medium uppercase tracking-[0.18em] text-canvas/70">
                  {item}
                  <span className="h-1 w-1 rounded-full bg-accent-bright" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

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
