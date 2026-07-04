import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om Oss – Din digitale partner",
  description:
    "DentDigital ble grunnlagt av teknologieksperter og tannhelsespesialister for å gi norske tannklinikker en digital partner som forstår bransjen.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
