import Image from "next/image";
import type { ReactNode } from "react";
import { LT, LT_OFFERS, type LtSource } from "@/lib/lillestrom";
import LeadForm from "./LeadForm";

type Props = {
  source: LtSource;
  badge: string;
  title: string;
  price: ReactNode;
  summary: string;
  submitLabel: string;
};

// Ad landing page: offer + form only, so most of the form is visible without scrolling.
export default function OfferLanding({ source, badge, title, price, summary, submitLabel }: Props) {
  return (
    <div className="min-h-dvh bg-lt-frost">
      <div className="mx-auto w-full max-w-lg px-4 py-4 sm:py-10">
        <section className="rounded-2xl bg-gradient-to-br from-lt-cobalt to-[#164ea8] px-3.5 py-2.5 text-white shadow-sm ring-1 ring-white/10 sm:px-5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-md bg-white/95 p-1">
              <Image src={LT.logo} alt={LT.name} width={150} height={50} priority className="h-6 w-auto" />
            </div>
            <p className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-white/90 uppercase">{badge}</p>
          </div>
          <h1 className="mt-2 font-lt text-[1.1rem] leading-tight font-bold tracking-tight text-white sm:text-[1.4rem]">{title}</h1>
          <p className="mt-1 flex items-baseline gap-2 font-lt text-[1.1rem] leading-none font-bold text-white tabular-nums">{price}</p>
          <p className="mt-1 text-[0.82rem] leading-snug text-white/90">{summary}</p>
        </section>

        <section id="skjema" aria-label={submitLabel} className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-lt-line sm:p-6">
          <LeadForm
            source={source}
            topics={[...LT_OFFERS[source].topics]}
            submitLabel={submitLabel}
            preferredLabel="Når passer det best?"
            preferredPlaceholder="F.eks. torsdag ettermiddag"
          />
        </section>
      </div>
    </div>
  );
}
