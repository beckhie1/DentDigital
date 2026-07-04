"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import Magnetic from "@/components/shell/Magnetic";

const heroLines = {
  no: ["AI for", "tannklinikker."],
  en: ["AI for", "dental clinics."],
};

const chatDemo = {
  no: [
    { from: "patient", text: "Hei! Har dere ledig time til undersøkelse denne uken?" },
    { from: "ai", text: "Hei! Ja, vi har ledige timer torsdag kl. 10:15 og fredag kl. 14:30. Hvilken passer best?" },
    { from: "patient", text: "Torsdag 10:15." },
    { from: "ai", text: "Booket! Du får SMS-bekreftelse straks, og en påminnelse dagen før. Velkommen! 🦷" },
  ],
  en: [
    { from: "patient", text: "Hi! Do you have an opening for a check-up this week?" },
    { from: "ai", text: "Hi! Yes, we have openings Thursday at 10:15 and Friday at 14:30. Which works best?" },
    { from: "patient", text: "Thursday 10:15." },
    { from: "ai", text: "Booked! You'll receive an SMS confirmation right away, and a reminder the day before. Welcome! 🦷" },
  ],
};

export default function AiPage() {
  const { lang } = useLang();
  const t = ui.ai;

  return (
    <>
      {/* Hero with chat demo */}
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <Reveal className="reveal-fade">
              <p className="section-num">AI</p>
            </Reveal>
            <h1 className="mt-4 font-display text-[length:var(--text-display-lg)] font-semibold leading-[1.05] text-ink">
              <RevealLines lines={heroLines[lang]} />
            </h1>
            <Reveal className="reveal-fade mt-6 max-w-xl text-lg leading-relaxed text-ink-60" delay={250}>
              {t.sub[lang]}
            </Reveal>
            <Reveal className="reveal-fade mt-8" delay={370}>
              <Magnetic>
                <Link
                  href="/kontakt"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-ink"
                >
                  {ui.nav.contactCta[lang]}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
            </Reveal>
          </div>

          {/* Demo-feel chat mock */}
          <Reveal className="reveal-fade" delay={200}>
            <div className="rounded-[--radius-card] border border-line bg-white p-6 shadow-xl shadow-ink/5">
              <div className="hairline flex items-center gap-2 pb-4 pt-0" style={{ borderTop: "none", borderBottom: "1px solid var(--color-line)" }}>
                <span className="h-2 w-2 rounded-full bg-accent" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-60">
                  {lang === "no" ? "AI-resepsjonist · demo" : "AI receptionist · demo"}
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {chatDemo[lang].map((m, i) => (
                  <Reveal
                    key={m.text}
                    className={`reveal-fade flex ${m.from === "patient" ? "justify-end" : "justify-start"}`}
                    delay={300 + i * 250}
                  >
                    <p
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "patient"
                          ? "rounded-br-sm bg-ink text-canvas"
                          : "rounded-bl-sm bg-canvas text-ink border border-line"
                      }`}
                    >
                      {m.text}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AI services */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade max-w-2xl">
            <p className="section-num">{lang === "no" ? "Kapabiliteter" : "Capabilities"}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {t.servicesTitle[lang]}
            </h2>
            <p className="mt-4 text-lg text-ink-60">{t.servicesSub[lang]}</p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {t.services[lang].map((s, i) => (
              <Reveal key={s.title} className="reveal-fade" delay={(i % 3) * 100}>
                <p className="section-num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="hairline mt-4 pt-4 font-display text-lg font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-60">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="dark-section bg-dark py-20 text-canvas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="section-num">→</p>
              <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold">
                {t.ctaTitle[lang]}
              </h2>
              <p className="mt-4 text-canvas/60">{t.ctaSub[lang]}</p>
            </div>
            <Magnetic>
              <Link
                href="/kontakt"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-bright px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
              >
                {ui.nav.bookCta[lang]}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
