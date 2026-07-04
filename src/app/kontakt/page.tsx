"use client";

import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import ContactForm from "@/components/ContactForm";
import { Reveal, RevealLines } from "@/components/motion/Reveal";

const heroLines = {
  no: ["La oss snakke om", "din klinikk."],
  en: ["Let's talk about", "your clinic."],
};

export default function ContactPage() {
  const { lang } = useLang();
  const t = ui.contact;

  const infoItems = [
    { num: "01", label: t.email[lang], value: <a href="mailto:post@dentdigital.no" className="link-sweep text-ink">post@dentdigital.no</a> },
    { num: "02", label: t.addressLabel[lang], value: <>DentDigital AS<br />Rødtvetveien 5, 0955 Oslo</> },
    { num: "03", label: t.hoursLabel[lang], value: t.hours[lang].split("\n").map((l) => <span key={l}>{l}<br /></span>) },
    { num: "04", label: lang === "no" ? "Dekning" : "Coverage", value: t.coverage[lang] },
  ];

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
        </div>
      </section>

      {/* Form + info */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <Reveal className="reveal-fade rounded-[--radius-card] border border-line bg-white p-8 lg:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink">{t.formTitle[lang]}</h2>
            <p className="mt-2 text-sm text-ink-60">{t.formSub[lang]}</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>

          <div>
            <Reveal className="reveal-fade">
              <h2 className="font-display text-2xl font-semibold text-ink">{t.infoTitle[lang]}</h2>
            </Reveal>
            <ul className="mt-8 space-y-7">
              {infoItems.map((item, i) => (
                <Reveal key={item.num} className="reveal-fade hairline pt-5" delay={i * 90}>
                  <li className="flex items-baseline gap-4">
                    <span className="section-num">{item.num}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-40">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-60">{item.value}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="dark-section bg-dark py-20 text-canvas lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="reveal-fade">
            <p className="section-num">FAQ</p>
            <h2 className="mt-3 font-display text-[length:var(--text-display-md)] font-semibold">
              {t.faqTitle[lang]}
            </h2>
            <p className="mt-4 text-canvas/60">{t.faqSub[lang]}</p>
          </Reveal>
          <div className="mt-10 space-y-4">
            {t.faq[lang].map((f, i) => (
              <Reveal key={f.q} className="reveal-fade" delay={i * 90}>
                <details className="group rounded-[--radius-card] border border-line-dark bg-dark-soft px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-display text-lg font-semibold">
                    <span className="flex items-baseline gap-4">
                      <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                      {f.q}
                    </span>
                    <span className="text-accent-bright transition-transform duration-300 group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 pl-10 text-sm leading-relaxed text-canvas/60">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
