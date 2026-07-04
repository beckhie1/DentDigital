export interface CaseMetric {
  value: string;
  label: { no: string; en: string };
}

export interface CaseStudy {
  slug: string;
  /** Draft numbers pending client verification — listed in QA.md, not rendered. */
  verified: boolean;
  client: { no: string; en: string };
  services: string[]; // service slugs
  image: string;
  summary: { no: string; en: string };
  challenge: { no: string; en: string };
  solution: { no: string; en: string };
  metrics: CaseMetric[];
  featured: boolean;
}

export const cases: CaseStudy[] = [
  {
    slug: "tannklinikk-oslo-nettside-seo",
    verified: false,
    client: {
      no: "Allmennklinikk, Oslo",
      en: "General clinic, Oslo",
    },
    services: ["nettsideutvikling", "pasientkommunikasjon"],
    image: "/dental-website-marketing.png",
    summary: {
      no: "Ny nettside med online booking og lokal SEO ga flere pasienter – uten økt annonsebudsjett.",
      en: "A new website with online booking and local SEO brought more patients – without increasing ad spend.",
    },
    challenge: {
      no: "Klinikken hadde en utdatert nettside uten booking, var usynlig i lokale Google-søk og mistet henvendelser til konkurrenter i samme bydel. Resepsjonen brukte store deler av dagen på telefonbestillinger.",
      en: "The clinic had an outdated website without booking, was invisible in local Google searches and lost inquiries to competitors in the same district. Reception spent much of the day on phone bookings.",
    },
    solution: {
      no: "Vi bygde en rask, konverteringsfokusert nettside i Next.js med integrert online booking, gjennomførte teknisk og lokal SEO (Google Business-profil, omtaler, bydelssider) og satte opp automatiske SMS-påminnelser.",
      en: "We built a fast, conversion-focused Next.js website with integrated online booking, executed technical and local SEO (Google Business profile, reviews, district pages) and set up automatic SMS reminders.",
    },
    metrics: [
      { value: "+64%", label: { no: "online bookinger på 6 mnd", en: "online bookings in 6 months" } },
      { value: "Topp 3", label: { no: "på «tannlege + bydel» i Google", en: "for 'dentist + district' on Google" } },
      { value: "−38%", label: { no: "uteblivelser med SMS-påminnelser", en: "no-shows with SMS reminders" } },
    ],
    featured: true,
  },
  {
    slug: "klinikkjede-vestlandet-it",
    verified: false,
    client: {
      no: "Klinikkjede, Vestlandet (3 lokasjoner)",
      en: "Clinic chain, Western Norway (3 locations)",
    },
    services: ["it-infrastruktur", "sikkerhetskopi-sky"],
    image: "/it-support-dental.png",
    summary: {
      no: "Standardisert IT-drift og hybrid backup ga stabil hverdag på tvers av tre klinikker.",
      en: "Standardized IT operations and hybrid backup delivered a stable workday across three clinics.",
    },
    challenge: {
      no: "Tre klinikker med ulikt utstyr, ustabilt nettverk og ingen testet backup. Nedetid i journalsystemet stoppet behandlinger flere ganger i måneden, og en ransomware-hendelse hos en nabopraksis gjorde risikoen konkret.",
      en: "Three clinics with different equipment, unstable networks and no tested backup. Record-system downtime stopped treatments several times a month, and a ransomware incident at a neighboring practice made the risk tangible.",
    },
    solution: {
      no: "Vi standardiserte maskinvare og nettverk (Cisco/Meraki), innførte proaktiv overvåking, og satte opp hybrid sikkerhetskopi (lokal NAS + Azure, data i EU) med kvartalsvise gjenopprettingsøvelser.",
      en: "We standardized hardware and networking (Cisco/Meraki), introduced proactive monitoring, and set up hybrid backup (local NAS + Azure, data in the EU) with quarterly recovery drills.",
    },
    metrics: [
      { value: "99,9%", label: { no: "oppetid siste 12 måneder", en: "uptime last 12 months" } },
      { value: "<1 t", label: { no: "responstid ved kritiske hendelser", en: "response time for critical incidents" } },
      { value: "<4 t", label: { no: "full gjenoppretting i øvelse", en: "full recovery in drills" } },
    ],
    featured: true,
  },
  {
    slug: "spesialistklinikk-trondheim-innsikt",
    verified: false,
    client: {
      no: "Spesialistklinikk, Trondheim",
      en: "Specialist clinic, Trondheim",
    },
    services: ["opus-programvare", "datadrevet-innsikt"],
    image: "/dental-software-dashboard.png",
    summary: {
      no: "Optimalisert Opus-oppsett og et enkelt nøkkeltall-dashboard frigjorde tid og fylte timeboken.",
      en: "An optimized Opus setup and a simple KPI dashboard freed up time and filled the appointment book.",
    },
    challenge: {
      no: "Opus var i drift, men dårlig konfigurert: trege bildearbeidsflyter, dobbeltregistrering mot journalsystemet og ingen oversikt over timeutnyttelse eller avlysningsmønstre.",
      en: "Opus was running but poorly configured: slow imaging workflows, duplicate data entry against the record system and no overview of utilization or cancellation patterns.",
    },
    solution: {
      no: "Vi rekonfigurerte Opus for CBCT-arbeidsflyten, integrerte mot journalsystemet, lærte opp personalet, og bygde et dashboard med timeutnyttelse, avlysninger og inntekt per behandlerstol.",
      en: "We reconfigured Opus for the CBCT workflow, integrated it with the record system, trained the staff, and built a dashboard with utilization, cancellations and revenue per operatory.",
    },
    metrics: [
      { value: "−35%", label: { no: "administrativ tid per uke", en: "administrative time per week" } },
      { value: "+22%", label: { no: "timeutnyttelse på 4 mnd", en: "utilization in 4 months" } },
      { value: "2 uker", label: { no: "fra oppstart til full drift", en: "from start to full operation" } },
    ],
    featured: true,
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
