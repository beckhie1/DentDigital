"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { articles, getArticle } from "@/lib/articles";
import { Reveal } from "@/components/motion/Reveal";
import Magnetic from "@/components/shell/Magnetic";

export default function ArticleView({ slug }: { slug: string }) {
  const { lang } = useLang();
  const article = getArticle(slug)!;
  const related = [...articles]
    .filter((a) => a.slug !== slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <article className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="reveal-fade">
            <Link href="/fagartikler" className="link-sweep text-sm font-semibold text-accent-ink">
              ← {ui.articlesPage.backToArticles[lang]}
            </Link>
          </Reveal>
          <Reveal className="reveal-fade mt-8 flex items-center gap-3 text-xs" delay={80}>
            <span className="font-semibold uppercase tracking-[0.14em] text-accent-ink">
              {article.category[lang]}
            </span>
            <time className="text-ink-40" dateTime={article.date}>
              {new Date(article.date).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </Reveal>
          <Reveal className="reveal-fade mt-4" delay={160}>
            <h1 className="font-display text-[length:var(--text-display-md)] font-semibold leading-[1.1] text-ink lg:text-[length:var(--text-display-lg)]">
              {article.title[lang]}
            </h1>
          </Reveal>
          <Reveal className="reveal-fade mt-5 text-xl leading-relaxed text-ink-60" delay={240}>
            {article.excerpt[lang]}
          </Reveal>

          <Reveal className="reveal-fade mt-10" delay={300}>
            <div className="relative h-72 overflow-hidden rounded-[--radius-card] sm:h-96">
              <Image
                src={article.image}
                alt={article.title[lang]}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>

          <div className="mt-14 space-y-12">
            {article.body[lang].map((s, i) => (
              <Reveal key={s.heading} as="section" className="reveal-fade">
                <div className="flex items-baseline gap-4">
                  <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                    {s.heading}
                  </h2>
                </div>
                <p className="hairline mt-4 pt-4 text-lg leading-relaxed text-ink-60">
                  {s.text}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Inline CTA */}
          <Reveal className="reveal-fade mt-16 rounded-[--radius-card] border border-line bg-white p-8">
            <p className="section-num">→</p>
            <p className="mt-3 font-display text-xl font-semibold text-ink">
              {lang === "no"
                ? "Vil du ha hjelp med dette i din klinikk?"
                : "Want help with this in your clinic?"}
            </p>
            <Magnetic className="mt-5">
              <Link
                href="/kontakt"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-accent-ink"
              >
                {ui.nav.bookCta[lang]}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </article>

      {/* Related */}
      <section className="border-t border-line py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="reveal-fade">
            <h2 className="font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              {lang === "no" ? "Flere fagartikler" : "More articles"}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} className="reveal-fade" delay={i * 100}>
                <Link href={`/fagartikler/${a.slug}`} className="group block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">
                    {a.category[lang]}
                  </span>
                  <h3 className="hairline mt-3 pt-3 font-display text-lg font-semibold leading-snug text-ink group-hover:text-accent-ink">
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
    </>
  );
}
