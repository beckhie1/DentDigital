"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

const heroLines = {
  no: ["Digitale løsninger", "for tannklinikker."],
  en: ["Digital solutions", "for dental clinics."],
};

export default function ServicesPage() {
  const { lang } = useLang();
  const t = ui.servicesPage;
  const primary = services.filter((s) => s.featured);
  const secondary = services.filter((s) => !s.featured);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <p className="section-num">{t.kicker[lang]}</p>
          </Reveal>
          <h1 className="mt-4 font-display text-[length:var(--text-display-lg)] font-semibold leading-[1.05] text-ink">
            <RevealLines lines={heroLines[lang]} />
          </h1>
          <Reveal className="reveal-fade mt-6 max-w-2xl text-lg leading-relaxed text-ink-60" delay={250}>
            {t.sub[lang]}
          </Reveal>
        </div>
      </section>

      {/* Primary services — editorial cards */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {primary.map((s, i) => (
              <Reveal key={s.slug} className="reveal-fade" delay={(i % 2) * 120}>
                <Link
                  href={`/tjenester/${s.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[--radius-card] border border-line bg-white transition-all duration-300 hover:border-accent-ink/40 hover:shadow-xl hover:shadow-ink/5"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title[lang]}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                    />
                    <span className="section-num absolute left-5 top-5 rounded-full bg-canvas/90 px-3 py-1 backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <h2 className="font-display text-xl font-semibold text-ink group-hover:text-accent-ink">
                      {s.title[lang]}
                    </h2>
                    <p className="mt-2 text-sm italic text-ink-40">{s.tagline[lang]}</p>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {s.features[lang].slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-60">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="link-sweep mt-6 self-start text-sm font-semibold text-ink">
                      {s.cta[lang]} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary services — compact rows */}
      <section className="dark-section bg-dark py-20 text-canvas lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade max-w-2xl">
            <p className="section-num">+</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold leading-[1.08]">
              {lang === "no" ? "Flere spesialiserte tjenester" : "More specialized services"}
            </h2>
          </Reveal>
          <ul className="mt-12">
            {secondary.map((s, i) => (
              <Reveal key={s.slug} className="reveal-fade" delay={i * 80}>
                <li className="hairline-dark">
                  <Link
                    href={`/tjenester/${s.slug}`}
                    className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-6"
                  >
                    <span className="section-num">{String(i + 7).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent-bright">
                        {s.title[lang]}
                      </h3>
                      <p className="mt-1 text-sm text-canvas/50">{s.short[lang]}</p>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line-dark transition-all duration-300 group-hover:border-accent-bright group-hover:bg-accent-bright group-hover:text-ink"
                    >
                      →
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade max-w-2xl">
            <p className="section-num">{t.kicker[lang]}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold leading-[1.08] text-ink">
              {t.benefitsTitle[lang]}
            </h2>
            <p className="mt-4 text-lg text-ink-60">{t.benefitsSub[lang]}</p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.benefits[lang].map((b, i) => (
              <Reveal key={b} className="reveal-fade hairline flex items-baseline gap-3 pt-4" delay={(i % 3) * 80}>
                <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium text-ink">{b}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
