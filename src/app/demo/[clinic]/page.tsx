import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoSlugs, getDemoClinic } from "@/lib/demo-clinics";
import DemoSite from "@/components/demo/DemoSite";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoSlugs().map((clinic) => ({ clinic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clinic: string }>;
}): Promise<Metadata> {
  const { clinic } = await params;
  const data = getDemoClinic(clinic);
  if (!data) return {};
  return {
    title: `${data.name} — Demo`,
    description: data.heroLede,
    robots: { index: false, follow: false },
    icons: { icon: `/demo/favicon-${data.slug}.svg` },
  };
}

export default async function DemoClinicPage({
  params,
}: {
  params: Promise<{ clinic: string }>;
}) {
  const { clinic } = await params;
  const data = getDemoClinic(clinic);
  if (!data) notFound();
  return <DemoSite data={data} />;
}
