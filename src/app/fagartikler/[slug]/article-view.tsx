"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { articles, getArticle } from "@/lib/articles";

export default function ArticleView({ slug }: { slug: string }) {
  const { lang } = useLang();
  const article = getArticle(slug)!;
  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <article className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/fagartikler" className="text-sm font-semibold text-teal-700 hover:underline">
            ← {ui.articlesPage.backToArticles[lang]}
          </Link>
          <div className="mt-6 flex items-center gap-3 text-sm">
            <span className="rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-700">
              {article.category[lang]}
            </span>
            <time className="text-slate-500" dateTime={article.date}>
              {new Date(article.date).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {article.title[lang]}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{article.excerpt[lang]}</p>
          <div className="relative mt-8 h-72 overflow-hidden rounded-2xl sm:h-96">
            <Image
              src={article.image}
              alt={article.title[lang]}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-10 space-y-8">
            {article.body[lang].map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{s.text}</p>
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            {lang === "no" ? "Flere fagartikler" : "More articles"}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <Link key={a.slug} href={`/fagartikler/${a.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="text-xs font-semibold text-teal-700">{a.category[lang]}</span>
                <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-teal-700">
                  {a.title[lang]}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{a.excerpt[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-teal-700 to-cyan-800 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">{ui.home.ctaTitle[lang]}</h2>
          <p className="mt-4 text-teal-100">{ui.home.ctaSub[lang]}</p>
          <Link href="/kontakt" className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-800 shadow-md transition-transform hover:scale-105">
            {ui.nav.contactCta[lang]}
          </Link>
        </div>
      </section>
    </>
  );
}
