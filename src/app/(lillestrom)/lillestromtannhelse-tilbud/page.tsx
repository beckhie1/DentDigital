import type { Metadata } from "next";
import OfferLanding from "@/components/lillestrom/OfferLanding";

const price = 549;
const ordinaryPrice = 1560;
const kr = (amount: number) => `${amount.toLocaleString("nb-NO")} kr`;

export const metadata: Metadata = {
  title: { absolute: `Komplett tannlegebesøk for ${kr(price)} – tannlege i Lillestrøm | Lillestrøm Tannhelse` },
  description: `Tannsjekk, røntgen, AirFlow og rens for ${kr(price)} (ordinær pris ${kr(ordinaryPrice)}). Bestill kampanjetimen hos Lillestrøm Tannhelse.`,
};

export default function LillestromTilbud() {
  return (
    <OfferLanding
      source="tilbud"
      badge="Kampanje"
      title="Komplett tannlegeundersøkelse"
      price={
        <>
          {kr(price)} <s className="text-[0.78rem] font-medium text-white/60">{kr(ordinaryPrice)}</s>
        </>
      }
      summary="Tannsjekk, røntgenbilder, Premium AirFlow, grundig rens og konsultasjon."
      submitLabel="Bestill kampanjetime"
    />
  );
}
