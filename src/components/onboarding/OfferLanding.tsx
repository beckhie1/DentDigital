import Image from "next/image";
import type { Clinic } from "@/lib/clinics";
import LandingShell from "./LandingShell";
import LeadForm from "./LeadForm";

/** Ads landing page: dentdigital.no/{slug}-tilbud — mirrors gdts.no/tilbud. */
export default function OfferLanding({ clinic }: { clinic: Clinic }) {
  const { offer } = clinic;
  const save = Math.round((1 - offer.price / offer.oldPrice) * 100);
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
        {/* Clinic identity — one compact row */}
        <div className="mb-3 flex items-center gap-3">
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

        {/* Offer card — title + price side by side */}
        <div className="mb-3 overflow-hidden rounded-card border border-[color-mix(in_srgb,var(--l-cta)_40%,transparent)] bg-white shadow-lg shadow-[color-mix(in_srgb,var(--l-dark)_12%,transparent)]">
          <div
            className="flex items-center justify-between gap-3 px-4 py-3.5 text-white"
            style={{ background: "linear-gradient(135deg, var(--l-dark), var(--l-dark-to))" }}
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--l-glow)]">
                ✦ Høsttilbud ✦
              </p>
              <p className="font-display mt-0.5 text-[15px] font-semibold leading-snug text-balance sm:text-lg">
                {offer.title}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-white/50 line-through">
                {offer.oldPrice.toLocaleString("nb-NO")} kr
              </p>
              <p className="font-display text-3xl font-bold leading-none text-[var(--l-glow)]">
                {offer.price.toLocaleString("nb-NO")}
                <span className="ml-0.5 text-sm font-normal text-white/80">kr</span>
              </p>
              <p className="mt-1 inline-block rounded-full bg-[var(--l-cta)] px-1.5 py-px text-[10px] font-bold text-[var(--l-on-cta)]">
                SPAR {save}%
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-x-3 gap-y-1.5 px-4 py-3 sm:grid-cols-2">
            {offer.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-ink">
                <span
                  aria-hidden
                  className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--l-cta)_22%,transparent)] text-[9px] font-bold text-[var(--l-accent-ink)]"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form card */}
        <div className="relative overflow-hidden rounded-card border border-line bg-white p-4 pt-5 shadow-xl shadow-[color-mix(in_srgb,var(--l-dark)_10%,transparent)] sm:p-7 sm:pt-8">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: "linear-gradient(to right, var(--l-dark), var(--l-cta), var(--l-dark))" }}
          />
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h1 className="font-display text-lg font-semibold sm:text-2xl">Bestill din time</h1>
            <p className="text-[11px] font-medium text-[var(--l-accent-ink)]">Begrenset antall plasser</p>
          </div>
          <LeadForm clinicSlug={clinic.slug} kilde="tilbud" />
        </div>

        {/* Contact strip */}
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
