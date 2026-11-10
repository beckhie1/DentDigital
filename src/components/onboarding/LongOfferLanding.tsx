import Image from "next/image";
import type { Clinic } from "@/lib/clinics";
import LandingShell from "./LandingShell";
import LeadForm from "./LeadForm";
import OfferMonth from "./OfferMonth";

/**
 * Long-form ads landing page: dentdigital.no/{slug}-tilbud-ny.
 * Same lead form and tracking as /{slug}-tilbud, laid out like the old agency page
 * (tannskjema.no): monthly offer + value anchor, what's included, location, trust, FAQ,
 * repeated "book" buttons that jump to the form.
 */
export default function LongOfferLanding({ clinic }: { clinic: Clinic }) {
  const { offer, longOffer } = clinic;
  const saving = offer.oldPrice - offer.price;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;
  const kr = (n: number) => `${n.toLocaleString("nb-NO")} kr`;

  const details = [
    { title: "Grundig undersøkelse", text: "Tannlegen sjekker tenner og tannkjøtt for hull, slitasje og tannkjøttsykdom." },
    { title: "Røntgenbilder", text: "Røntgen viser det som ikke synes med øyet, så du får full oversikt over tannhelsen." },
    { title: "Personlig behandlingsplan", text: "Du får vite hva som eventuelt bør gjøres og hva det koster, før noe settes i gang." },
  ];
  const faq = [
    {
      q: "Gjelder tilbudet bare nye pasienter?",
      a: "Ja. Tilbudet er for deg som ikke har vært pasient hos oss før, så du kan bli kjent med klinikken til en lav, fast pris.",
    },
    {
      q: "Hva om jeg trenger mer behandling?",
      a: "Tannlegen går gjennom funnene med deg. Behandling utover tilbudet prises separat, og du får alltid et kostnadsoverslag før vi starter.",
    },
    {
      q: "Kan jeg flytte eller avbestille timen?",
      a: "Ja. Gi beskjed senest 24 timer før, på telefon eller e-post, så kan vi gi timen til noen andre.",
    },
    {
      q: "Hvor lang tid tar besøket?",
      a: "Regn med 30–45 minutter. Da rekker vi undersøkelse, røntgen, rens og tid til spørsmålene dine.",
    },
  ];

  const BookButton = ({ label = `Ja, book time til ${offer.price} kr` }: { label?: string }) => (
    <a
      href="#bestill"
      className="block w-full rounded-xl bg-[var(--l-cta)] py-3.5 text-center text-base font-semibold text-[var(--l-on-cta)] shadow-md transition-all hover:bg-[var(--l-cta-hover)] active:scale-[0.98]"
    >
      {label}
    </a>
  );

  const card = "rounded-card border border-line bg-white p-5 shadow-sm sm:p-7";
  const eyebrow = "text-[11px] font-semibold uppercase tracking-widest text-[var(--l-accent-ink)]";

  return (
    <LandingShell clinic={clinic}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, var(--l-cta) 28%, transparent), transparent 75%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-lg space-y-4 pb-28 sm:pb-12">
        {/* Clinic identity */}
        <div className="flex items-center gap-3">
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
            <p className="font-display truncate text-base font-semibold leading-tight tracking-tight">{clinic.name}</p>
            {clinic.rating && (
              <p className="mt-0.5 flex items-center gap-1 text-xs">
                <span aria-hidden className="tracking-tight text-[#f5b301]">★★★★★</span>
                <span className="font-semibold">{clinic.rating.value}</span>
                <span className="text-ink-40">· {clinic.rating.count} Google-anmeldelser</span>
              </p>
            )}
          </div>
        </div>

        {/* Hero: monthly offer + value anchor */}
        <section
          className="overflow-hidden rounded-card px-5 py-6 text-white shadow-lg sm:px-8 sm:py-8"
          style={{ background: "linear-gradient(135deg, var(--l-dark), var(--l-dark-to))" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--l-glow)]">
            ⭐ <OfferMonth offer /> til nye pasienter i Groruddalen ⭐
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold leading-tight text-balance sm:text-3xl">
            Tannlegeundersøkelse med røntgen og Airflow-rens
          </h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="font-display text-5xl font-bold leading-none text-[var(--l-glow)]">
              {offer.price.toLocaleString("nb-NO")}
              <span className="ml-1 text-lg font-normal text-white/80">kr</span>
            </p>
            <div className="pb-1">
              <p className="text-sm text-white/50 line-through">{kr(offer.oldPrice)}</p>
              <p className="rounded-full bg-[var(--l-cta)] px-2 py-0.5 text-xs font-bold text-[var(--l-on-cta)]">
                Spar {kr(saving)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Nå i <OfferMonth /> kan nye pasienter prøve oss til fast lavpris: en grundig sjekk, full oversikt
            over tannhelsen og rene, glatte tenner. Tilbudet gjelder så lenge det er ledige timer.
          </p>
          <div className="mt-5">
            <BookButton />
            <p className="mt-2 text-center text-xs text-white/60">Det tar under ett minutt</p>
          </div>
        </section>

        {/* What's included */}
        <section className={card}>
          <p className={eyebrow}>Dette er inkludert</p>
          <h2 className="font-display mt-1 text-xl font-semibold sm:text-2xl">Alt du trenger i ett besøk</h2>
          <ul className="mt-4 space-y-4">
            {details.map((d) => (
              <li key={d.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--l-cta)_22%,transparent)] text-xs font-bold text-[var(--l-accent-ink)]"
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold">{d.title}</p>
                  <p className="text-sm leading-snug text-ink-60">{d.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--l-cta)_45%,transparent)] bg-[color-mix(in_srgb,var(--l-cta)_10%,transparent)] p-4">
            <p className="font-semibold">🎁 Bonus: Airflow-rens</p>
            <p className="mt-1 text-sm leading-snug text-ink-60">
              Airflow renser med salt, luft og vann og fjerner misfarging fra kaffe, te og tobakk på en skånsom måte.
              Tennene blir rene og glatte. Den er med i prisen.
            </p>
          </div>
          <div className="mt-5">
            <BookButton label="Ja, book min time nå" />
          </div>
        </section>

        {/* Location */}
        {longOffer && (
          <section className={card}>
            <p className={eyebrow}>Her finner du oss</p>
            <h2 className="font-display mt-1 text-xl font-semibold sm:text-2xl">Moderne klinikk i Groruddalen</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                📍{" "}
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
                  {clinic.address}
                </a>
              </li>
              {longOffer.transit && <li>🚇 {longOffer.transit}</li>}
              {longOffer.parking && <li>🅿️ {longOffer.parking}</li>}
              <li>
                ☎{" "}
                <a href={`tel:${clinic.phone.replace(/\s/g, "")}`} className="font-medium underline underline-offset-2">
                  {clinic.phone}
                </a>
              </li>
            </ul>
            <div className="mt-4 rounded-xl bg-canvas p-4">
              <p className="text-sm font-semibold">Åpningstider</p>
              {longOffer.hours.map((h) => (
                <p key={h} className="text-sm text-ink-60">{h}</p>
              ))}
            </div>
          </section>
        )}

        {/* Trust */}
        <section className={card}>
          {clinic.rating && (
            <p className="flex items-center gap-2">
              <span aria-hidden className="text-lg tracking-tight text-[#f5b301]">★★★★★</span>
              <span className="font-display text-xl font-semibold">{clinic.rating.value}</span>
              <span className="text-sm text-ink-40">{clinic.rating.count} Google-anmeldelser</span>
            </p>
          )}
          <h2 className="font-display mt-3 text-xl font-semibold">Ingen forpliktelser eller skjulte kostnader</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-60">
            Du betaler {kr(offer.price)} for besøket, ingenting mer. Vi gir deg denne prisen fordi vi tror du vil trives
            hos oss, og håper du velger oss neste gang også.
          </p>
        </section>

        {/* FAQ */}
        <section className={card}>
          <p className={eyebrow}>Vanlige spørsmål</p>
          <h2 className="font-display mt-1 text-xl font-semibold sm:text-2xl">Spørsmål og svar</h2>
          <div className="mt-3 divide-y divide-line">
            {faq.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium">
                  {f.q}
                  <span aria-hidden className="text-ink-40 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-60">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Form */}
        <section
          id="bestill"
          className="relative scroll-mt-4 overflow-hidden rounded-card border border-line bg-white p-4 pt-5 shadow-xl shadow-[color-mix(in_srgb,var(--l-dark)_10%,transparent)] sm:p-7 sm:pt-8"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: "linear-gradient(to right, var(--l-dark), var(--l-cta), var(--l-dark))" }}
          />
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold sm:text-2xl">Book din time til {kr(offer.price)}</h2>
            <p className="text-[11px] font-medium text-[var(--l-accent-ink)]">Begrenset antall plasser</p>
          </div>
          <LeadForm clinicSlug={clinic.slug} kilde="tilbud" />
        </section>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <BookButton />
      </div>
    </LandingShell>
  );
}
