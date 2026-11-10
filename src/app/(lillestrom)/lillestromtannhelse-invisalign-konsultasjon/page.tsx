import type { Metadata } from "next";
import OfferLanding from "@/components/lillestrom/OfferLanding";

export const metadata: Metadata = {
  title: { absolute: "Gratis Invisalign-konsultasjon – tannlege i Lillestrøm | Lillestrøm Tannhelse" },
  description:
    "Rettere tenner med nesten usynlige skinner. Bestill en gratis og uforpliktende Invisalign-konsultasjon hos Lillestrøm Tannhelse i Nittedalsgata 20B.",
};

export default function LillestromInvisalignKonsultasjon() {
  return (
    <OfferLanding
      source="invisalign-konsultasjon"
      badge="Invisalign"
      title="Gratis Invisalign-konsultasjon"
      price={
        <>
          0 kr <span className="text-[0.78rem] font-medium text-white/75">uforpliktende</span>
        </>
      }
      summary="Nesten usynlige skinner, ingen brakketter. Vi forteller hva som er mulig for deg."
      submitLabel="Bestill gratis konsultasjon"
    />
  );
}
