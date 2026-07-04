import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { cookiesDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Informasjonskapsler (cookies)",
  description:
    "Slik bruker dentdigital.no informasjonskapsler og lokal lagring.",
};

export default function Page() {
  return <LegalPage doc={cookiesDoc} />;
}
