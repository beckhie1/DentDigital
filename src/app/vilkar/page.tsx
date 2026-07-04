import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { vilkar } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Vilkår for bruk",
  description: "Vilkår for bruk av dentdigital.no, drevet av DentDigital AS.",
};

export default function Page() {
  return <LegalPage doc={vilkar} />;
}
