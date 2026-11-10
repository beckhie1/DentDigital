import type { Metadata } from "next";
import OfferLanding from "@/components/lillestrom/OfferLanding";

export const metadata: Metadata = {
  title: { absolute: "Implantatkonsultasjon 399 kr – tannlege i Lillestrøm | Lillestrøm Tannhelse" },
  description:
    "Mangler du en tann? Bestill implantatkonsultasjon for 399 kr hos Lillestrøm Tannhelse. Du får behandlingsplan og prisoverslag før vi starter.",
};

export default function LillestromImplantatKonsultasjon() {
  return (
    <OfferLanding
      source="implantat-konsultasjon"
      badge="Tannimplantat"
      title="Implantatkonsultasjon"
      price="399 kr"
      summary="Fast erstatning for en tapt tann. Behandlingsplan og prisoverslag før vi starter."
      submitLabel="Bestill konsultasjon"
    />
  );
}
