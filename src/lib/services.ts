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
    image: "/digital-dental-partnership.png",
    title: {
      no: "Digital Partner for Tannklinikker",
      en: "Digital Partner for Dental Clinics",
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
    slug: "nettsideutvikling",
    icon: "🌐",
    image: "/dental-website-marketing.png",
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
        "Tilpasset Innhold: Pasientorientert tekst og bilder.",
        "Responsivt design (Next.js, React).",
        "Integrasjon med bookingverktøy.",
        "Lokal SEO for bedre synlighet på Google.",
      ],
      en: [
        "UI/UX Design: User-friendly design for mobile and desktop.",
        "Tailored content: Patient-oriented text and images.",
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
    image: "/it-support-dental.png",
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
      no: "Opus Programvare og Integrasjon",
      en: "Opus Software and Integration",
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
    image: "/dental-software-dashboard.png",
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
        "E-postkampanjer: Informasjon om tannbleking, barnetannpleie, etc.",
        "Online Booking: Integrert kalender med direkte pasientbestilling.",
        "Automatiserte oppfølginger etter behandling.",
        "Pasientportal for enkel kommunikasjon og dokumentdeling.",
      ],
      en: [
        "SMS reminders: Automatic notifications for appointments and follow-ups.",
        "Email campaigns: Information about whitening, pediatric care, etc.",
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
    image: "/dental-software-dashboard.png",
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
        "Lagerstyring: Automatisk bestilling av tannlegeutstyr og materialer.",
        "API-integrasjoner: Kobling mellom faktureringssystemer og journalsystemer.",
        "Arbeidsflytautomatisering for repetitive oppgaver.",
        "Tilpassede rapporter og analyser.",
      ],
      en: [
        "Custom forms: Digitalization of patient surveys.",
        "Inventory management: Automatic ordering of dental equipment and materials.",
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
    image: "/dental-technology-team.png",
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
