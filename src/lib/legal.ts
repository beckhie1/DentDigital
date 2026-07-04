export interface LegalSection {
  heading: { no: string; en: string };
  paragraphs: { no: string[]; en: string[] };
}

export interface LegalDoc {
  title: { no: string; en: string };
  updated: string;
  intro: { no: string; en: string };
  sections: LegalSection[];
}

export const personvern: LegalDoc = {
  title: { no: "Personvernerklæring", en: "Privacy Policy" },
  updated: "2026-07-04",
  intro: {
    no: "Denne erklæringen beskriver hvordan DentDigital AS (org. behandlingsansvarlig, Rødtvetveien 5, 0955 Oslo) samler inn og behandler personopplysninger på dentdigital.no, i tråd med personvernforordningen (GDPR) og personopplysningsloven.",
    en: "This policy describes how DentDigital AS (data controller, Rødtvetveien 5, 0955 Oslo) collects and processes personal data on dentdigital.no, in accordance with the GDPR and the Norwegian Personal Data Act.",
  },
  sections: [
    {
      heading: { no: "Hvilke opplysninger vi behandler", en: "What data we process" },
      paragraphs: {
        no: [
          "Kontaktskjema: navn, e-postadresse, telefonnummer, klinikknavn og innholdet i meldingen din. Opplysningene brukes utelukkende til å besvare henvendelsen.",
          "Nettsiden setter ingen sporingscookies uten samtykke. Språkvalg og samtykkevalg lagres lokalt i nettleseren din (localStorage) og sendes ikke til oss.",
        ],
        en: [
          "Contact form: name, email address, phone number, clinic name and the content of your message. The data is used solely to respond to your inquiry.",
          "The website sets no tracking cookies without consent. Language and consent choices are stored locally in your browser (localStorage) and are not sent to us.",
        ],
      },
    },
    {
      heading: { no: "Behandlingsgrunnlag", en: "Legal basis" },
      paragraphs: {
        no: [
          "Behandlingen av henvendelser skjer på grunnlag av berettiget interesse (GDPR art. 6 nr. 1 f) – å besvare henvendelser du selv sender oss. Eventuell videre dialog om kundeforhold baseres på avtale (art. 6 nr. 1 b).",
        ],
        en: [
          "Inquiries are processed on the basis of legitimate interest (GDPR Art. 6(1)(f)) – responding to inquiries you send us. Any further dialogue regarding a customer relationship is based on contract (Art. 6(1)(b)).",
        ],
      },
    },
    {
      heading: { no: "Databehandlere og lagring", en: "Processors and storage" },
      paragraphs: {
        no: [
          "Nettsiden driftes på Vercel, og e-post fra kontaktskjemaet sendes via Resend. Begge er underlagt databehandleravtaler med EU-standardklausuler.",
          "Henvendelser lagres i vår e-post så lenge det er nødvendig for å følge opp saken, og slettes senest etter 24 måneder med mindre et kundeforhold er etablert.",
        ],
        en: [
          "The website is hosted on Vercel, and contact form email is sent via Resend. Both operate under data processing agreements with EU standard contractual clauses.",
          "Inquiries are stored in our email for as long as necessary to follow up, and deleted no later than 24 months unless a customer relationship has been established.",
        ],
      },
    },
    {
      heading: { no: "Dine rettigheter", en: "Your rights" },
      paragraphs: {
        no: [
          "Du har rett til innsyn, retting, sletting, begrensning og dataportabilitet, samt rett til å protestere mot behandlingen. Kontakt oss på post@dentdigital.no for å utøve rettighetene dine.",
          "Du kan også klage til Datatilsynet (datatilsynet.no) dersom du mener behandlingen er i strid med regelverket.",
        ],
        en: [
          "You have the right to access, rectification, erasure, restriction and data portability, as well as the right to object to processing. Contact us at post@dentdigital.no to exercise your rights.",
          "You may also lodge a complaint with the Norwegian Data Protection Authority (datatilsynet.no) if you believe the processing violates the law.",
        ],
      },
    },
  ],
};

export const vilkar: LegalDoc = {
  title: { no: "Vilkår for bruk", en: "Terms of Use" },
  updated: "2026-07-04",
  intro: {
    no: "Disse vilkårene gjelder for bruk av nettsiden dentdigital.no, som drives av DentDigital AS. Vilkår for kjøp av tjenester reguleres av egen tjenesteavtale.",
    en: "These terms govern the use of dentdigital.no, operated by DentDigital AS. Terms for purchasing services are governed by a separate service agreement.",
  },
  sections: [
    {
      heading: { no: "Innhold og ansvar", en: "Content and liability" },
      paragraphs: {
        no: [
          "Innholdet på nettsiden, inkludert fagartikler, er generell informasjon og utgjør ikke juridisk, medisinsk eller teknisk rådgivning for din konkrete situasjon. Vi tilstreber at innholdet er korrekt og oppdatert, men gir ingen garantier.",
          "DentDigital AS er ikke ansvarlig for tap som følge av bruk av informasjonen på nettsiden, eller for innhold på tredjeparts nettsteder det lenkes til.",
        ],
        en: [
          "The content on this website, including articles, is general information and does not constitute legal, medical or technical advice for your specific situation. We strive to keep content accurate and up to date, but provide no guarantees.",
          "DentDigital AS is not liable for losses resulting from use of the information on this website, or for content on linked third-party websites.",
        ],
      },
    },
    {
      heading: { no: "Immaterielle rettigheter", en: "Intellectual property" },
      paragraphs: {
        no: [
          "Alt innhold på nettsiden – tekst, grafikk, logo og kode – tilhører DentDigital AS med mindre annet er angitt, og kan ikke gjengis uten skriftlig samtykke, utover sitatretten etter åndsverkloven.",
        ],
        en: [
          "All content on this website – text, graphics, logo and code – belongs to DentDigital AS unless otherwise stated, and may not be reproduced without written consent beyond statutory quotation rights.",
        ],
      },
    },
    {
      heading: { no: "Lovvalg og verneting", en: "Governing law and venue" },
      paragraphs: {
        no: [
          "Disse vilkårene er underlagt norsk rett. Eventuelle tvister behandles av norske domstoler med Oslo tingrett som verneting.",
        ],
        en: [
          "These terms are governed by Norwegian law. Any disputes shall be handled by Norwegian courts with Oslo District Court as legal venue.",
        ],
      },
    },
  ],
};

export const cookiesDoc: LegalDoc = {
  title: { no: "Informasjonskapsler (cookies)", en: "Cookies" },
  updated: "2026-07-04",
  intro: {
    no: "Denne siden forklarer hvordan dentdigital.no bruker informasjonskapsler og lokal lagring, i tråd med ekomloven § 2-7b og GDPR.",
    en: "This page explains how dentdigital.no uses cookies and local storage, in accordance with the Norwegian Electronic Communications Act § 2-7b and the GDPR.",
  },
  sections: [
    {
      heading: { no: "Hva vi bruker i dag", en: "What we use today" },
      paragraphs: {
        no: [
          "Nettsiden setter i dag ingen sporings- eller markedsføringscookies. Vi bruker kun lokal lagring (localStorage) til to formål: å huske språkvalget ditt (norsk/engelsk) og å huske samtykkevalget ditt. Disse er strengt nødvendige, sendes aldri til oss, og krever ikke samtykke.",
        ],
        en: [
          "The website currently sets no tracking or marketing cookies. We only use local storage (localStorage) for two purposes: remembering your language choice (Norwegian/English) and remembering your consent choice. These are strictly necessary, are never sent to us, and do not require consent.",
        ],
      },
    },
    {
      heading: { no: "Fremtidig analyse", en: "Future analytics" },
      paragraphs: {
        no: [
          "Dersom vi tar i bruk analyseverktøy, vil det kun aktiveres for besøkende som har valgt «Godta alle» i samtykkebanneret. Du kan når som helst endre valget ditt ved å slette nettleserdata for dentdigital.no.",
        ],
        en: [
          "If we adopt analytics tools, they will only be activated for visitors who selected 'Accept all' in the consent banner. You can change your choice at any time by clearing browser data for dentdigital.no.",
        ],
      },
    },
    {
      heading: { no: "Administrere lagring", en: "Managing storage" },
      paragraphs: {
        no: [
          "Du kan slette eller blokkere informasjonskapsler og lokal lagring i nettleserens innstillinger. Merk at språk- og samtykkevalg da nullstilles.",
        ],
        en: [
          "You can delete or block cookies and local storage in your browser settings. Note that language and consent choices will then be reset.",
        ],
      },
    },
  ],
};
