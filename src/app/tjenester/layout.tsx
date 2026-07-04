import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tjenester – Digitale løsninger for tannklinikker",
  description:
    "Nettsider og lokal SEO, IT-drift, Opus-integrasjon, sikkerhetskopi, datainnsikt og mer – skreddersydd for norske tannklinikker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
