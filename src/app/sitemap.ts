import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { articles } from "@/lib/articles";
import { cases } from "@/lib/cases";

const BASE = "https://www.dentdigital.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tjenester",
    "/resultater",
    "/om-oss",
    "/fagartikler",
    "/ai",
    "/kontakt",
    "/personvern",
    "/vilkar",
    "/cookies",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...services.map((s) => ({
      url: `${BASE}/tjenester/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...cases.map((c) => ({
      url: `${BASE}/resultater/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map((a) => ({
      url: `${BASE}/fagartikler/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
