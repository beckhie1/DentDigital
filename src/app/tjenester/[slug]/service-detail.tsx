"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { getService, services } from "@/lib/services";
import { cases } from "@/lib/cases";
import { Reveal } from "@/components/motion/Reveal";
import Magnetic from "@/components/shell/Magnetic";

export default function ServiceDetail({ slug }: { slug: string }) {
  const { lang } = useLang();
  const service = getService(slug)!;
  const index = services.findIndex((s) => s.slug === slug);
  const others = services.filter((s) => s.slug !== slug && s.featured).slice(0, 3);
  const relatedCase = cases.find((c) => c.services.includes(slug));

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <Reveal className="reveal-fade flex items-center gap-3">
              <span className="section-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-60">
                {ui.nav.services[lang]}
              </span>
            </Reveal>
            <Reveal className="reveal-fade mt-4" delay={100}>
              <h1 className="font-display text-[length:var(--text-display-lg)] font-semibold leading-[1.05] text-ink">
                {service.title[lang]}
              </h1>
            </Reveal>
            <Reveal className="reveal-fade mt-5 max-w-xl text-lg leading-relaxed text-ink-60" delay={220}>
              {service.tagline[lang]}
            </Reveal>
            <Reveal className="reveal-fade mt-8" delay={340}>
              <Magnetic>
                <Link
                  href="/kontakt"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-colors hover:bg-accent-ink"
                >
                  {service.cta[lang]}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </Magnetic>
            </Reveal>
          </div>
          <Reveal className="reveal-fade" delay={200}>
            <div className="relative h-64 overflow-hidden rounded-[--radius-card] lg:h-80">
              <Image
                src={service.image}
                alt={service.title[lang]}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <p className="section-num">{lang === "no" ? "Leveranser" : "Deliverables"}</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {lang === "no" ? "Hva vi leverer" : "What we deliver"}
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {service.features[lang].map((f, i) => {
              const [head, ...rest] = f.split(": ");
              const hasHead = rest.length > 0;
              return (
                <Reveal key={f} className="reveal-fade hairline pt-5" delay={(i % 2) * 100}>
                  <li className="flex items-baseline gap-4">
                    <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-ink-60">
                      {hasHead ? (
                        <>
                          <span className="font-semibold text-ink">{head}.</span>{" "}
                          {rest.join(": ")}
                        </>
                      ) : (
                        <span className="font-medium text-ink">{f}</span>
                      )}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Related case */}
      {relatedCase && (
        <section className="dark-section bg-dark py-20 text-canvas lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="reveal-fade">
              <p className="section-num">{ui.home.resultsKicker[lang]}</p>
              <h2 className="mt-3 max-w-2xl font-display text-[length:var(--text-display-md)] font-semibold leading-[1.08]">
                {relatedCase.summary[lang]}
              </h2>
            </Reveal>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
              <dl className="grid grid-cols-3 gap-8">
                {relatedCase.metrics.map((m) => (
                  <div key={m.value}>
                    <dd className="font-display text-3xl font-semibold text-accent-bright">{m.value}</dd>
                    <dd className="mt-1 max-w-[10rem] text-xs leading-snug text-canvas/50">{m.label[lang]}</dd>
                  </div>
                ))}
              </dl>
              <Link href={`/resultater/${relatedCase.slug}`} className="link-sweep text-sm font-semibold">
                {lang === "no" ? "Les hele casen" : "Read the full case"} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Other services */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <h2 className="font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {lang === "no" ? "Andre tjenester" : "Other services"}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.slug} className="reveal-fade" delay={i * 100}>
                <Link
                  href={`/tjenester/${s.slug}`}
                  className="group block rounded-[--radius-card] border border-line p-7 transition-all duration-300 hover:border-accent-ink/40 hover:shadow-lg hover:shadow-ink/5"
                >
                  <span className="section-num">
                    {String(services.findIndex((x) => x.slug === s.slug) + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink group-hover:text-accent-ink">
                    {s.title[lang]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-60">{s.short[lang]}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
