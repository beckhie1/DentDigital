/**
 * Demo clinic sites — content powering the sales demos at:
 *   /demo/fonnatannklinikk
 *   /demo/husnestannklinikk
 *
 * DentDigital-owned demonstrations shown to prospective clinics. Fonna content
 * is extracted from fonnatannklinikk.no + the client meeting + the strategy
 * report; Husnes is the proposed sister-clinic (Husnes Storsenter, part of
 * "Fonna Tanngruppen"). Copy is Norwegian BOKMÅL; the tourist section is EN.
 */

export type IconKey =
  | "tooth"
  | "aligner"
  | "implant"
  | "scan"
  | "clock"
  | "shield"
  | "heart"
  | "sparkle"
  | "crown"
  | "denture"
  | "emergency"
  | "pin"
  | "phone"
  | "star"
  | "check"
  | "gift"
  | "wallet"
  | "calendar"
  | "route";

export interface DemoService {
  title: string;
  desc: string;
  icon: IconKey;
  featured?: boolean;
}

export interface DemoTeamMember {
  role: string;
  detail: string;
  initials: string;
}

export interface DemoOffer {
  title: string;
  price: string;
  desc: string;
  highlight?: boolean;
}

export interface DemoReview {
  name: string;
  meta: string;
  text: string;
  stars: number;
}

export interface DemoFaq {
  q: string;
  a: string;
}

export interface DemoProcessStep {
  title: string;
  desc: string;
}

export interface DemoUsp {
  title: string;
  desc: string;
  icon: IconKey;
}

export interface DemoTech {
  title: string;
  desc: string;
  icon: IconKey;
}

export interface DemoImage {
  src: string;
  alt: string;
}

export interface DemoTheme {
  brand: string;
  brandDark: string;
  brandInk: string;
  brandSoft: string;
  wash: string;
  accent: string;
  onBrand: string;
  motif: "glacier" | "coast";
}

export interface DemoHours {
  day: string;
  time: string;
  days: number[];
  open: number | null;
  close: number | null;
}

export interface DemoTourist {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}

export interface DemoClinic {
  slug: string;
  name: string;
  short: string;
  group: string;
  tagline: string;
  heroTitle: string;
  heroLede: string;
  intro: string;
  region: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  established?: string;
  comingSoon?: boolean;
  heroTrust: string[];
  heroImage: DemoImage;
  aboutImage: DemoImage;
  touristImage: DemoImage;
  sister: { name: string; href: string; city: string; blurb: string };
  social: { facebook?: string; instagram?: string };
  theme: DemoTheme;
  hours: DemoHours[];
  hoursNote?: string;
  usps: DemoUsp[];
  services: DemoService[];
  process: DemoProcessStep[];
  team: DemoTeamMember[];
  teamNote: string;
  technology: DemoTech[];
  offers: DemoOffer[];
  financing: { title: string; body: string; points: string[] };
  gavekort: { title: string; body: string; amount: string; cta: string };
  tourist: DemoTourist;
  rating: { value: string; count: string };
  reviews: DemoReview[];
  faqs: DemoFaq[];
  mapQuery: string;
  bookLabel: string;
  bookLead: string;
}

const FONNA: DemoClinic = {
  slug: "fonnatannklinikk",
  name: "Fonna Tannklinikk",
  short: "Fonna",
  group: "Fonna Tanngruppen",
  tagline: "Erfarne tannleger i hjertet av Rosendal",
  heroTitle: "Tannlegen i hjertet av Hardanger",
  heroLede:
    "En moderne familieklinikk i Rosendal — åpen alle dager, med spesialistkompetanse og moderne utstyr. Fra rutinekontroll til implantat, kirurgi og usynlig regulering.",
  intro:
    "Fonna Tannklinikk er en av de nyeste klinikkene i Kvinnherad, med høy kompetanse og moderne utstyr. Vi utfører både vanlig tannbehandling og avanserte behandlinger som tannimplantat, kirurgi og estetiske behandlinger — med deg som pasient i fokus.",
  region: "Kvinnherad · Hardanger",
  address: "Skalågato 13, 5470 Rosendal",
  phone: "919 24 774",
  phoneHref: "tel:+4791924774",
  email: "post@fonnatannklinikk.no",
  established: "Etablert 2021",
  heroTrust: ["Direkteoppgjør med Helfo", "Åpent alle dager", "Etablert 2021"],
  heroImage: {
    src: "/demo/hero-clinic.jpg",
    alt: "Tannlege viser panoramarøntgen til en pasient i et moderne behandlingsrom",
  },
  aboutImage: {
    src: "/demo/treatment.jpg",
    alt: "Tannlege med lupebriller utfører presis behandling",
  },
  touristImage: {
    src: "/demo/fjord.jpg",
    alt: "Snødekte fjelltopper over skyene i Hardanger",
  },
  sister: {
    name: "Husnes Tannklinikk",
    href: "/demo/husnestannklinikk",
    city: "Husnes",
    blurb: "Vår nye søsterklinikk i Husnes Storsenter. Samme team, samme kompetanse.",
  },
  social: {
    facebook: "https://www.facebook.com/Fonnatannklinikk/",
    instagram: "https://www.instagram.com/fonnatannklinikk",
  },
  theme: {
    brand: "#0e7c86",
    brandDark: "#0a3b42",
    brandInk: "#0a5760",
    brandSoft: "#e6f3f4",
    wash: "#f5f8f9",
    accent: "#d9a441",
    onBrand: "#ffffff",
    motif: "glacier",
  },
  hours: [
    { day: "Mandag – fredag", time: "09:00 – 17:00", days: [1, 2, 3, 4, 5], open: 540, close: 1020 },
    { day: "Lørdag", time: "09:00 – 17:00", days: [6], open: 540, close: 1020 },
    { day: "Søndag", time: "09:00 – 17:00", days: [0], open: 540, close: 1020 },
  ],
  hoursNote: "Tannlegevakt tilgjengelig på tilkalling ved akutte tannproblemer.",
  usps: [
    {
      title: "Åpent alle dager — også i helgen",
      desc: "Sjenerøse åpningstider gjennom hele uken. Du trenger ikke ta fri fra jobb for å gå til tannlegen.",
      icon: "clock",
    },
    {
      title: "Moderne utstyr",
      desc: "3D OPG-røntgen, digital skanning og eget utstyr for implantat og kirurgi — trygg, presis behandling.",
      icon: "scan",
    },
    {
      title: "Familiedrevet klinikk",
      desc: "En lokal klinikk drevet med hjerte. Du møter de samme folkene hver gang, og vi blir kjent med hele familien.",
      icon: "heart",
    },
    {
      title: "Direkteoppgjør med Helfo",
      desc: "Vi har direkteoppgjør i samarbeid med Helfo — da betaler du kun egenandelen hos oss.",
      icon: "shield",
    },
  ],
  services: [
    {
      title: "Usynlig regulering",
      desc: "Rett opp tennene diskré med gjennomsiktige skinner — med vår egen spesialist i usynlig regulering.",
      icon: "aligner",
      featured: true,
    },
    {
      title: "Tannimplantat",
      desc: "Permanent erstatning for tapte tenner, planlagt med 3D-røntgen for et trygt og varig resultat.",
      icon: "implant",
      featured: true,
    },
    {
      title: "Oralkirurgi",
      desc: "Kirurgiske inngrep utført lokalt av erfaren kirurg — uten lang reisevei til byen.",
      icon: "tooth",
      featured: true,
    },
    {
      title: "Undersøkelse og rens",
      desc: "Grundig kontroll, røntgen og profesjonell rens som fjerner tannstein og misfarging.",
      icon: "check",
    },
    {
      title: "Estetisk behandling og bleking",
      desc: "Zoom klinikkbleking og estetiske behandlinger for et lysere, friskere smil.",
      icon: "sparkle",
    },
    {
      title: "Kroner og broer",
      desc: "Skreddersydde kroner og broer som bygger opp igjen tannsettet ditt.",
      icon: "crown",
    },
    {
      title: "Rotfylling",
      desc: "Skånsom rotbehandling som redder tannen og fjerner smerten.",
      icon: "tooth",
    },
    {
      title: "Tannprotese",
      desc: "Hel- og delproteser tilpasset for komfort og et naturlig smil.",
      icon: "denture",
    },
    {
      title: "Tannlegevakt",
      desc: "Rask hjelp ved akutte tannproblemer — vi setter av tid til deg samme dag.",
      icon: "emergency",
    },
  ],
  process: [
    { title: "Ta kontakt", desc: "Bestill time på nett, e-post eller telefon — vi finner et tidspunkt som passer deg." },
    { title: "Undersøkelse og 3D-røntgen", desc: "Grundig kartlegging med moderne røntgen, så vi ser hele bildet." },
    { title: "Behandlingsplan", desc: "Du får en tydelig plan med alternativer, tidsbruk og pris før vi starter." },
    { title: "Trygg behandling", desc: "Skånsom, smertefri behandling — med god tid og rolig tempo." },
    { title: "Oppfølging", desc: "Vi følger deg opp over tid og minner deg på neste kontroll." },
  ],
  team: [
    { role: "Tannlege", detail: "Spesialisering i usynlig regulering", initials: "UR" },
    { role: "Oralkirurg", detail: "Implantat og kirurgi", initials: "OK" },
    { role: "Tannlege", detail: "Implantatspesialist · 25 års erfaring", initials: "IM" },
    { role: "Tannlege", detail: "Allmenn tannbehandling", initials: "AT" },
    { role: "Resepsjon", detail: "Booking og pasientkontakt", initials: "RE" },
  ],
  teamNote:
    "En familiedrevet klinikk med bred kompetanse under samme tak — fra allmenn tannbehandling til implantat, kirurgi og usynlig regulering. Hos oss får du din faste behandlingskontakt, slik at hvert besøk blir tryggere og mer personlig.",
  technology: [
    { title: "3D OPG-røntgen", desc: "Digital panoramarøntgen gir presis diagnostikk med lav stråledose.", icon: "scan" },
    { title: "Digital skanning", desc: "Intraoral skanner erstatter ubehagelige avtrykk — raskere og mer nøyaktig.", icon: "sparkle" },
    { title: "Implantatutstyr", desc: "Eget, moderne utstyr for planlegging og innsetting av implantat lokalt.", icon: "implant" },
  ],
  offers: [
    { title: "Første undersøkelse", price: "1 500 kr", desc: "Din første konsultasjon inkludert røntgen og enkel rens.", highlight: true },
    { title: "Klinikkbleking med Zoom", price: "4 500 kr", desc: "Profesjonell tannbleking på klinikken for et merkbart lysere smil." },
    { title: "Undersøkelse ved tanngnissing", price: "900 kr", desc: "Undersøkelse og diagnostikk for deg som sliter med gnissing og kjeveplager." },
    { title: "Bedriftsavtale", price: "−10 %", desc: "10 % rabatt på all tannbehandling for dine ansatte. Ta kontakt for avtale." },
  ],
  financing: {
    title: "Fleksibel betaling",
    body: "God tannhelse skal ikke stå på vent på grunn av økonomien. Vi hjelper deg å finne en løsning som passer, og sørger for at du får den støtten du har krav på gjennom Helfo.",
    points: ["Direkteoppgjør med Helfo — du betaler kun egenandelen", "Mulighet for delbetaling ved større behandlinger", "Tydelig prisoverslag før behandlingen starter"],
  },
  gavekort: {
    title: "Gi et sunt smil i gave",
    body: "Et gavekort fra Fonna Tannklinikk er en omtenksom gave til noen du er glad i — enten det gjelder en tannrens, en blekebehandling eller et fritt beløp. Perfekt til deg som utsetter tannlegebesøket.",
    amount: "500 kr",
    cta: "Bestill gavekort",
  },
  tourist: {
    eyebrow: "Visiting Hardanger?",
    title: "Dental care for travellers in Rosendal",
    body: "Toothache far from home? Fonna Tannklinikk welcomes visitors to the Hardanger region every day, with short waiting times and English-speaking dentists. Whether it's an emergency or a check-up during your stay, we'll help you quickly — and get you back to enjoying the fjords.",
    cta: "Book an appointment",
  },
  rating: { value: "4,9", count: "Google-omtaler" },
  reviews: [
    { name: "Pasient i Rosendal", meta: "Google-omtale", text: "Rolig og profesjonell behandling, og de tok seg virkelig god tid. Endelig en tannlege i nærområdet!", stars: 5 },
    { name: "Pasient i Kvinnherad", meta: "Google-omtale", text: "Fikk akutt hjelp samme dag da det verket som verst. Utrolig god service og tydelig informasjon hele veien.", stars: 5 },
    { name: "Pasient i Hardanger", meta: "Google-omtale", text: "Trygt og hyggelig fra jeg kom inn døra. Hele familien går her nå.", stars: 5 },
  ],
  faqs: [
    { q: "Tar dere imot nye pasienter?", a: "Ja! Vi ønsker alltid nye pasienter velkommen. Du kan bestille time på nett eller ringe oss direkte." },
    { q: "Kan jeg få time raskt ved akutte tannproblemer?", a: "Ja. Vi setter av tid til akutte pasienter hver dag og har tannlegevakt på tilkalling. Ring oss tidlig på dagen." },
    { q: "Tilbyr dere usynlig regulering?", a: "Ja, vi har egen tannlege med spesialisering i usynlig regulering. Kom gjerne innom for en uforpliktende vurdering." },
    { q: "Har dere direkteoppgjør med Helfo?", a: "Ja, vi har direkteoppgjør i samarbeid med Helfo. Da betaler du kun egenandelen hos oss." },
    { q: "Hva koster en første undersøkelse?", a: "Din første konsultasjon inkludert røntgen og enkel rens koster 1 500 kr. Du får alltid et prisoverslag før videre behandling." },
  ],
  mapQuery: "Skalågato 13, 5470 Rosendal",
  bookLabel: "Bestill time",
  bookLead: "Fyll ut skjemaet, så tar vi kontakt for å bekrefte timen din.",
};

const HUSNES: DemoClinic = {
  slug: "husnestannklinikk",
  name: "Husnes Tannklinikk",
  short: "Husnes",
  group: "Fonna Tanngruppen",
  tagline: "Ny tannklinikk i Husnes Storsenter",
  heroTitle: "Moderne tannhelse kommer til Husnes",
  heroLede:
    "Vi åpner dørene i Husnes Storsenter med samme kompetanse og varme som Fonna Tannklinikk i Rosendal. Moderne utstyr, sentral plassering og god parkering.",
  intro:
    "Husnes Tannklinikk er søsterklinikken til Fonna Tannklinikk — del av Fonna Tanngruppen. Vi tar med oss samme team, samme moderne utstyr og samme pasientfokus til Sunnhordland.",
  region: "Husnes · Sunnhordland",
  address: "Husnes Storsenter, 5460 Husnes",
  phone: "919 24 774",
  phoneHref: "tel:+4791924774",
  email: "post@fonnatannklinikk.no",
  comingSoon: true,
  heroTrust: ["Del av Fonna Tanngruppen", "Splitter nytt utstyr", "Sentralt i Storsenteret"],
  heroImage: {
    src: "/demo/hero-clinic.jpg",
    alt: "Moderne tannbehandlingsrom med digital røntgen",
  },
  aboutImage: {
    src: "/demo/treatment.jpg",
    alt: "Tannlege med lupebriller utfører presis behandling",
  },
  touristImage: {
    src: "/demo/fjord.jpg",
    alt: "Norsk fjell- og fjordlandskap i Sunnhordland",
  },
  sister: {
    name: "Fonna Tannklinikk",
    href: "/demo/fonnatannklinikk",
    city: "Rosendal",
    blurb: "Vår etablerte klinikk i Rosendal — åpen alle dager siden 2021.",
  },
  social: {
    facebook: "https://www.facebook.com/Fonnatannklinikk/",
    instagram: "https://www.instagram.com/fonnatannklinikk",
  },
  theme: {
    brand: "#14507d",
    brandDark: "#0c2f4a",
    brandInk: "#123f61",
    brandSoft: "#e7f0f7",
    wash: "#f4f8fb",
    accent: "#2ea6a0",
    onBrand: "#ffffff",
    motif: "coast",
  },
  hours: [
    { day: "Mandag – fredag", time: "09:00 – 17:00", days: [1, 2, 3, 4, 5], open: 540, close: 1020 },
    { day: "Lørdag", time: "10:00 – 15:00", days: [6], open: 600, close: 900 },
    { day: "Søndag", time: "Stengt", days: [0], open: null, close: null },
  ],
  hoursNote: "Åpningstider ved oppstart. Tannlegevakt tilgjengelig på tilkalling.",
  usps: [
    { title: "Sentralt i Husnes Storsenter", desc: "Enkel adkomst og god parkering — midt i hjertet av Husnes.", icon: "pin" },
    { title: "Splitter nytt utstyr", desc: "3D-røntgen, digital skanning og moderne behandlingsrom fra dag én.", icon: "scan" },
    { title: "Del av Fonna Tanngruppen", desc: "Samme team og kompetanse som den etablerte klinikken i Rosendal.", icon: "heart" },
    { title: "Direkteoppgjør med Helfo", desc: "Direkteoppgjør med Helfo — du betaler kun egenandelen.", icon: "shield" },
  ],
  services: [
    { title: "Usynlig regulering", desc: "Diskré tannregulering med gjennomsiktige skinner, tilpasset deg.", icon: "aligner", featured: true },
    { title: "Tannimplantat", desc: "Varig erstatning for tapte tenner, planlagt digitalt.", icon: "implant", featured: true },
    { title: "Estetisk tannbehandling", desc: "Tannbleking og estetiske løsninger for et friskt smil.", icon: "sparkle", featured: true },
    { title: "Undersøkelse og rens", desc: "Grundig kontroll, røntgen og profesjonell tannrens.", icon: "check" },
    { title: "Kroner og broer", desc: "Skreddersydde løsninger som bygger opp igjen tannsettet.", icon: "crown" },
    { title: "Tannlegevakt", desc: "Akutt tannhjelp for Husnes og omland — raskt og trygt.", icon: "emergency" },
  ],
  process: [
    { title: "Meld interesse", desc: "Bli med på ventelisten, så gir vi deg beskjed når vi åpner." },
    { title: "Bestill time", desc: "Vi tar kontakt for å finne et tidspunkt som passer deg." },
    { title: "Undersøkelse og 3D-røntgen", desc: "Grundig kartlegging med moderne utstyr fra dag én." },
    { title: "Behandlingsplan", desc: "Tydelig plan med alternativer, tidsbruk og pris før vi starter." },
    { title: "Oppfølging", desc: "Fast oppfølging over tid, med samme faglige trygghet som hos Fonna." },
  ],
  team: [
    { role: "Tannlege", detail: "Usynlig regulering", initials: "UR" },
    { role: "Oralkirurg", detail: "Implantat og kirurgi", initials: "OK" },
    { role: "Tannlege", detail: "Allmenn tannbehandling", initials: "AT" },
    { role: "Resepsjon", detail: "Booking og pasientkontakt", initials: "RE" },
  ],
  teamNote:
    "Husnes Tannklinikk drives av det samme teamet som står bak Fonna Tannklinikk i Rosendal. Det betyr samme kompetanse, samme personlige oppfølging og samme trygghet — bare enda nærmere hjemmet ditt.",
  technology: [
    { title: "3D-røntgen", desc: "Digital røntgen med presis diagnostikk og lav stråledose.", icon: "scan" },
    { title: "Digital skanning", desc: "Intraoral skanner erstatter ubehagelige avtrykk.", icon: "sparkle" },
    { title: "Nytt behandlingsrom", desc: "En helt ny klinikk utstyrt for skånsom og effektiv behandling.", icon: "implant" },
  ],
  offers: [
    { title: "Åpningstilbud kommer", price: "Kommer snart", desc: "Meld deg på ventelisten nå, så er du blant de første som hører om åpningstilbudene våre.", highlight: true },
    { title: "Første undersøkelse", price: "1 500 kr", desc: "Din første konsultasjon inkludert røntgen og enkel rens." },
    { title: "Bedriftsavtale", price: "−10 %", desc: "10 % rabatt på all tannbehandling for dine ansatte." },
  ],
  financing: {
    title: "Fleksibel betaling",
    body: "Også på Husnes skal god tannhelse være tilgjengelig. Vi hjelper deg med Helfo-støtten du har krav på, og finner en betalingsløsning som passer.",
    points: ["Direkteoppgjør med Helfo — du betaler kun egenandelen", "Mulighet for delbetaling ved større behandlinger", "Tydelig prisoverslag før behandlingen starter"],
  },
  gavekort: {
    title: "Gi et sunt smil i gave",
    body: "Gavekort fra Husnes Tannklinikk blir tilgjengelig ved åpning, og kan brukes på all behandling ved begge klinikkene i Fonna Tanngruppen.",
    amount: "500 kr",
    cta: "Bestill gavekort",
  },
  tourist: {
    eyebrow: "Visiting Sunnhordland?",
    title: "A modern dental clinic coming to Husnes",
    body: "Husnes Tannklinikk — the new sister clinic of Fonna Tannklinikk — opens soon at Husnes Storsenter, part of Fonna Tanngruppen. Modern equipment, central location and easy parking, with English-speaking dentists. Join our waiting list to be first in line.",
    cta: "Join the waiting list",
  },
  rating: { value: "Ny", count: "Fonna Tanngruppen" },
  reviews: [
    { name: "Pasient i Husnes", meta: "Venteliste", text: "Gleder meg til å slippe å reise langt til tannlegen — endelig en moderne klinikk på Husnes.", stars: 5 },
    { name: "Pasient i Sunnhordland", meta: "Søsterklinikk", text: "Har gått hos Fonna i Rosendal og er veldig fornøyd. Trygt å vite at det er samme team som kommer hit.", stars: 5 },
  ],
  faqs: [
    { q: "Når åpner klinikken?", a: "Vi åpner snart på Husnes Storsenter. Meld deg på ventelisten, så gir vi deg beskjed med en gang du kan bestille time." },
    { q: "Kan jeg bestille time nå?", a: "Du kan melde interesse allerede nå via skjemaet. Vi tar kontakt for å booke time så snart vi åpner." },
    { q: "Er dette samme klinikk som Fonna i Rosendal?", a: "Ja — Husnes Tannklinikk er søsterklinikken til Fonna Tannklinikk, del av Fonna Tanngruppen, med samme team og kompetanse." },
    { q: "Får jeg direkteoppgjør med Helfo her også?", a: "Ja. Som en del av Fonna Tanngruppen tilbyr vi direkteoppgjør med Helfo, slik at du kun betaler egenandelen." },
  ],
  mapQuery: "Husnes Storsenter, 5460 Husnes",
  bookLabel: "Meld interesse",
  bookLead: "Registrer deg på ventelisten, så tar vi kontakt når vi åpner.",
};

export const demoClinics: DemoClinic[] = [FONNA, HUSNES];

export function getDemoClinic(slug: string): DemoClinic | undefined {
  return demoClinics.find((c) => c.slug === slug);
}

export function demoSlugs(): string[] {
  return demoClinics.map((c) => c.slug);
}
