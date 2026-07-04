import { notFound } from "next/navigation";
import { cases, getCase } from "@/lib/cases";
import CaseView from "./case-view";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs) return {};
  return { title: `${cs.client.no} – Resultater`, description: cs.summary.no };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs) notFound();
  return <CaseView slug={slug} />;
}
