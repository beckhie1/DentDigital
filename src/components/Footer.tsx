"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import { services } from "@/lib/services";
import Logo from "@/components/Logo";

export default function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {ui.footer.blurb[lang]}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {ui.footer.quickLinks[lang]}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-teal-400">{ui.nav.home[lang]}</Link></li>
              <li><Link href="/tjenester" className="hover:text-teal-400">{ui.nav.services[lang]}</Link></li>
              <li><Link href="/om-oss" className="hover:text-teal-400">{ui.nav.about[lang]}</Link></li>
              <li><Link href="/fagartikler" className="hover:text-teal-400">{ui.nav.articles[lang]}</Link></li>
              <li><Link href="/ai" className="hover:text-teal-400">{ui.nav.ai[lang]}</Link></li>
              <li><Link href="/kontakt" className="hover:text-teal-400">{ui.nav.contact[lang]}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {ui.footer.servicesCol[lang]}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/tjenester/${s.slug}`} className="hover:text-teal-400">
                    {s.title[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {ui.footer.contactCol[lang]}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>DentDigital AS<br />{ui.footer.address[lang]}</li>
              <li>
                <a href="mailto:post@dentdigital.no" className="hover:text-teal-400">
                  post@dentdigital.no
                </a>
              </li>
              <li>
                <a href="https://www.dentdigital.no" className="hover:text-teal-400">
                  www.dentdigital.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} DentDigital AS. {ui.footer.rights[lang]}</p>
          <div className="flex gap-4">
            <Link href="/kontakt" className="hover:text-teal-400">{ui.footer.privacy[lang]}</Link>
            <Link href="/kontakt" className="hover:text-teal-400">{ui.footer.terms[lang]}</Link>
            <Link href="/kontakt" className="hover:text-teal-400">{ui.footer.cookies[lang]}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
