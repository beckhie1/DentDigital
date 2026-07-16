/**
 * Clinic registry — single source of truth for onboarded clinics.
 *
 * Each entry powers three public pages:
 *   /{slug}-tilbud          → offer landing page with lead form (ads)
 *   /{slug}-tannlegevakt    → emergency-dentist landing page (Google Ads)
 *   /{feedbackCode}         → patient feedback flow (review gating)
 *
 * New entries are appended by `scripts/onboard-clinic.mjs` — do not remove
 * the ⟪ONBOARD:INSERT⟫ marker below.
 */

export interface ClinicOffer {
  /** e.g. "Komplett undersøkelse + rens" */
  title: string;
  oldPrice: number;
  price: number;
  includes: string[];
}

export interface Clinic {
  /** URL-safe clinic slug, e.g. "groruddalen-tannlegesenter" */
  slug: string;
  name: string;
  /** Lead + feedback alerts go here */
  email: string;
  phone: string;
  address: string;
  /** Google Sheet that receives leads + feedback rows */
  spreadsheetId: string;
  /** Google "write a review" URL (place-id link) */
  googleReviewUrl: string;
  /** 7-char code → dentdigital.no/{code} feedback page */
  feedbackCode: string;
  /** Phone shown on the tannlegevakt page (defaults to `phone`) */
  vaktPhone?: string;
  /** Meta (Facebook) pixel/dataset id — loaded on the clinic's landing pages */
  metaPixelId?: string;
  active: boolean;
  offer: ClinicOffer;
}

export const DEFAULT_OFFER: ClinicOffer = {
  title: "Komplett undersøkelse + rens",
  oldPrice: 1390,
  price: 590,
  includes: [
    "Grundig undersøkelse av erfaren tannlege",
    "Røntgenbilder og konsultasjon",
    "Profesjonell rens som fjerner misfarging",
    "Personlig behandlingsplan",
  ],
};

export const clinics: Clinic[] = [
    {
    slug: "groruddalen-tannlegesenter",
    name: "Groruddalen Tannlegesenter",
    email: "post@gdts.no",
    phone: "+47 92 02 92 02",
    address: "Kakkelovnskroken 3, 0954 Oslo",
    spreadsheetId: "16KgjmLMZ74I_6R0Y09xIcjjt1jJg7Ag45b3K3JmwY2U",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ7QqXhJFxQUYRqnqGd6n8K_4",
    feedbackCode: "kz8t3d2",
    metaPixelId: "1289643192545999",
    active: true,
    offer: DEFAULT_OFFER,
  },
  // ⟪ONBOARD:INSERT⟫ — entries are appended above this line by scripts/onboard-clinic.mjs
];

/* ── helpers ─────────────────────────────────────────────── */

export type LandingKind = "tilbud" | "tannlegevakt" | "feedback";

export interface HandleMatch {
  kind: LandingKind;
  clinic: Clinic;
}

const activeClinics = () => clinics.filter((c) => c.active);

/** All root-level handles that should be statically generated. */
export function landingHandles(): string[] {
  return activeClinics().flatMap((c) => [
    `${c.slug}-tilbud`,
    `${c.slug}-tannlegevakt`,
    c.feedbackCode,
  ]);
}

/** Resolve a root URL segment to a clinic + page kind. */
export function matchHandle(handle: string): HandleMatch | null {
  for (const clinic of activeClinics()) {
    if (handle === `${clinic.slug}-tilbud`) return { kind: "tilbud", clinic };
    if (handle === `${clinic.slug}-tannlegevakt`) return { kind: "tannlegevakt", clinic };
    if (handle === clinic.feedbackCode) return { kind: "feedback", clinic };
  }
  return null;
}

export function getClinicBySlug(slug: string): Clinic | undefined {
  return clinics.find((c) => c.slug === slug);
}

/** True when the current pathname is a chrome-free landing page. */
export function isLandingPath(pathname: string): boolean {
  const seg = pathname.replace(/^\/+|\/+$/g, "");
  if (!seg || seg.includes("/")) return false;
  return matchHandle(seg) !== null;
}
