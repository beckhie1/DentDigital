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
      <div className="mx-auto w-full max-w-lg">
        {/* Clinic identity */}
        <div className="mb-5 text-center">
          {clinic.branding?.logo && (
            <Image
              src={clinic.branding.logo}
              alt={clinic.name}
              width={64}
              height={64}
              className="mx-auto mb-2 h-14 w-14 rounded-xl sm:h-16 sm:w-16"
            />
          )}
          <h2 className="font-display text-lg font-semibold tracking-tight">{clinic.name}</h2>
          <p className="text-xs uppercase tracking-widest text-ink-40">{clinic.address}</p>
          {clinic.rating && (
            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm">
              <span aria-hidden className="tracking-tight text-[#f5b301]">★★★★★</span>
              <span className="font-semibold">{clinic.rating.value} av 5</span>
              <span className="text-ink-40">· {clinic.rating.count} Google-anmeldelser</span>
            </p>
          )}
        </div>

        {/* Offer card */}
        <div className="mb-4 overflow-hidden rounded-card border border-line bg-white shadow-lg">
          <div
            className="px-5 py-4 text-center text-white"
            style={{ background: "linear-gradient(to right, var(--l-dark), var(--l-dark-to))" }}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--l-glow)]">
              ✦ Kampanje ✦
            </p>
            <p className="text-sm text-white/80">{offer.title}</p>
          </div>

          <div className="px-5 pb-4 pt-5 text-center">
            <div className="mb-1 flex items-center justify-center gap-3">
              <span className="text-lg text-ink-40 line-through">
                {offer.oldPrice.toLocaleString("nb-NO")} kr
              </span>
              <span className="rounded-full bg-[color-mix(in_srgb,var(--l-cta)_15%,transparent)] px-2 py-0.5 text-xs font-bold text-[var(--l-accent-ink)]">
                SPAR {save}%
              </span>
            </div>
            <p className="font-display text-5xl font-bold text-ink">
              {offer.price.toLocaleString("nb-NO")}{" "}
              <span className="text-xl font-normal text-ink-60">kr</span>
            </p>
          </div>

          <div className="px-5 pb-5">
            <ul className="space-y-2">
              {offer.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-60">
                  <span className="mt-0.5 shrink-0 text-[var(--l-accent-ink)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-card border border-line bg-white p-5 shadow-lg sm:p-7">
          <h1 className="font-display mb-1 text-xl font-semibold sm:text-2xl">Bestill din time</h1>
          <p className="mb-5 text-sm leading-relaxed text-ink-60">
            Fyll ut skjemaet, så kontakter klinikken deg for å bekrefte timen.
          </p>
          <LeadForm clinicSlug={clinic.slug} kilde="tilbud" />
        </div>

        {/* Contact strip */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-40">
          <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="hover:text-ink">
            ☎ {clinic.phone}
          </a>
          <span>·</span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            📍 {clinic.address}
          </a>
        </div>
      </div>
    </LandingShell>
  );
}
