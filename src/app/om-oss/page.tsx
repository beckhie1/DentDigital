"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

const heroLines = {
  no: ["Din digitale", "partner."],
  en: ["Your digital", "partner."],
};

const stack = ["Next.js", "React", "Microsoft Azure", "Cisco Meraki", "Opus", "Office 365", "Resend", "Vercel"];

export default function AboutPage() {
  const { lang } = useLang();
  const t = ui.about;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <Reveal className="reveal-fade">
              <p className="section-num">{t.kicker[lang]}</p>
            </Reveal>
            <h1 className="mt-4 font-display text-[length:var(--text-display-lg)] font-semibold leading-[1.05] text-ink">
              <RevealLines lines={heroLines[lang]} />
            </h1>
            <Reveal className="reveal-fade mt-6 max-w-xl text-lg leading-relaxed text-ink-60" delay={250}>
              {t.sub[lang]}
            </Reveal>
          </div>
          <Reveal className="reveal-fade" delay={200}>
            <div className="relative h-64 overflow-hidden rounded-[--radius-card] lg:h-80">
              <Image
                src="/dental-technology-team.png"
                alt="DentDigital"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
          <Reveal className="reveal-fade">
            <p className="section-num">01 — {lang === "no" ? "Historien" : "The Story"}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {t.historyTitle[lang]}
            </h2>
          </Reveal>
          <div className="space-y-6">
            {t.history[lang].map((p, i) => (
              <Reveal key={p.slice(0, 24)} className="reveal-fade" delay={i * 120}>
                <p className="hairline pt-6 text-lg leading-relaxed text-ink-60 first:border-t-0 first:pt-0">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="dark-section bg-dark py-20 text-canvas lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade max-w-2xl">
            <p className="section-num">02 — {lang === "no" ? "Verdier" : "Values"}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold">
              {t.valuesTitle[lang]}
            </h2>
            <p className="mt-4 text-lg text-canvas/60">{t.valuesSub[lang]}</p>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[--radius-card] border border-line-dark bg-line-dark md:grid-cols-3">
            {t.values[lang].map((v, i) => (
              <Reveal key={v.title} className="reveal-fade bg-dark-soft p-8" delay={i * 100}>
                <p className="section-num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-5 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-canvas/60">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack + presence */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="reveal-fade">
            <p className="section-num">03 — {lang === "no" ? "Teknologi" : "Technology"}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {lang === "no" ? "Verktøyene vi stoler på" : "The tools we trust"}
            </h2>
            <ul className="mt-8 flex flex-wrap gap-3">
              {stack.map((item) => (
                <li key={item} className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-60">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="reveal-fade" delay={150}>
            <p className="section-num">04 — {lang === "no" ? "Tilstedeværelse" : "Presence"}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {lang === "no" ? "Oslo-basert, landsdekkende" : "Oslo-based, nationwide"}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-60">
              {lang === "no"
                ? "Fra kontoret på Rødtvet i Oslo betjener vi klinikker i hele Norge – fjernstyrt når det er raskest, på stedet når det trengs."
                : "From our office at Rødtvet in Oslo we serve clinics across Norway – remotely when that's fastest, on-site when needed."}
            </p>
            <p className="hairline mt-6 pt-6 text-sm text-ink-60">
              DentDigital AS · Rødtvetveien 5, 0955 Oslo ·{" "}
              <a href="mailto:post@dentdigital.no" className="link-sweep font-medium text-ink">
                post@dentdigital.no
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
