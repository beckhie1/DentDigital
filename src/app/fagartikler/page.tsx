"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { articles } from "@/lib/articles";

export default function ArticlesPage() {
  const { lang } = useLang();
  const t = ui.articlesPage;
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category[lang]))],
    [lang]
  );
  const sorted = useMemo(
    () =>
      [...articles]
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter((a) => !category || a.category[lang] === category),
    [category, lang]
  );

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
            {t.kicker[lang]}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t.title[lang]}
          </h1>
          <p className="mt-5 text-lg text-slate-600">{t.sub[lang]}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === null
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700"
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
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((a) => (
              <Link
                key={a.slug}
                href={`/fagartikler/${a.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={a.image}
                    alt={a.title[lang]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-700 backdrop-blur">
                    {a.category[lang]}
                  </span>
                </div>
                <div className="p-6">
                  <time className="text-xs text-slate-500" dateTime={a.date}>
                    {new Date(a.date).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                  <h2 className="mt-2 font-semibold text-slate-900 group-hover:text-teal-700">
                    {a.title[lang]}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{a.excerpt[lang]}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
                    {ui.common.readMore[lang]}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">{t.newsletterTitle[lang]}</h2>
          <p className="mt-3 text-slate-600">{t.newsletterSub[lang]}</p>
          <form
            className="mx-auto mt-6 flex max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder={ui.contact.email[lang]}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <button className="shrink-0 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700">
              {t.subscribe[lang]}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
