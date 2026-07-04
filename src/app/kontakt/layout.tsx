import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt – Book gratis behovsanalyse",
  description:
    "Kontakt DentDigital for en uforpliktende samtale om digitalisering av din tannklinikk. Gratis behovsanalyse.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
