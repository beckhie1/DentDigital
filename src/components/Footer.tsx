"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";
import Logo from "@/components/Logo";
import Magnetic from "@/components/shell/Magnetic";
import { Reveal } from "@/components/motion/Reveal";

export default function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="dark-section bg-dark text-canvas">
      {/* Big CTA band */}
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
        <Reveal className="reveal-fade">
          <p className="section-num">→ {ui.nav.contact[lang]}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-3xl font-display text-[length:var(--text-display-lg)] font-semibold leading-[1.05]">
              {ui.footer.ctaLine[lang]}
            </h2>
            <Magnetic>
              <Link
                href="/kontakt"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-bright px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
              >
                {ui.nav.bookCta[lang]}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="hairline-dark grid gap-10 pt-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-canvas/50">
              {ui.footer.blurb[lang]}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/60">
              {ui.footer.quickLinks[lang]}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.home[lang]}</Link></li>
              <li><Link href="/tjenester" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.services[lang]}</Link></li>
              <li><Link href="/resultater" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.results[lang]}</Link></li>
              <li><Link href="/om-oss" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.about[lang]}</Link></li>
              <li><Link href="/fagartikler" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.articles[lang]}</Link></li>
              <li><Link href="/ai" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.ai[lang]}</Link></li>
              <li><Link href="/kontakt" className="link-sweep text-canvas/80 hover:text-canvas">{ui.nav.contact[lang]}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/60">
              {ui.footer.servicesCol[lang]}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.filter((s) => s.featured).map((s) => (
                <li key={s.slug}>
                  <Link href={`/tjenester/${s.slug}`} className="link-sweep text-canvas/80 hover:text-canvas">
                    {s.title[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/60">
              {ui.footer.contactCol[lang]}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-canvas/80">
              <li>DentDigital AS<br />{ui.footer.address[lang]}</li>
              <li>
                <a href="mailto:post@dentdigital.no" className="link-sweep hover:text-canvas">
                  post@dentdigital.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline-dark mt-12 flex flex-col items-center justify-between gap-4 pt-6 text-xs text-canvas/60 sm:flex-row">
          <p>© {year} DentDigital AS. {ui.footer.rights[lang]}</p>
          <div className="flex gap-5">
            <Link href="/personvern" className="link-sweep hover:text-canvas">{ui.footer.privacy[lang]}</Link>
            <Link href="/vilkar" className="link-sweep hover:text-canvas">{ui.footer.terms[lang]}</Link>
            <Link href="/cookies" className="link-sweep hover:text-canvas">{ui.footer.cookies[lang]}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
