import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fagartikler – Ressurser for tannklinikker",
  description:
    "Fagartikler om digitalisering, AI, sikkerhet, markedsføring og IT for norske tannklinikker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
