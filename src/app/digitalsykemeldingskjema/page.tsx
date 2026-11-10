import type { Metadata } from "next";
import EgenvurderingForm from "@/components/skjema/EgenvurderingForm";

export const metadata: Metadata = {
  title: "Egenvurdering av funksjon og arbeidsevne",
  robots: { index: false, follow: false },
};

export default function EgenvurderingPage() {
  return (
    <div className="-mt-16 min-h-screen bg-canvas px-4 sm:px-6">
      <EgenvurderingForm />
    </div>
  );
}
