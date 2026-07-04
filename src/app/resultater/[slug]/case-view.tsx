"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { cases, getCase } from "@/lib/cases";
import { getService } from "@/lib/services";
import { Reveal } from "@/components/motion/Reveal";
import Magnetic from "@/components/shell/Magnetic";

export default function CaseView({ slug }: { slug: string }) {
  const { lang } = useLang();
  const cs = getCase(slug)!;
  const others = cases.filter((c) => c.slug !== slug).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <Link href="/resultater" className="link-sweep text-sm font-semibold text-accent-ink">
              ← {lang === "no" ? "Alle resultater" : "All results"}
            </Link>
          </Reveal>
          <Reveal className="reveal-fade mt-6 flex flex-wrap items-center gap-3 text-xs" delay={100}>
            <span className="font-semibold uppercase tracking-[0.14em] text-ink-40">
              {cs.client[lang]}
            </span>
            {cs.services.map((sSlug) => {
              const s = getService(sSlug);
              return s ? (
                <Link
                  key={sSlug}
                  href={`/tjenester/${sSlug}`}
                  className="rounded-full border border-line px-2.5 py-0.5 text-ink-60 transition-colors hover:border-accent-ink hover:text-accent-ink"
                >
                  {s.title[lang]}
                </Link>
              ) : null;
            })}
          </Reveal>
          <Reveal className="reveal-fade mt-5" delay={200}>
            <h1 className="max-w-4xl font-display text-[length:var(--text-display-md)] font-semibold leading-[1.1] text-ink lg:text-[length:var(--text-display-lg)]">
              {cs.summary[lang]}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Body with sticky metrics */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <div>
            <Reveal className="reveal-fade">
              <div className="relative h-72 overflow-hidden rounded-[--radius-card] sm:h-96">
                <Image
                  src={cs.image}
                  alt={cs.client[lang]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>

            <Reveal className="reveal-fade mt-14" delay={100}>
              <p className="section-num">01 — {lang === "no" ? "Utfordring" : "Challenge"}</p>
              <p className="mt-4 text-lg leading-relaxed text-ink-60">{cs.challenge[lang]}</p>
            </Reveal>

            <Reveal className="reveal-fade mt-12" delay={150}>
              <p className="section-num">02 — {lang === "no" ? "Løsning" : "Solution"}</p>
              <p className="mt-4 text-lg leading-relaxed text-ink-60">{cs.solution[lang]}</p>
            </Reveal>
          </div>

          {/* Sticky results column */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal className="reveal-fade rounded-[--radius-card] border border-line bg-white p-8" delay={200}>
              <p className="section-num">03 — {lang === "no" ? "Resultater" : "Results"}</p>
              <dl className="mt-6 space-y-7">
                {cs.metrics.map((m) => (
                  <div key={m.value} className="hairline pt-5 first:border-t-0 first:pt-0">
                    <dd className="font-display text-4xl font-semibold text-accent-ink">{m.value}</dd>
                    <dd className="mt-1.5 text-sm leading-snug text-ink-60">{m.label[lang]}</dd>
                  </div>
                ))}
              </dl>
              <Magnetic className="mt-8">
                <Link
                  href="/kontakt"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-accent-ink"
                >
                  {lang === "no" ? "Få lignende resultater" : "Get similar results"}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* More cases */}
      <section className="dark-section bg-dark py-20 text-canvas lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <h2 className="font-display text-[length:var(--text-display-md)] font-semibold">
              {lang === "no" ? "Flere resultater" : "More results"}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {others.map((c, i) => (
              <Reveal key={c.slug} className="reveal-fade" delay={i * 100}>
                <Link
                  href={`/resultater/${c.slug}`}
                  className="group block rounded-[--radius-card] border border-line-dark bg-dark-soft p-8 transition-colors duration-300 hover:border-accent-bright/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/50">
                    {c.client[lang]}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug group-hover:text-accent-bright">
                    {c.summary[lang]}
                  </h3>
                  <p className="mt-5 font-display text-2xl font-semibold text-accent-bright">
                    {c.metrics[0].value}{" "}
                    <span className="text-sm font-normal text-canvas/50">{c.metrics[0].label[lang]}</span>
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
