import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om Oss – Din digitale partner",
  description:
    "DentDigital ble grunnlagt av teknologieksperter og spesialister fra helsesektoren for å gi norske helseklinikker en digital partner som forstår bransjen.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
