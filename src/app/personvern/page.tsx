import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { personvern } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik behandler DentDigital AS personopplysninger på dentdigital.no – i tråd med GDPR og personopplysningsloven.",
};

export default function Page() {
  return <LegalPage doc={personvern} />;
}
