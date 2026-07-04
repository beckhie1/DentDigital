"use client";

import { useLang } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";
import { Reveal } from "@/components/motion/Reveal";

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { lang } = useLang();

  return (
    <article className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="reveal-fade">
          <p className="section-num">
            {lang === "no" ? "Sist oppdatert" : "Last updated"}:{" "}
            {new Date(doc.updated).toLocaleDateString(lang === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="mt-4 font-display text-[length:var(--text-display-md)] font-semibold leading-[1.1] text-ink lg:text-[length:var(--text-display-lg)]">
            {doc.title[lang]}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-60">{doc.intro[lang]}</p>
        </Reveal>

        <div className="mt-14 space-y-12">
          {doc.sections.map((s, i) => (
            <Reveal key={s.heading.no} as="section" className="reveal-fade">
              <div className="flex items-baseline gap-4">
                <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-xl font-semibold text-ink">{s.heading[lang]}</h2>
              </div>
              <div className="hairline mt-4 space-y-4 pt-4">
                {s.paragraphs[lang].map((p) => (
                  <p key={p.slice(0, 32)} className="leading-relaxed text-ink-60">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="reveal-fade hairline mt-14 pt-6 text-sm text-ink-60">
          DentDigital AS · Rødtvetveien 5, 0955 Oslo ·{" "}
          <a href="mailto:post@dentdigital.no" className="link-sweep font-medium text-ink">
            post@dentdigital.no
          </a>
        </Reveal>
      </div>
    </article>
  );
}
