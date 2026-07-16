import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { landingHandles, matchHandle } from "@/lib/clinics";
import OfferLanding from "@/components/onboarding/OfferLanding";
import VaktLanding from "@/components/onboarding/VaktLanding";
import FeedbackFlow from "@/components/onboarding/FeedbackFlow";

/** Only handles from the clinic registry exist; everything else 404s at build time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return landingHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const match = matchHandle(handle);
  if (!match) return {};
  const { kind, clinic } = match;
  const titles = {
    tilbud: `${clinic.offer.title} – ${clinic.name}`,
    tannlegevakt: `Tannlegevakt – ${clinic.name}`,
    feedback: `Tilbakemelding – ${clinic.name}`,
  } as const;
  return {
    title: titles[kind],
    robots: { index: false, follow: false }, // ad landing + feedback pages stay out of search
  };
}

export default async function ClinicLandingPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const match = matchHandle(handle);
  if (!match) notFound();

  const { kind, clinic } = match;
  if (kind === "tilbud") return <OfferLanding clinic={clinic} />;
  if (kind === "tannlegevakt") return <VaktLanding clinic={clinic} />;
  return <FeedbackFlow clinic={clinic} />;
}
