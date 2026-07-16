import type { Clinic } from "@/lib/clinics";
import LandingShell from "./LandingShell";
import LeadForm from "./LeadForm";

/** Google Ads landing page for emergency dental: dentdigital.no/{slug}-tannlegevakt. */
export default function VaktLanding({ clinic }: { clinic: Clinic }) {
  const phone = clinic.vaktPhone ?? clinic.phone;
  const tel = `tel:${phone.replace(/\s/g, "")}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;

  return (
    <LandingShell>
      <div className="mx-auto w-full max-w-lg">
        {/* Clinic identity */}
        <div className="mb-5 text-center">
          <h2 className="font-display text-lg font-semibold tracking-tight">{clinic.name}</h2>
          <p className="text-xs uppercase tracking-widest text-ink-40">Tannlegevakt</p>
        </div>

        {/* Emergency card */}
        <div className="mb-4 overflow-hidden rounded-card border border-line bg-white shadow-lg">
          <div className="bg-dark px-5 py-5 text-center text-canvas">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent-bright">
              Akutt tannlegehjelp
            </p>
            <h1 className="font-display text-2xl font-semibold">Vondt i tannen? Få hjelp raskt.</h1>
          </div>

          <div className="px-5 py-6 text-center">
            <p className="mb-4 text-sm leading-relaxed text-ink-60">
              Ring oss nå – vi prioriterer akutte tilfeller og gir deg time så raskt som mulig.
            </p>
            <a
              href={tel}
              className="block w-full rounded-xl bg-accent py-4 text-lg font-bold text-ink transition-all hover:bg-accent-bright active:scale-[0.98]"
            >
              ☎ Ring {phone}
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-ink-40 underline hover:text-ink"
            >
              📍 {clinic.address}
            </a>
          </div>

          <ul className="space-y-2 border-t border-line px-5 py-5">
            {[
              "Akutt tannverk, skader og hevelser",
              "Rask vurdering og smertelindring",
              "Erfarne tannleger",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink-60">
                <span className="mt-0.5 shrink-0 text-accent-ink">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Fallback form */}
        <div className="rounded-card border border-line bg-white p-5 shadow-lg sm:p-7">
          <h2 className="font-display mb-1 text-xl font-semibold">Ikke akutt? Bestill time</h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-60">
            Fyll ut skjemaet, så ringer klinikken deg tilbake.
          </p>
          <LeadForm clinicSlug={clinic.slug} kilde="tannlegevakt" />
        </div>
      </div>
    </LandingShell>
  );
}
