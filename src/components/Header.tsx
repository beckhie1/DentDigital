"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/lib/content";
import Logo from "@/components/Logo";
import Magnetic from "@/components/shell/Magnetic";

const links = [
  { href: "/tjenester", key: "services" },
  { href: "/resultater", key: "results" },
  { href: "/om-oss", key: "about" },
  { href: "/fagartikler", key: "articles" },
  { href: "/ai", key: "ai" },
  { href: "/kontakt", key: "contact" },
] as const;

export default function Header() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled && !open
          ? "border-b border-line bg-canvas/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="DentDigital" className="relative z-[60]">
          <Logo dark={open} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`link-sweep text-sm font-medium transition-colors ${
                pathname.startsWith(l.href) ? "text-accent-ink" : "text-ink"
              }`}
            >
              {ui.nav[l.key][lang]}
            </Link>
          ))}
        </nav>

        <div className="relative z-[60] flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "no" ? "en" : "no")}
            className={`text-xs font-semibold tracking-wider transition-colors ${
              open ? "text-canvas/70 hover:text-canvas" : "text-ink-60 hover:text-ink"
            }`}
            aria-label={lang === "no" ? "Switch to English" : "Bytt til norsk"}
          >
            {lang === "no" ? "EN" : "NO"}
          </button>
          <Magnetic className="hidden sm:block">
            <Link
              href="/kontakt"
              className={`inline-block rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                open
                  ? "bg-canvas text-ink hover:bg-accent-bright"
                  : "bg-ink text-canvas hover:bg-accent-ink"
              }`}
            >
              {ui.nav.bookCta[lang]}
            </Link>
          </Magnetic>
          <button
            onClick={() => setOpen(!open)}
            className={`flex h-10 w-10 items-center justify-center lg:hidden ${
              open ? "text-canvas" : "text-ink"
            }`}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {open ? (
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div
        className={`dark-section fixed inset-0 z-50 flex flex-col justify-center bg-dark px-8 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="space-y-2">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-baseline gap-4 py-2"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-4xl font-semibold text-canvas transition-colors group-hover:text-accent-bright">
                {ui.nav[l.key][lang]}
              </span>
            </Link>
          ))}
        </nav>
        <p className="hairline-dark mt-10 pt-6 text-sm text-canvas/50">
          post@dentdigital.no · Rødtvetveien 5, 0955 Oslo
        </p>
      </div>
    </header>
  );
}
