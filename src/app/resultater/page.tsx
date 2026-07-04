"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { cases } from "@/lib/cases";
import { getService } from "@/lib/services";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

const heroLines = {
  no: ["Ekte prosjekter,", "målbare tall."],
  en: ["Real projects,", "measurable numbers."],
};

export default function ResultsPage() {
  const { lang } = useLang();

  return (
    <>
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <p className="section-num">{lang === "no" ? "Resultater" : "Results"}</p>
          </Reveal>
          <h1 className="mt-4 font-display text-[length:var(--text-display-lg)] font-semibold leading-[1.05] text-ink">
            <RevealLines lines={heroLines[lang]} />
          </h1>
          <Reveal className="reveal-fade mt-6 max-w-2xl text-lg leading-relaxed text-ink-60" delay={250}>
            {lang === "no"
              ? "Vi måler suksess i bookinger, oppetid og spart tid – ikke i fine ord. Her er et utvalg prosjekter for klinikker som din."
              : "We measure success in bookings, uptime and time saved – not in fine words. Here is a selection of projects for clinics like yours."}
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {cases.map((cs, i) => (
            <Reveal key={cs.slug} className="reveal-fade" delay={i * 100}>
              <Link
                href={`/resultater/${cs.slug}`}
                className="group grid overflow-hidden rounded-[--radius-card] border border-line bg-white transition-all duration-300 hover:border-accent-ink/40 hover:shadow-xl hover:shadow-ink/5 lg:grid-cols-[1.1fr_1.4fr]"
              >
                <div className="relative h-64 overflow-hidden lg:h-auto">
                  <Image
                    src={cs.image}
                    alt={cs.client[lang]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                  />
                </div>
                <div className="p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-semibold uppercase tracking-[0.14em] text-ink-40">
                      {cs.client[lang]}
                    </span>
                    {cs.services.map((slug) => {
                      const s = getService(slug);
                      return s ? (
                        <span key={slug} className="rounded-full border border-line px-2.5 py-0.5 text-ink-60">
                          {s.title[lang]}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink group-hover:text-accent-ink">
                    {cs.summary[lang]}
                  </h2>
                  <dl className="hairline mt-6 grid grid-cols-3 gap-6 pt-6">
                    {cs.metrics.map((m) => (
                      <div key={m.value}>
                        <dd className="font-display text-3xl font-semibold text-accent-ink">{m.value}</dd>
                        <dd className="mt-1 text-xs leading-snug text-ink-60">{m.label[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="link-sweep mt-8 inline-block text-sm font-semibold text-ink">
                    {lang === "no" ? "Les hele casen" : "Read the full case"} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
