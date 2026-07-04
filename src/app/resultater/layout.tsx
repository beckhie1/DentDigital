import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resultater – Dokumenterte resultater for tannklinikker",
  description:
    "Ekte prosjekter, målbare tall: flere bookinger, høyere oppetid og spart tid for norske tannklinikker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
