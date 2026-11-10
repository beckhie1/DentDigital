export interface Service {
  slug: string;
  icon: string;
  image: string;
  title: { no: string; en: string };
  short: { no: string; en: string };
  tagline: { no: string; en: string };
  features: { no: string[]; en: string[] };
  cta: { no: string; en: string };
  featured: boolean;
}

export const services: Service[] = [
  {
    slug: "digital-partner",
    icon: "🤝",
    image: "/img/partner.svg",
    title: {
      no: "Digital Partner for Helseklinikker",
      en: "Digital Partner for Health Clinics",
    },
    short: {
      no: "Vi integrerer oss i din praksis som en forlengelse av teamet ditt – fra IT til markedsføring.",
      en: "We integrate into your practice as an extension of your team – from IT to marketing.",
    },
    tagline: {
      no: "Vi integrerer oss i din praksis som en forlengelse av teamet ditt.",
      en: "We integrate into your practice as an extension of your team.",
    },
    features: {
      no: [
        "Helhetlig digital strategi for din klinikk.",
        "Månedlige møter med dedikert kontaktperson.",
        "Kontinuerlig oppfølging og optimalisering.",
        "Prioritert support og rådgivning.",
        "Skreddersydde løsninger basert på dine behov.",
      ],
      en: [
        "Holistic digital strategy for your clinic.",
        "Monthly meetings with a dedicated contact person.",
        "Continuous follow-up and optimization.",
        "Priority support and advisory.",
        "Tailored solutions based on your needs.",
      ],
    },
    cta: {
      no: "Bli vår digitale partner",
      en: "Become our digital partner",
    },
    featured: true,
  },
  {
    slug: "annonsering",
    icon: "📈",
    image: "/img/ads.svg",
    title: {
      no: "Google- og Meta-annonser",
      en: "Google and Meta Advertising",
    },
    short: {
      no: "Målrettet annonsering som fyller timeboken – målt på bookede timer, ikke klikk.",
      en: "Targeted advertising that fills your appointment book – measured on booked appointments, not clicks.",
    },
    tagline: {
      no: "Flere nye pasienter og kunder til en kostnad du kan måle.",
      en: "More new patients and customers at a cost you can measure.",
    },
    features: {
      no: [
        "Google Ads og Meta-annonser målrettet mot folk som søker behandling i ditt område.",
        "Sporing av henvendelser og bookinger, slik at du vet hva en ny pasient koster.",
        "Egne landingssider bygget for timebestilling.",
        "Løpende optimalisering og månedlig rapportering.",
        "Tilpasset kliniktype: tannlege, fysioterapi, kiropraktikk, hudpleie og flere.",
      ],
      en: [
        "Google Ads and Meta ads targeted at people searching for treatment in your area.",
        "Tracking of enquiries and bookings, so you know what a new patient costs.",
        "Dedicated landing pages built for appointment booking.",
        "Continuous optimization and monthly reporting.",
        "Adapted to your clinic type: dental, physiotherapy, chiropractic, skin care and more.",
      ],
    },
    cta: {
      no: "Få flere pasienter – book en prat",
      en: "Get more patients – book a call",
    },
    featured: true,
  },
  {
    slug: "innhold-sosiale-medier",
    icon: "🎬",
    image: "/img/content.svg",
    title: {
      no: "Reels, bilder og automatisk posting",
      en: "Reels, Photos and Automatic Posting",
    },
    short: {
      no: "Profesjonelle reels og bilder i toppkvalitet, publisert automatisk i sosiale medier.",
      en: "Professional top-quality reels and photos, published automatically on social media.",
    },
    tagline: {
      no: "Vær synlig hver uke uten å løfte en finger.",
      en: "Stay visible every week without lifting a finger.",
    },
    features: {
      no: [
        "Reels og foto i toppkvalitet: Profesjonelt innhold av klinikken, behandlinger og team – ferdig redigert.",
        "Fast ukeplan: Innholdet planlegges og publiseres automatisk på Instagram, Facebook og TikTok.",
        "Innhold tilpasset din kliniktype og målgruppe.",
        "Gjenbruk av innholdet i annonser og på nettsiden.",
        "Månedlig oversikt over rekkevidde og engasjement.",
      ],
      en: [
        "Top-quality reels and photos: Professional content of your clinic, treatments and team – fully edited.",
        "Fixed weekly schedule: Content is planned and published automatically on Instagram, Facebook and TikTok.",
        "Content tailored to your clinic type and target audience.",
        "Reuse of the content in ads and on your website.",
        "Monthly overview of reach and engagement.",
      ],
    },
    cta: {
      no: "Se hvordan vi lager innhold",
      en: "See how we create content",
    },
    featured: true,
  },
  {
    slug: "nettsideutvikling",
    icon: "🌐",
    image: "/img/website.svg",
    title: {
      no: "Nettsideutvikling og SEO",
      en: "Website Development and SEO",
    },
    short: {
      no: "Profesjonelle nettsider som konverterer besøkende til pasienter med målrettet lokal SEO.",
      en: "Professional websites that convert visitors into patients with targeted local SEO.",
    },
    tagline: {
      no: "Profesjonelle nettsider som konverterer besøkende til pasienter.",
      en: "Professional websites that convert visitors into patients.",
    },
    features: {
      no: [
        "UI/UX Design: Brukervennlig design for mobil og desktop.",
        "Tilpasset Innhold: Pasient- og kundeorientert tekst og bilder.",
        "Responsivt design (Next.js, React).",
        "Integrasjon med bookingverktøy.",
        "Lokal SEO for bedre synlighet på Google.",
      ],
      en: [
        "UI/UX Design: User-friendly design for mobile and desktop.",
        "Tailored content: Patient- and customer-oriented text and images.",
        "Responsive design (Next.js, React).",
        "Integration with booking tools.",
        "Local SEO for better visibility on Google.",
      ],
    },
    cta: {
      no: "Se våre nettstedseksempler",
      en: "See our website examples",
    },
    featured: true,
  },
  {
    slug: "it-infrastruktur",
    icon: "🖥️",
    image: "/img/it.svg",
    title: {
      no: "IT-infrastruktur og Support",
      en: "IT Infrastructure and Support",
    },
    short: {
      no: "Trygg og stabil IT for din klinikk med oppsett av maskinvare, nettverk og rask feilsøking.",
      en: "Safe and stable IT for your clinic with hardware setup, networking and fast troubleshooting.",
    },
    tagline: {
      no: "Sømløs IT for en stressfri praksis.",
      en: "Seamless IT for a stress-free practice.",
    },
    features: {
      no: [
        "Maskinvare: Oppsett av PCer, skannere og servere.",
        "Nettverk: Sikker trådløs tilkobling med Cisco/Meraki-utstyr.",
        "Feilsøking: Rask hjelp ved nedetid eller programvarefeil.",
        "IT-bestillinger: Levering og installasjon av utstyr.",
        "Proaktiv overvåking for å forhindre problemer.",
      ],
      en: [
        "Hardware: Setup of PCs, scanners and servers.",
        "Network: Secure wireless connectivity with Cisco/Meraki equipment.",
        "Troubleshooting: Fast help during downtime or software errors.",
        "IT procurement: Delivery and installation of equipment.",
        "Proactive monitoring to prevent problems.",
      ],
    },
    cta: {
      no: "Behov for akutt IT-support? Ring oss nå",
      en: "Need urgent IT support? Call us now",
    },
    featured: true,
  },
  {
    slug: "opus-programvare",
    icon: "🦷",
    image: "/dental-imaging-software.png",
    title: {
      no: "Opus Programvare og Integrasjon (tannklinikker)",
      en: "Opus Software and Integration (dental clinics)",
    },
    short: {
      no: "Maksimer effektiviteten av bildediagnostikkverktøy med oppsett, integrasjon og opplæring.",
      en: "Maximize the efficiency of imaging diagnostics tools with setup, integration and training.",
    },
    tagline: {
      no: "Maksimer effektiviteten av bildediagnostikkverktøy.",
      en: "Maximize the efficiency of imaging diagnostics tools.",
    },
    features: {
      no: [
        "Konfigurasjon: Oppsett av Opus for CBCT-skanning, 3D-modellering.",
        "Integrasjon: Kobling til DIPS, Tannlegen eller andre journalsystemer.",
        "Opplæring: På-site eller virtuell opplæring i Opus for personalet.",
        "Vedlikehold: Automatiske programvareoppdateringer og sikkerhetspatcher.",
        "Optimalisering for raskere arbeidsflyt.",
      ],
      en: [
        "Configuration: Setup of Opus for CBCT scanning, 3D modeling.",
        "Integration: Connection to DIPS, Tannlegen or other record systems.",
        "Training: On-site or virtual Opus training for staff.",
        "Maintenance: Automatic software updates and security patches.",
        "Optimization for faster workflows.",
      ],
    },
    cta: {
      no: "Spar tid med smartere diagnostikk",
      en: "Save time with smarter diagnostics",
    },
    featured: true,
  },
  {
    slug: "sikkerhetskopi-sky",
    icon: "☁️",
    image: "/cloud-backup-security.png",
    title: {
      no: "Sikkerhetskopi og Skyløsninger",
      en: "Backup and Cloud Solutions",
    },
    short: {
      no: "GDPR-kompatibel datalagring i Norge med automatisk sikkerhetskopiering og rask gjenoppretting.",
      en: "GDPR-compliant data storage in Norway with automatic backup and fast recovery.",
    },
    tagline: {
      no: "Dataene dine er trygge – nå og i fremtiden.",
      en: "Your data is safe – now and in the future.",
    },
    features: {
      no: [
        "Hybrid Sikkerhetskopiering: Daglig backup til lokal NAS + Microsoft Azure-sky.",
        "GDPR-kompatibilitet: Data lagret i Norge/EU.",
        "Gjenoppretting: Nødplan for rask gjenoppretting ved ransomware-angrep.",
        "Automatisert backup-testing for å sikre dataintegritet.",
        "Kryptert datalagring for maksimal sikkerhet.",
      ],
      en: [
        "Hybrid backup: Daily backup to local NAS + Microsoft Azure cloud.",
        "GDPR compliance: Data stored in Norway/EU.",
        "Recovery: Emergency plan for fast recovery after ransomware attacks.",
        "Automated backup testing to ensure data integrity.",
        "Encrypted data storage for maximum security.",
      ],
    },
    cta: {
      no: "Test vår gratis backup i 14 dager",
      en: "Test our free backup for 14 days",
    },
    featured: true,
  },
  {
    slug: "datadrevet-innsikt",
    icon: "📊",
    image: "/img/dashboard.svg",
    title: {
      no: "Datadrevet Innsikt og Analyse",
      en: "Data-Driven Insight and Analytics",
    },
    short: {
      no: "Overvåk nøkkeltall som timeutnyttelse, pasienttilfredshet og inntekter med tilpassede dashboards.",
      en: "Monitor key metrics like appointment utilization, patient satisfaction and revenue with custom dashboards.",
    },
    tagline: {
      no: "Gjør tallene til din konkurransefordel.",
      en: "Turn the numbers into your competitive advantage.",
    },
    features: {
      no: [
        "Dashboard: Overvåk nøkkeltall som timeutnyttelse og pasienttilfredshet.",
        "Rapportering: Månedlige analyser med anbefalinger.",
        "Pasientatferd: Identifiser trender i avlysninger eller behandlinger.",
        "Inntektsanalyse: Forstå hvilke behandlinger som gir best lønnsomhet.",
        "Prediktiv analyse for å forutse fremtidige trender.",
      ],
      en: [
        "Dashboard: Monitor key metrics like utilization and patient satisfaction.",
        "Reporting: Monthly analyses with recommendations.",
        "Patient behavior: Identify trends in cancellations or treatments.",
        "Revenue analysis: Understand which treatments are most profitable.",
        "Predictive analytics to anticipate future trends.",
      ],
    },
    cta: {
      no: "Se hvordan data kan forvandle din praksis",
      en: "See how data can transform your practice",
    },
    featured: true,
  },
  {
    slug: "personvern-gdpr",
    icon: "🔒",
    image: "/gdpr-compliance.png",
    title: {
      no: "Personvern og GDPR-sikkerhet",
      en: "Privacy and GDPR Security",
    },
    short: {
      no: "Fullt samsvar med norske og europeiske reguleringer.",
      en: "Full compliance with Norwegian and European regulations.",
    },
    tagline: {
      no: "Fullt samsvar med norske og europeiske reguleringer.",
      en: "Full compliance with Norwegian and European regulations.",
    },
    features: {
      no: [
        "Risikovurderinger: Kartlegging av datastrømmer og sårbarheter.",
        "GDPR-dokumentasjon: Hjelp med personvernserklæringer.",
        "Sikkerhetsopplæring: Kurs for ansatte i datasikkerhet.",
        "Sikkerhetstesting: Regelmessig testing av systemsikkerhet.",
        "Kontinuerlig oppdatering i tråd med nye reguleringer.",
      ],
      en: [
        "Risk assessments: Mapping of data flows and vulnerabilities.",
        "GDPR documentation: Help with privacy statements.",
        "Security training: Data security courses for staff.",
        "Security testing: Regular testing of system security.",
        "Continuous updates in line with new regulations.",
      ],
    },
    cta: {
      no: "Unngå bøter – Sjekk GDPR-status",
      en: "Avoid fines – Check GDPR status",
    },
    featured: false,
  },
  {
    slug: "pasientkommunikasjon",
    icon: "💬",
    image: "/digital-patient-experience.png",
    title: {
      no: "Pasientkommunikasjon",
      en: "Patient Communication",
    },
    short: {
      no: "Automatiser og forbedre kommunikasjonen med pasientene.",
      en: "Automate and improve communication with patients.",
    },
    tagline: {
      no: "Automatiser og forbedre kommunikasjonen med pasientene.",
      en: "Automate and improve communication with patients.",
    },
    features: {
      no: [
        "SMS-påminnelser: Automatiske varsler for avtaler og etterkontroller.",
        "E-postkampanjer: Informasjon om behandlinger, kampanjer og nyheter.",
        "Online Booking: Integrert kalender med direkte pasientbestilling.",
        "Automatiserte oppfølginger etter behandling.",
        "Pasientportal for enkel kommunikasjon og dokumentdeling.",
      ],
      en: [
        "SMS reminders: Automatic notifications for appointments and follow-ups.",
        "Email campaigns: Information about treatments, campaigns and news.",
        "Online booking: Integrated calendar with direct patient booking.",
        "Automated follow-ups after treatment.",
        "Patient portal for easy communication and document sharing.",
      ],
    },
    cta: {
      no: "Reduser ikke-møtte pasienter med 30%",
      en: "Reduce patient no-shows by 30%",
    },
    featured: false,
  },
  {
    slug: "skreddersydde-systemer",
    icon: "⚙️",
    image: "/img/dashboard.svg",
    title: {
      no: "Skreddersydde Programvaresystemer",
      en: "Custom Software Systems",
    },
    short: {
      no: "Tilpassede verktøy for din praksis.",
      en: "Custom tools for your practice.",
    },
    tagline: {
      no: "Tilpassede verktøy for din praksis.",
      en: "Custom tools for your practice.",
    },
    features: {
      no: [
        "Tilpassede Skjemaer: Digitalisering av pasientundersøkelser.",
        "Lagerstyring: Automatisk bestilling av utstyr og forbruksmateriell.",
        "API-integrasjoner: Kobling mellom faktureringssystemer og journalsystemer.",
        "Arbeidsflytautomatisering for repetitive oppgaver.",
        "Tilpassede rapporter og analyser.",
      ],
      en: [
        "Custom forms: Digitalization of patient surveys.",
        "Inventory management: Automatic ordering of equipment and consumables.",
        "API integrations: Connecting billing systems and record systems.",
        "Workflow automation for repetitive tasks.",
        "Custom reports and analytics.",
      ],
    },
    cta: {
      no: "Spesiallaget programvare for din klinikk",
      en: "Custom-built software for your clinic",
    },
    featured: false,
  },
  {
    slug: "kurs-kompetanse",
    icon: "🎓",
    image: "/img/team.svg",
    title: {
      no: "Kurs og Kompetanseutvikling",
      en: "Courses and Competence Development",
    },
    short: {
      no: "Hold teamet ditt oppdatert på ny teknologi.",
      en: "Keep your team updated on new technology.",
    },
    tagline: {
      no: "Hold teamet ditt oppdatert på ny teknologi.",
      en: "Keep your team updated on new technology.",
    },
    features: {
      no: [
        "Opus-opplæring: Grunnleggende og avanserte kurs.",
        "GDPR-sertifisering: Kurs i personvern for helsepersonell.",
        "IT-sikkerhet: Praktiske økter i phishing-beskyttelse.",
        "Digitale verktøy: Opplæring i Office 365 og samarbeidsverktøy.",
        "Skreddersydde kurs basert på klinikkens behov.",
      ],
      en: [
        "Opus training: Basic and advanced courses.",
        "GDPR certification: Privacy courses for healthcare personnel.",
        "IT security: Practical sessions in phishing protection.",
        "Digital tools: Training in Office 365 and collaboration tools.",
        "Tailored courses based on your clinic's needs.",
      ],
    },
    cta: {
      no: "Book et kurs for ditt team",
      en: "Book a course for your team",
    },
    featured: false,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
