import Image from "next/image";
import type { Clinic } from "@/lib/clinics";
import LandingShell from "./LandingShell";
import LeadForm from "./LeadForm";

/** Ads landing page: dentdigital.no/{slug}-invisalign — free Invisalign consultation. */
export default function InvisalignLanding({ clinic }: { clinic: Clinic }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;

  return (
    <LandingShell clinic={clinic}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, var(--l-cta) 28%, transparent), transparent 75%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-lg pb-10">
        <div className="mb-4 flex items-center gap-3">
          {clinic.branding?.logo && (
            <Image
              src={clinic.branding.logo}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-xl shadow-md ring-2 ring-white"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-display truncate text-base font-semibold leading-tight tracking-tight">
              {clinic.name}
            </h2>
            {clinic.rating && (
              <p className="mt-0.5 flex items-center gap-1 text-xs">
                <span aria-hidden className="tracking-tight text-[#f5b301]">★★★★★</span>
                <span className="font-semibold">{clinic.rating.value}</span>
                <span className="text-ink-40">· {clinic.rating.count} Google-anmeldelser</span>
              </p>
            )}
          </div>
        </div>

        {/* Hero */}
        <div
          className="mb-3 overflow-hidden rounded-card px-5 py-6 text-center text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--l-dark), var(--l-dark-to))" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--l-glow)]">Invisalign</p>
          <h1 className="font-display mt-1 text-2xl font-semibold leading-tight text-balance sm:text-3xl">
            Gratis Invisalign-konsultasjon
          </h1>
          <p className="mt-3 inline-block rounded-full bg-[var(--l-cta)] px-3 py-1 text-sm font-bold text-[var(--l-on-cta)]">
            0 kr · uforpliktende
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-snug text-white/80">
            Nesten usynlige skinner, ingen brakketter. Vi forteller hva som er mulig for deg.
          </p>
        </div>

        {/* Form card */}
        <div className="relative overflow-hidden rounded-card border border-line bg-white p-4 pt-5 shadow-xl shadow-[color-mix(in_srgb,var(--l-dark)_10%,transparent)] sm:p-7 sm:pt-8">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: "linear-gradient(to right, var(--l-dark), var(--l-cta), var(--l-dark))" }}
          />
          <h2 className="font-display mb-3 text-lg font-semibold sm:text-2xl">Bestill gratis konsultasjon</h2>
          <LeadForm clinicSlug={clinic.slug} kilde="invisalign" />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-60">
          <a
            href={`tel:${clinic.phone.replace(/\s/g, "")}`}
            className="rounded-full border border-line bg-white px-3.5 py-2 shadow-sm transition-colors hover:border-ink hover:text-ink"
          >
            ☎ {clinic.phone}
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line bg-white px-3.5 py-2 shadow-sm transition-colors hover:border-ink hover:text-ink"
          >
            📍 {clinic.address}
          </a>
        </div>
      </div>
    </LandingShell>
  );
}
