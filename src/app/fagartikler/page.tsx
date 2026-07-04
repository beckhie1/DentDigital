"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { articles } from "@/lib/articles";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

const heroLines = {
  no: ["Fagartikler", "og ressurser."],
  en: ["Articles", "and resources."],
};

export default function ArticlesPage() {
  const { lang } = useLang();
  const t = ui.articlesPage;
  const [category, setCategory] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...articles].sort((a, b) => b.date.localeCompare(a.date)),
    []
  );
  const categories = useMemo(
    () => [...new Set(sorted.map((a) => a.category[lang]))],
    [sorted, lang]
  );
  const filtered = useMemo(
    () => sorted.filter((a) => !category || a.category[lang] === category),
    [sorted, category, lang]
  );
  const [featuredArticle, ...rest] = filtered;

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

          {/* Category filter */}
          <Reveal className="reveal-fade mt-10 flex flex-wrap gap-2" delay={350}>
            <button
              onClick={() => setCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === null
                  ? "bg-ink text-canvas"
                  : "border border-line text-ink-60 hover:border-ink hover:text-ink"
              }`}
            >
              {t.all[lang]}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? null : c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-ink text-canvas"
                    : "border border-line text-ink-60 hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured latest article */}
          {featuredArticle && (
            <Reveal className="reveal-fade">
              <Link
                href={`/fagartikler/${featuredArticle.slug}`}
                className="group grid overflow-hidden rounded-[--radius-card] border border-line bg-white transition-all duration-300 hover:border-accent-ink/40 hover:shadow-xl hover:shadow-ink/5 lg:grid-cols-2"
              >
                <div className="relative h-64 overflow-hidden lg:h-auto">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title[lang]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-semibold uppercase tracking-[0.14em] text-accent-ink">
                      {featuredArticle.category[lang]}
                    </span>
                    <time className="text-ink-40" dateTime={featuredArticle.date}>
                      {new Date(featuredArticle.date).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink group-hover:text-accent-ink lg:text-3xl">
                    {featuredArticle.title[lang]}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-60">{featuredArticle.excerpt[lang]}</p>
                  <span className="link-sweep mt-6 self-start text-sm font-semibold text-ink">
                    {ui.common.readMore[lang]} →
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} className="reveal-fade" delay={(i % 3) * 100}>
                <Link href={`/fagartikler/${a.slug}`} className="group block">
                  <div className="relative h-52 overflow-hidden rounded-[--radius-card]">
                    <Image
                      src={a.image}
                      alt={a.title[lang]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-60">
                    {a.excerpt[lang]}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="dark-section bg-dark py-20 text-canvas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <p className="section-num">→</p>
              <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold">
                {t.newsletterTitle[lang]}
              </h2>
              <p className="mt-4 text-canvas/60">{t.newsletterSub[lang]}</p>
            </div>
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder={ui.contact.email[lang]}
                className="w-full rounded-full border border-line-dark bg-dark-soft px-5 py-3 text-sm text-canvas outline-none transition-colors placeholder:text-canvas/40 focus:border-accent-bright"
              />
              <button className="shrink-0 rounded-full bg-accent-bright px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-canvas">
                {t.subscribe[lang]}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
