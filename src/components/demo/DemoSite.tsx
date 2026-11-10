"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { DemoClinic } from "@/lib/demo-clinics";
import { Icon } from "./Icons";
import { Motif } from "./Motif";
import DemoLogo from "./DemoLogo";

/* ── helpers ─────────────────────────────────────────────── */

function fmtMin(m: number) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

function useOpenStatus(hours: DemoClinic["hours"]) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const row = hours.find((h) => h.days.includes(now.getDay()));
  if (!row || row.open == null || row.close == null) return { open: false, text: "Stengt nå" };
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = mins >= row.open && mins < row.close;
  return { open, text: open ? `Åpent nå til ${fmtMin(row.close)}` : "Stengt nå" };
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    // safety: never leave content hidden if the observer never fires
    const fallback = setTimeout(() => setShown(true), 1200);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);
  return (
    <div ref={ref} className={`${className} ${shown ? "reveal-in" : "reveal-pre"}`}>
      {children}
    </div>
  );
}

/* ── section shell ───────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-ink)]">
      <span className="h-px w-6 bg-[var(--brand)]" />
      {children}
    </span>
  );
}

/* ── main ────────────────────────────────────────────────── */

export default function DemoSite({ data }: { data: DemoClinic }) {
  const t = data.theme;
  const status = useOpenStatus(data.hours);
  const [menu, setMenu] = useState(false);
  const [wipe, setWipe] = useState(55);
  const [sent, setSent] = useState(false);

  const nav = [
    { href: "#behandlingar", label: "Behandlinger" },
    { href: "#regulering", label: "Usynlig regulering" },
    { href: "#klinikken", label: "Klinikken" },
    { href: "#prisar", label: "Priser" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  const rootStyle = {
    ["--brand" as string]: t.brand,
    ["--brand-dark" as string]: t.brandDark,
    ["--brand-ink" as string]: t.brandInk,
    ["--brand-soft" as string]: t.brandSoft,
    ["--wash" as string]: t.wash,
    ["--accent" as string]: t.accent,
    ["--on-brand" as string]: t.onBrand,
  } as React.CSSProperties;

  return (
    <div style={rootStyle} className="min-h-screen bg-white font-[var(--font-hanken)] text-slate-800 antialiased">
      <style>{`
        @keyframes contourDraw{from{stroke-dashoffset:1600}to{stroke-dashoffset:0}}
        .contour-draw{stroke-dasharray:1600;animation:contourDraw 2.4s cubic-bezier(.16,1,.3,1) forwards}
        .reveal-pre{opacity:0;transform:translateY(26px)}
        .reveal-in{animation:revealUp .85s cubic-bezier(.16,1,.3,1) both}
        @keyframes revealUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
        .demo-display{font-family:var(--font-fraunces),Georgia,serif;letter-spacing:-.02em}
        @media (prefers-reduced-motion:reduce){.contour-draw,.reveal-in{animation:none!important}.reveal-pre{opacity:1;transform:none}}
      `}</style>

      {/* utility bar */}
      <div className="bg-[var(--brand-dark)] text-[color:var(--on-brand)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[13px]">
          <span className="hidden sm:inline opacity-90">
            {data.group} · <span className="opacity-70">{data.region}</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href={data.sister.href} className="opacity-90 underline-offset-4 hover:underline">
              {data.sister.city}-klinikken
            </Link>
            <a href="#english" className="opacity-90 underline-offset-4 hover:underline">
              English
            </a>
            <a href={data.phoneHref} className="inline-flex items-center gap-1.5 font-semibold">
              <Icon name="phone" className="h-3.5 w-3.5" />
              {data.phone}
            </a>
          </div>
        </div>
      </div>

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <a href="#top" aria-label={data.name} className="flex items-center">
            <DemoLogo short={data.short} theme={t} motif={t.motif} variant="horizontal" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Hovudmeny">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-slate-600 transition hover:text-[color:var(--brand-ink)]">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {status && (
              <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">
                <span className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-500" : "bg-slate-300"}`} />
                {status.text}
              </span>
            )}
            <a
              href="#kontakt"
              className="hidden rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[color:var(--on-brand)] shadow-sm transition hover:bg-[var(--brand-dark)] sm:inline-block"
            >
              {data.bookLabel}
            </a>
            <button
              onClick={() => setMenu((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 lg:hidden"
              aria-label="Meny"
              aria-expanded={menu}
            >
              <span className="space-y-1.5">
                <span className={`block h-0.5 w-5 bg-slate-700 transition ${menu ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-slate-700 transition ${menu ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-slate-700 transition ${menu ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        {menu && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2" aria-label="Mobilmeny">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="border-b border-slate-100 py-3 text-sm font-medium text-slate-700 last:border-0">
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* hero */}
      <section id="top" className="relative overflow-hidden bg-[var(--wash)]">
        <div className="pointer-events-none absolute inset-0 text-[var(--brand)]">
          <Motif kind={t.motif} className="h-full w-full opacity-[0.22]" animate />
        </div>
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: t.brandSoft }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            {data.comingSoon && (
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--on-brand)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
                Åpner snart
              </span>
            )}
            <h1 className="demo-display text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
              {data.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{data.heroLede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#kontakt"
                className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[color:var(--on-brand)] shadow-md transition hover:bg-[var(--brand-dark)]"
              >
                {data.bookLabel}
              </a>
              <a
                href={data.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[var(--brand)] hover:text-[color:var(--brand-ink)]"
              >
                <Icon name="phone" className="h-4 w-4" />
                Ring {data.phone}
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {data.heroTrust.map((chip) => (
                <li key={chip} className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="check" className="h-4 w-4 text-[color:var(--brand-ink)]" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/60 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.heroImage.src}
                alt={data.heroImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 35%, ${t.brandDark}f0)` }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon name="pin" className="h-4 w-4" />
                  {data.address}
                </div>
                {status && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur">
                    <span className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-300" : "bg-white/50"}`} />
                    {status.text}
                  </div>
                )}
              </div>
            </div>
            {data.established && (
              <div className="absolute -left-4 top-8 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-lg">
                <div className="demo-display text-2xl font-semibold text-slate-900">{data.rating.value}</div>
                <div className="text-xs text-slate-500">{data.rating.count}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* differentiator strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {data.usps.map((u) => (
            <div key={u.title} className="bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-[color:var(--brand-ink)]">
                <Icon name={u.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{u.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* emergency / tannlegevakt banner */}
      <section className="bg-[var(--brand-dark)] text-[color:var(--on-brand)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
              <Icon name="emergency" className="h-6 w-6" />
            </span>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Akutt tannverk?</span>{" "}
              <span className="opacity-80">Vi har tannlegevakt og setter av tid samme dag.</span>
            </p>
          </div>
          <a href={data.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--brand-dark)]">
            <Icon name="phone" className="h-4 w-4" />
            Ring {data.phone}
          </a>
        </div>
      </section>

      {/* usynleg regulering spotlight */}
      <section id="regulering" className="bg-[var(--wash)]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Vår spesialitet</Eyebrow>
            <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Usynlig regulering</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Rett opp tennene diskré med gjennomsiktige skinner — uten synlig metall. Vi har egen tannlege
              med spesialisering i usynlig regulering, så du slipper å reise langt for spesialistkompetanse.
            </p>
            <ul className="mt-6 space-y-3">
              {["Gratis, uforpliktende vurdering", "Digital skanning — ingen ubehagelige avtrykk", "Tett oppfølging hele veien"].map((p) => (
                <li key={p} className="flex items-center gap-3 text-slate-700">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand)] text-[color:var(--on-brand)]">
                    <Icon name="check" className="h-4 w-4" stroke={2} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <a href="#kontakt" className="mt-8 inline-flex rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[color:var(--on-brand)] transition hover:bg-[var(--brand-dark)]">
              Bestill gratis vurdering
            </a>
          </Reveal>

          {/* before/after slider */}
          <Reveal>
            <figure className="select-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
                <div className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(135deg,#c9ccd1,#9aa0a8)` }}>
                  <span className="demo-display text-2xl font-semibold text-white/90">Etter</span>
                </div>
                <div className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(135deg,${t.brand},${t.brandDark})`, clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
                  <span className="demo-display text-2xl font-semibold text-white/90">Før</span>
                </div>
                <div className="pointer-events-none absolute inset-y-0" style={{ left: `${wipe}%` }}>
                  <div className="absolute inset-y-0 -ml-px w-0.5 bg-white" />
                  <div className="absolute top-1/2 -ml-4 -translate-y-1/2 rounded-full bg-white p-1.5 shadow">
                    <Icon name="route" className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
                <input
                  aria-label="Dra for å sammenligne før og etter"
                  type="range"
                  min={5}
                  max={95}
                  value={wipe}
                  onChange={(e) => setWipe(Number(e.target.value))}
                  className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm text-slate-500">Dra for å sammenligne — illustrasjon</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* behandlingar */}
      <section id="behandlingar" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <Eyebrow>Behandlinger</Eyebrow>
            <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Hva kan vi hjelpe deg med?</h2>
            <p className="mt-4 text-lg text-slate-600">
              Fra rutinekontroll til avanserte behandlinger — alt under samme tak, med moderne utstyr og erfarne tannleger.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.services.map((s) => (
              <Reveal key={s.title}>
                <article
                  className={`group h-full rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                    s.featured ? "border-[var(--brand)]/30 bg-[var(--brand-soft)]" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-xl ${s.featured ? "bg-[var(--brand)] text-[color:var(--on-brand)]" : "bg-slate-100 text-[color:var(--brand-ink)]"}`}>
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    {s.title}
                    {s.featured && <span className="rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--brand-ink)]">Spesialitet</span>}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="bg-[var(--brand-dark)] text-[color:var(--on-brand)]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Slik jobber vi</span>
            <h2 className="demo-display mt-3 text-3xl font-semibold sm:text-4xl">Fra første kontakt til ferdig behandling</h2>
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {data.process.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="demo-display text-3xl font-semibold text-[var(--accent)]">{(i + 1).toString().padStart(2, "0")}</div>
                <div className="mt-3 h-px w-full bg-white/15" />
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* klinikken: team + technology */}
      <section id="klinikken" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Eyebrow>Klinikken</Eyebrow>
              <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Kompetanse du kan stole på</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{data.teamNote}</p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.aboutImage.src} alt={data.aboutImage.alt} className="h-56 w-full object-cover" />
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {data.technology.map((tech) => (
                  <div key={tech.title} className="rounded-2xl border border-slate-200 p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--brand-soft)] text-[color:var(--brand-ink)]">
                      <Icon name={tech.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-slate-900">{tech.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {data.team.map((m) => (
                <Reveal key={m.role + m.initials}>
                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-[var(--wash)] p-6">
                    <span
                      className="demo-display grid h-16 w-16 place-items-center rounded-full text-xl font-semibold text-[color:var(--on-brand)]"
                      style={{ background: `linear-gradient(140deg, ${t.brand}, ${t.brandDark})` }}
                    >
                      {m.initials}
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">{m.role}</h3>
                    <p className="mt-1 text-sm text-slate-500">{m.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* prisar + tilbod + finansiering */}
      <section id="prisar" className="bg-[var(--wash)]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <Eyebrow>Priser og tilbud</Eyebrow>
            <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Tydelige priser, ingen overraskelser</h2>
            <p className="mt-4 text-lg text-slate-600">Du får alltid et prisoverslag før behandlingen starter. Vi har direkteoppgjør med Helfo.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.offers.map((o) => (
              <div key={o.title} className={`flex h-full flex-col rounded-2xl border p-6 ${o.highlight ? "border-[var(--brand)] bg-white shadow-md" : "border-slate-200 bg-white"}`}>
                <h3 className="text-sm font-semibold text-slate-900">{o.title}</h3>
                <div className="demo-display mt-3 text-3xl font-semibold text-[color:var(--brand-ink)]">{o.price}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{o.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-[color:var(--brand-ink)]">
                  <Icon name="wallet" className="h-6 w-6" />
                </span>
                <h3 className="demo-display text-2xl font-semibold text-slate-900">{data.financing.title}</h3>
              </div>
              <p className="mt-4 text-slate-600">{data.financing.body}</p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {data.financing.points.map((p) => (
                  <li key={p} className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <Icon name="check" className="h-4 w-4 text-[color:var(--brand-ink)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between rounded-3xl border border-[var(--brand)]/25 bg-[var(--brand-soft)] p-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[color:var(--brand-ink)]">
                    <Icon name="gift" className="h-6 w-6" />
                  </span>
                  <h3 className="demo-display text-2xl font-semibold text-slate-900">{data.gavekort.title}</h3>
                </div>
                <p className="mt-4 text-slate-600">{data.gavekort.body}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="demo-display text-3xl font-semibold text-[color:var(--brand-ink)]">{data.gavekort.amount}</span>
                <a href="#kontakt" className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-[color:var(--on-brand)] transition hover:bg-[var(--brand-dark)]">
                  {data.gavekort.cta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Pasientene våre</Eyebrow>
              <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Det pasientene sier</h2>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-5 py-3">
              <div className="demo-display text-3xl font-semibold text-slate-900">{data.rating.value}</div>
              <div>
                <div className="flex text-[var(--accent)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="h-4 w-4" stroke={0} />
                  ))}
                </div>
                <div className="text-xs text-slate-500">{data.rating.count}</div>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {data.reviews.map((r) => (
              <Reveal key={r.name}>
                <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-[var(--wash)] p-6">
                  <div className="flex text-[var(--accent)]">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Icon key={i} name="star" className="h-4 w-4" stroke={0} />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-slate-700">“{r.text}”</blockquote>
                  <figcaption className="mt-5 border-t border-slate-200 pt-4">
                    <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.meta}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* tourist / english */}
      <section id="english" className="relative overflow-hidden bg-[var(--brand-dark)] text-[color:var(--on-brand)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.touristImage.src} alt={data.touristImage.alt} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${t.brandDark}f7, ${t.brandDark}cc)` }} />
        <div className="pointer-events-none absolute inset-0 text-white/10">
          <Motif kind={t.motif} className="h-full w-full" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{data.tourist.eyebrow}</span>
            <h2 className="demo-display mt-3 text-3xl font-semibold sm:text-4xl">{data.tourist.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">{data.tourist.body}</p>
          </div>
          <a href="#kontakt" className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[color:var(--brand-dark)]">
            {data.tourist.cta}
          </a>
        </div>
      </section>

      {/* faq */}
      <section className="bg-[var(--wash)]">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <div className="text-center">
            <Eyebrow>Spørsmål og svar</Eyebrow>
            <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Ofte stilte spørsmål</h2>
          </div>
          <div className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {data.faqs.map((f) => (
              <details key={f.q} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-base font-medium text-slate-900">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* kontakt */}
      <section id="kontakt" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <Eyebrow>Kontakt</Eyebrow>
            <h2 className="demo-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">{data.bookLabel}</h2>
            <p className="mt-4 text-lg text-slate-600">{data.bookLead}</p>

            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Icon name="pin" className="mt-0.5 h-5 w-5 text-[color:var(--brand-ink)]" />
                <div>
                  <dt className="font-semibold text-slate-900">Adresse</dt>
                  <dd className="text-slate-600">{data.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="phone" className="mt-0.5 h-5 w-5 text-[color:var(--brand-ink)]" />
                <div>
                  <dt className="font-semibold text-slate-900">Telefon</dt>
                  <dd><a href={data.phoneHref} className="text-slate-600 underline-offset-2 hover:underline">{data.phone}</a></dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="calendar" className="mt-0.5 h-5 w-5 text-[color:var(--brand-ink)]" />
                <div>
                  <dt className="font-semibold text-slate-900">Åpningstider</dt>
                  <dd className="text-slate-600">
                    <ul className="space-y-0.5">
                      {data.hours.map((h) => (
                        <li key={h.day} className="flex justify-between gap-6">
                          <span>{h.day}</span>
                          <span className="tabular-nums">{h.time}</span>
                        </li>
                      ))}
                    </ul>
                    {data.hoursNote && <p className="mt-2 text-xs text-slate-400">{data.hoursNote}</p>}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                title={`Kart — ${data.name}`}
                className="h-56 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(data.mapQuery)}&output=embed`}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[var(--wash)] p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand)] text-[color:var(--on-brand)]">
                  <Icon name="check" className="h-7 w-7" stroke={2} />
                </span>
                <h3 className="demo-display mt-5 text-2xl font-semibold text-slate-900">Takk!</h3>
                <p className="mt-2 max-w-xs text-slate-600">Vi har mottatt forespørselen din og tar kontakt så snart som mulig.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Navn" name="navn" />
                  <Field label="Telefon" name="telefon" type="tel" />
                </div>
                <Field label="E-post" name="epost" type="email" />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Hva gjelder det?</span>
                  <textarea
                    name="melding"
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                    placeholder="Skriv gjerne hva du ønsker hjelp med…"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[color:var(--on-brand)] shadow-sm transition hover:bg-[var(--brand-dark)]"
                >
                  {data.bookLabel}
                </button>
                <p className="text-center text-xs text-slate-400">
                  Demo-skjema — sender ikke inn data.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-[var(--brand-dark)] text-[color:var(--on-brand)]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <DemoLogo short={data.short} theme={t} motif={t.motif} variant="horizontal" onDark />
              <p className="mt-4 max-w-sm text-sm text-white/60">{data.intro}</p>
              <div className="mt-5 flex gap-3">
                {data.social.facebook && (
                  <a href={data.social.facebook} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                )}
                {data.social.instagram && (
                  <a href={data.social.instagram} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Kontakt</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>{data.address}</li>
                <li><a href={data.phoneHref} className="hover:underline">{data.phone}</a></li>
                <li><a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{data.group}</h3>
              <Link href={data.sister.href} className="mt-4 block rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:bg-white/10">
                <div className="text-sm font-semibold">{data.sister.name}</div>
                <div className="text-xs text-white/60">{data.sister.city}</div>
                <p className="mt-2 text-xs text-white/60">{data.sister.blurb}</p>
                <span className="mt-3 inline-block text-xs font-semibold text-[var(--accent)]">Se klinikken →</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
            <span>© {new Date().getFullYear()} {data.name} · Direkteoppgjør med Helfo</span>
            <span>Demo · levert av DentDigital</span>
          </div>
        </div>
      </footer>

      {/* sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-3 px-4 py-3">
          <a href={data.phoneHref} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 py-2.5 text-sm font-semibold text-slate-700">
            <Icon name="phone" className="h-4 w-4" />
            Ring
          </a>
          <a href="#kontakt" className="flex flex-1 items-center justify-center rounded-full bg-[var(--brand)] py-2.5 text-sm font-semibold text-[color:var(--on-brand)]">
            {data.bookLabel}
          </a>
        </div>
      </div>

      {/* ownership badge */}
      <a
        href="https://www.dentdigital.no"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 z-40 hidden rounded-full bg-slate-900/85 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg backdrop-blur hover:bg-slate-900 lg:block"
      >
        Demo · DentDigital
      </a>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        name={name}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
      />
    </label>
  );
}
