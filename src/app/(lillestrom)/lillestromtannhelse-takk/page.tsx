import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Check, Phone } from "@/components/lillestrom/Icons";
import { LtLeadConversion } from "@/components/lillestrom/Tracking";
import { LT } from "@/lib/lillestrom";

export const metadata: Metadata = {
  title: { absolute: "Takk for henvendelsen | Lillestrøm Tannhelse" },
};

/** Same thank-you page as lillestromtannhelse.no/takk: minimal clinic header, booking link, footer. */
export default function LillestromTakk() {
  return (
    <div className="flex min-h-dvh flex-col bg-lt-enamel">
      <header className="sticky top-0 z-50 border-b border-lt-line bg-white/95 backdrop-blur">
        <div className="lt-wrap flex h-[4.5rem] items-center justify-between gap-4">
          <Image src={LT.logo} alt={LT.name} width={168} height={56} priority className="h-10 w-auto sm:h-11" />
          <a href={LT.phoneHref} className="lt-btn-primary tabular-nums">
            <Phone size={18} /> {LT.phoneShort}
          </a>
        </div>
      </header>

      <LtLeadConversion />
      <section className="lt-wrap flex-1 py-16 lg:py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-lt-cobalt text-white">
            <Check size={26} />
          </span>
          <h1 className="lt-page-title mt-6">Takk for henvendelsen!</h1>
          <p className="lt-lead mx-auto mt-4">Vi ringer deg så snart vi kan.</p>
          <p className="mt-6 text-lt-ink-soft">Vil du heller bestille selv? Velg en ledig time i timeboken vår.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={LT.selfBookingUrl} target="_blank" rel="noopener" className="lt-btn-primary">
              <CalendarDays size={18} aria-hidden /> Bestill time selv
            </a>
            <a href={LT.phoneHref} className="lt-btn-ghost tabular-nums">
              <Phone size={18} /> Ring {LT.phoneShort}
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-16 bg-lt-ink py-10 text-sm text-white/75">
        <div className="lt-wrap grid gap-6 sm:grid-cols-3">
          <address className="not-italic leading-relaxed">
            <span className="font-lt font-bold text-white">{LT.legalName}</span>
            <br />
            {LT.street}, {LT.postalCode} {LT.city}
          </address>
          <p className="leading-relaxed">
            <span className="font-lt font-bold text-white">Åpningstider</span>
            <br />
            {LT.hoursSummary}
          </p>
          <p className="leading-relaxed">
            <a href={LT.phoneHref} className="font-lt font-semibold text-white tabular-nums">
              {LT.phone}
            </a>
            <br />
            <a href={`mailto:${LT.email}`} className="hover:text-white">
              {LT.email}
            </a>
            <br />
            <a href={LT.privacyUrl} className="hover:text-white">
              Personvern
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
