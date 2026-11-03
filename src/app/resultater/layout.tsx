import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resultater – Dokumenterte resultater for helseklinikker",
  description:
    "Ekte prosjekter, målbare tall: flere bookinger, høyere oppetid og spart tid for norske helseklinikker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
