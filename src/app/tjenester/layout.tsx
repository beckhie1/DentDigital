import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tjenester – Digitale løsninger for helseklinikker",
  description:
    "Annonsering, innhold og posting i sosiale medier, nettsider og lokal SEO, IT-drift, sikkerhetskopi, datainnsikt og mer – skreddersydd for norske helseklinikker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
