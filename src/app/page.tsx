"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";
import { articles } from "@/lib/articles";
import { cases } from "@/lib/cases";
import { Reveal, RevealLines, CountUp } from "@/components/motion/Reveal";
import ParticleField from "@/components/home/ParticleField";
import Magnetic from "@/components/shell/Magnetic";

const heroLines = {
  no: ["Digitalt partnerskap", "for norske", "tannklinikker."],
  en: ["Digital partnership", "for Norwegian", "dental clinics."],
};

const marqueeItems = {
  no: ["Nettsider", "Lokal SEO", "IT-drift", "Opus-integrasjon", "Sikkerhetskopi", "GDPR", "Datainnsikt", "AI-løsninger"],
  en: ["Websites", "Local SEO", "IT Operations", "Opus Integration", "Backup", "GDPR", "Data Insight", "AI Solutions"],
};

function SectionHead({
  kicker,
  title,
  sub,
  dark = false,
}: {
  kicker: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="reveal-fade max-w-2xl">
      <p className="section-num">{kicker}</p>
      <h2
        className={`mt-3 font-display text-[length:var(--text-display-md)] font-semibold leading-[1.08] ${
          dark ? "text-canvas" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-canvas/60" : "text-ink-60"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export default function HomePage() {
  const { lang } = useLang();
  const t = ui.home;
  const c = ui.common;
  const featured = services.filter((s) => s.featured);
  const featuredCases = cases.filter((cs) => cs.featured).slice(0, 2);
  const latestArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <>
      {/* 01 · Hero */}
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
              <Magnetic>
                <Link
                  href="/kontakt"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-colors duration-300 hover:bg-accent-ink"
                >
                  {c.startToday[lang]}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
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

      {/* 02 · Services — numbered interactive rows */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker={t.servicesKicker[lang]} title={t.servicesTitle[lang]} sub={t.servicesSub[lang]} />
            <Reveal className="reveal-fade" delay={150}>
              <Link href="/tjenester" className="link-sweep text-sm font-semibold text-ink">
                {c.seeAllServices[lang]} →
              </Link>
            </Reveal>
          </div>

          <Reveal className="reveal-fade mt-14">
            <ul className="hairline">
              {featured.map((s, i) => (
                <li key={s.slug} className="hairline first:border-t-0">
                  <Link
                    href={`/tjenester/${s.slug}`}
                    className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-7 transition-colors duration-300 sm:grid-cols-[4rem_1fr_1fr_auto]"
                  >
                    <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-xl font-semibold text-ink transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2 sm:text-2xl">
                      {s.title[lang]}
                    </h3>
                    <p className="hidden max-w-md text-sm leading-relaxed text-ink-60 sm:block">
                      {s.short[lang]}
                    </p>
                    <span
                      aria-hidden
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-accent-ink group-hover:bg-accent-ink group-hover:text-canvas"
                    >
                      →
                    </span>
                    {/* hover image reveal (desktop) */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-24 top-1/2 z-10 hidden h-32 w-48 -translate-y-1/2 overflow-hidden rounded-xl opacity-0 shadow-2xl transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:opacity-100 group-hover:-rotate-2 lg:block"
                    >
                      <Image src={s.image} alt="" fill sizes="192px" className="object-cover" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 03 · Featured results */}
      <section className="dark-section bg-dark py-24 text-canvas lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead dark kicker={t.resultsKicker[lang]} title={t.resultsTitle[lang]} sub={t.resultsSub[lang]} />
            <Reveal className="reveal-fade" delay={150}>
              <Link href="/resultater" className="link-sweep text-sm font-semibold text-canvas">
                {t.resultsLink[lang]} →
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {featuredCases.map((cs, i) => (
              <Reveal key={cs.slug} className="reveal-fade" delay={i * 120}>
                <Link
                  href={`/resultater/${cs.slug}`}
                  className="group block overflow-hidden rounded-[--radius-card] border border-line-dark bg-dark-soft transition-colors duration-300 hover:border-accent-bright/40"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={cs.image}
                      alt={cs.client[lang]}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover opacity-80 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-soft to-transparent" />
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/50">
                      {cs.client[lang]}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-accent-bright">
                      {cs.summary[lang]}
                    </h3>
                    <dl className="hairline-dark mt-6 grid grid-cols-3 gap-4 pt-6">
                      {cs.metrics.map((m) => (
                        <div key={m.value}>
                          <dt className="sr-only">{m.label[lang]}</dt>
                          <dd className="font-display text-2xl font-semibold text-accent-bright">{m.value}</dd>
                          <dd className="mt-1 text-xs leading-snug text-canvas/50">{m.label[lang]}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · Process */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead kicker={t.processKicker[lang]} title={t.processTitle[lang]} sub={t.processSub[lang]} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[--radius-card] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.processSteps[lang].map((step, i) => (
              <Reveal key={step.title} className="reveal-fade bg-canvas p-8" delay={i * 100}>
                <p className="section-num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-60">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 05 · Proof strip */}
      <section className="dark-section border-y border-line-dark bg-dark py-20 text-canvas">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { count: 50, suffix: "+", stat: t.stats[lang][0] },
            { count: null, raw: "24/7", stat: t.stats[lang][1] },
            { count: 100, suffix: "%", stat: t.stats[lang][2] },
            { count: 5, suffix: "+", stat: t.stats[lang][3] },
          ].map(({ count, suffix, raw, stat }, i) => (
            <Reveal key={stat.label} className="reveal-fade" delay={i * 80}>
              <p className="font-display text-5xl font-semibold text-accent-bright">
                {count !== null ? <CountUp value={count} suffix={suffix} /> : raw}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-canvas/60">
                {stat.label}
              </p>
              <p className="mt-2 text-sm text-canvas/50">{stat.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 06 · Why us */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead kicker={t.whyKicker[lang]} title={t.whyTitle[lang]} sub={t.whySub[lang]} />
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {t.whyPoints[lang].map((p, i) => (
              <Reveal key={p.title} className="reveal-fade" delay={(i % 3) * 100}>
                <p className="section-num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="hairline mt-4 pt-4 font-display text-lg font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-60">{p.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="reveal-fade mt-14" delay={200}>
            <Link href="/om-oss" className="link-sweep text-sm font-semibold text-ink">
              {t.whyLink[lang]} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 07 · Articles */}
      <section className="border-t border-line py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker={t.articlesKicker[lang]} title={t.articlesTitle[lang]} sub={t.articlesSub[lang]} />
            <Reveal className="reveal-fade" delay={150}>
              <Link href="/fagartikler" className="link-sweep text-sm font-semibold text-ink">
                {c.seeAllArticles[lang]} →
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {latestArticles.map((a, i) => (
              <Reveal key={a.slug} className="reveal-fade" delay={i * 120}>
                <Link href={`/fagartikler/${a.slug}`} className="group block">
                  <div className="relative h-52 overflow-hidden rounded-[--radius-card]">
                    <Image
                      src={a.image}
                      alt={a.title[lang]}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-xs">
                    <span className="font-semibold uppercase tracking-[0.14em] text-accent-ink">
                      {a.category[lang]}
                    </span>
                    <time className="text-ink-40" dateTime={a.date}>
                      {new Date(a.date).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent-ink">
                    {a.title[lang]}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-60">{a.excerpt[lang]}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
