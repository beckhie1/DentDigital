/**
 * Lillestrøm Tannhelse ad landing pages hosted on dentdigital.no (Meta-verified domain).
 * Ported 1:1 from lillestromtannhelse.no/{tilbud,invisalign-konsultasjon,implantat-konsultasjon}:
 * same look, same form, same lead row in the clinic's Leads sheet (A:AR), same pixel.
 *
 *   /lillestromtannhelse-tilbud
 *   /lillestromtannhelse-invisalign-konsultasjon
 *   /lillestromtannhelse-implantat-konsultasjon
 *   /lillestromtannhelse-takk            → thank-you page, fires the Lead event
 */

export const LT = {
  name: "Lillestrøm Tannhelse",
  legalName: "Lillestrøm Tannhelse AS",
  url: "https://www.lillestromtannhelse.no",
  phone: "+47 901 11 919",
  phoneHref: "tel:+4790111919",
  phoneShort: "901 11 919",
  email: "post@lillestromtannhelse.no",
  street: "Nittedalsgata 20B",
  postalCode: "2000",
  city: "Lillestrøm",
  hoursSummary: "Man–fre 08–20 · Lør–søn 10–17",
  privacyUrl: "https://www.lillestromtannhelse.no/personvern/",
  logo: "/clinics/lillestrom-tannhelse-wide.png",
  // Opens Opus straight at the treatment step for this clinic.
  selfBookingUrl:
    "https://lilletannhelse.opusdentalonline.com/?clinic=Lillestr%25c3%25b8m%2bTannhelse%2bAS&databaseid=7c00c0e1-af75-4777-85fd-48d9ce59b79c&step=treatment&back=1&idp=",
  /** Same sheet lillestromtannhelse.no writes to (shared with the gdts-api service account). */
  spreadsheetId: "1ck7cp4Bf4Tn2ho0RcV6NeLkt7y6Fnhjm3HNoA-50waY",
  /** DentDigital-owned dataset shared with the Lillestrøm ad account (the clinic-site pixel 1115172838045292 is flagged). */
  metaPixelId: "2251710569022785",
} as const;

/**
 * Custom event names only: Meta restricts standard events such as Lead on dental/health pixels.
 * Ads optimise on custom conversions built from LT_LEAD_EVENT (one per offer, matched on the URL).
 */
export const LT_LEAD_EVENT = "booking_request";

export const LT_PREFIX = "lillestromtannhelse-";
export const LT_THANKS_PATH = `/${LT_PREFIX}takk`;

/** Ad landing pages that write to the Leads sheet. `topics[0]` is what the sheet's "Gjelder" column shows. */
export const LT_OFFERS = {
  tilbud: { topics: ["Komplett tannlegebesøk 549 kr"], value: 549 },
  "invisalign-konsultasjon": { topics: ["Invisalign-konsultasjon 0 kr"], value: 0 },
  "implantat-konsultasjon": { topics: ["Implantatkonsultasjon 399 kr"], value: 399 },
} as const satisfies Record<string, { topics: readonly string[]; value: number }>;

export type LtSource = keyof typeof LT_OFFERS;

export const isLtSource = (s: string): s is LtSource => Object.hasOwn(LT_OFFERS, s);

export const ltLandingUrl = (source: LtSource) => `https://www.dentdigital.no/${LT_PREFIX}${source}`;

/** Offer pages hide the site chrome and the cookie banner, like lillestromtannhelse.no does. */
export function isLtBarePath(seg: string) {
  return seg.startsWith(LT_PREFIX) && isLtSource(seg.slice(LT_PREFIX.length));
}

export function isLtPath(seg: string) {
  return isLtBarePath(seg) || `/${seg}` === LT_THANKS_PATH;
}
