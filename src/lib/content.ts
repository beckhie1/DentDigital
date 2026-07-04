export type Localized<T = string> = { no: T; en: T };

export const ui = {
  nav: {
    home: { no: "Hjem", en: "Home" },
    services: { no: "Tjenester", en: "Services" },
    results: { no: "Resultater", en: "Results" },
    about: { no: "Om Oss", en: "About Us" },
    articles: { no: "Fagartikler", en: "Articles" },
    ai: { no: "AI", en: "AI" },
    contact: { no: "Kontakt", en: "Contact" },
    contactCta: { no: "Kontakt Oss", en: "Contact Us" },
    bookCta: { no: "Book gratis behovsanalyse", en: "Book a free needs analysis" },
  },
  consent: {
    text: {
      no: "Vi bruker kun nødvendige informasjonskapsler for at nettsiden skal fungere. Ingen sporing uten ditt samtykke.",
      en: "We only use necessary cookies for the website to function. No tracking without your consent.",
    },
    accept: { no: "Godta alle", en: "Accept all" },
    necessary: { no: "Kun nødvendige", en: "Necessary only" },
    more: { no: "Les mer", en: "Read more" },
  },
  footer: {
    blurb: {
      no: "Vi er din digitale partner som forstår de unike behovene til norske tannklinikker – både teknologisk og regulativt.",
      en: "We are your digital partner who understands the unique needs of Norwegian dental clinics – both technologically and regulatorily.",
    },
    ctaLine: {
      no: "Klar for å digitalisere klinikken?",
      en: "Ready to digitalize your clinic?",
    },
    quickLinks: { no: "Hurtiglenker", en: "Quick Links" },
    servicesCol: { no: "Tjenester", en: "Services" },
    contactCol: { no: "Kontakt Oss", en: "Contact Us" },
    rights: {
      no: "Alle rettigheter reservert.",
      en: "All rights reserved.",
    },
    privacy: { no: "Personvern", en: "Privacy" },
    terms: { no: "Vilkår", en: "Terms" },
    cookies: { no: "Cookies", en: "Cookies" },
    address: { no: "Rødtvetveien 5, 0955 Oslo", en: "Rødtvetveien 5, 0955 Oslo" },
  },
  common: {
    readMore: { no: "Les Mer", en: "Read More" },
    seeAllServices: { no: "Se Alle Tjenester", en: "See All Services" },
    seeAllArticles: { no: "Se Alle Fagartikler", en: "See All Articles" },
    explore: { no: "Utforsk Løsningen", en: "Explore the Solution" },
    startToday: {
      no: "Start Din Digitalisering i Dag",
      en: "Start Your Digitalization Today",
    },
    exploreServices: { no: "Utforsk Tjenester", en: "Explore Services" },
  },
  home: {
    badge: {
      no: "#1 Digital Partner for Tannklinikker",
      en: "#1 Digital Partner for Dental Clinics",
    },
    heroTitle: {
      no: "Digitalt Partnerskap for Norske Tannklinikker",
      en: "Digital Partnership for Norwegian Dental Clinics",
    },
    heroSub: {
      no: "Skreddersydde IT-løsninger, markedsføring og teknologisupport som hjelper tannklinikker å vokse, effektivisere og levere bedre pasientopplevelser.",
      en: "Tailored IT solutions, marketing and technology support that help dental clinics grow, streamline and deliver better patient experiences.",
    },
    heroPoints: {
      no: [
        "Spesialister på IT og digitalisering for norske tannklinikker",
        "24/7 support og personlig tilpassede løsninger",
        "GDPR- og Personvernsikre systemer",
      ],
      en: [
        "Specialists in IT and digitalization for Norwegian dental clinics",
        "24/7 support and personally tailored solutions",
        "GDPR- and privacy-compliant systems",
      ],
    },
    heroStat: {
      no: "fornøyde tannklinikker i Norge",
      en: "satisfied dental clinics in Norway",
    },
    servicesKicker: { no: "Våre Tjenester", en: "Our Services" },
    servicesTitle: {
      no: "Komplette Digitale Løsninger",
      en: "Complete Digital Solutions",
    },
    servicesSub: {
      no: "Vi tilbyr et bredt spekter av digitale tjenester skreddersydd for tannklinikker i Norge.",
      en: "We offer a wide range of digital services tailored for dental clinics in Norway.",
    },
    statsKicker: { no: "Våre Resultater", en: "Our Results" },
    statsTitle: {
      no: "Tall som taler for seg selv",
      en: "Numbers that speak for themselves",
    },
    statsSub: {
      no: "Vi leverer målbare resultater for tannklinikker over hele Norge",
      en: "We deliver measurable results for dental clinics all over Norway",
    },
    stats: {
      no: [
        { value: "50+", label: "Klinikker", desc: "Betjener over 50 tannklinikker i Norge" },
        { value: "24/7", label: "Support", desc: "Teknisk støtte tilgjengelig døgnet rundt" },
        { value: "100%", label: "GDPR-Kompatibel", desc: "Alle løsninger følger personvernforordningen" },
        { value: "5+", label: "Års Erfaring", desc: "Spesialisert på tannhelsesektoren" },
      ],
      en: [
        { value: "50+", label: "Clinics", desc: "Serving over 50 dental clinics in Norway" },
        { value: "24/7", label: "Support", desc: "Technical support available around the clock" },
        { value: "100%", label: "GDPR Compliant", desc: "All solutions follow the privacy regulation" },
        { value: "5+", label: "Years of Experience", desc: "Specialized in the dental health sector" },
      ],
    },
    whyKicker: { no: "Hvorfor Velge Oss", en: "Why Choose Us" },
    whyTitle: {
      no: "Din Digitale Partner for Fremtiden",
      en: "Your Digital Partner for the Future",
    },
    whySub: {
      no: "Vi integrerer oss i din praksis som en forlengelse av teamet ditt – fra IT til markedsføring.",
      en: "We integrate into your practice as an extension of your team – from IT to marketing.",
    },
    whyPoints: {
      no: [
        { title: "Spesialister på IT for tannklinikker", desc: "Vi forstår de unike behovene til norske tannklinikker og leverer skreddersydde digitale løsninger som oppfyller alle regulatoriske krav." },
        { title: "24/7 support og personlig service", desc: "Vår dedikerte supporttjeneste er tilgjengelig døgnet rundt for å sikre at din klinikk alltid har den tekniske støtten den trenger." },
        { title: "GDPR- og Personvernsikre systemer", desc: "Alle våre løsninger er utviklet med personvern i fokus og oppfyller kravene fra både GDPR og Helsedirektoratet." },
        { title: "Tidsbesparende løsninger", desc: "Våre digitale verktøy automatiserer rutineoppgaver og frigjør verdifull tid som kan brukes på pasientbehandling." },
        { title: "Basert i Oslo – kunder i hele Norge", desc: "Vi jobber fjernstyrt og på stedet, med rask responstid og personlig oppfølging uansett hvor klinikken din ligger." },
        { title: "Dokumenterte resultater", desc: "Våre kunder rapporterer i gjennomsnitt 30% økt effektivitet og 20% vekst etter implementering av våre løsninger." },
      ],
      en: [
        { title: "IT specialists for dental clinics", desc: "We understand the unique needs of Norwegian dental clinics and deliver tailored digital solutions that meet all regulatory requirements." },
        { title: "24/7 support and personal service", desc: "Our dedicated support team is available around the clock to ensure your clinic always has the technical support it needs." },
        { title: "GDPR- and privacy-compliant systems", desc: "All our solutions are built with privacy in focus and meet the requirements of both GDPR and the Norwegian Directorate of Health." },
        { title: "Time-saving solutions", desc: "Our digital tools automate routine tasks and free up valuable time that can be spent on patient care." },
        { title: "Based in Oslo – clients across Norway", desc: "We work remotely and on-site, with fast response times and personal follow-up wherever your clinic is located." },
        { title: "Documented results", desc: "Our customers report an average 30% increase in efficiency and 20% growth after implementing our solutions." },
      ],
    },
    whyLink: {
      no: "Les mer om hvorfor kunder velger oss",
      en: "Read more about why customers choose us",
    },
    resultsKicker: { no: "Resultater", en: "Results" },
    resultsTitle: {
      no: "Dokumenterte resultater",
      en: "Documented results",
    },
    resultsSub: {
      no: "Ekte prosjekter, målbare tall. Se hva vi har levert for klinikker som din.",
      en: "Real projects, measurable numbers. See what we have delivered for clinics like yours.",
    },
    resultsLink: { no: "Se alle resultater", en: "See all results" },
    processKicker: { no: "Prosessen", en: "The Process" },
    processTitle: {
      no: "Slik jobber vi",
      en: "How we work",
    },
    processSub: {
      no: "Fire steg fra første samtale til løpende partnerskap.",
      en: "Four steps from first conversation to ongoing partnership.",
    },
    processSteps: {
      no: [
        { title: "Behovsanalyse", desc: "Gratis kartlegging av klinikkens systemer, synlighet og flaskehalser. Du får en konkret anbefaling – uansett om du velger oss." },
        { title: "Plan og prioritering", desc: "Vi foreslår tiltakene med størst effekt først, med tydelig pris, tidslinje og målbare mål." },
        { title: "Implementering", desc: "Vi bygger, migrerer og konfigurerer – med minimal forstyrrelse av klinikkdriften og opplæring av teamet." },
        { title: "Drift og optimalisering", desc: "Løpende overvåking, support og månedlig rapportering. Vi justerer etter tallene, ikke magefølelsen." },
      ],
      en: [
        { title: "Needs analysis", desc: "Free mapping of your clinic's systems, visibility and bottlenecks. You get a concrete recommendation – whether or not you choose us." },
        { title: "Plan and priorities", desc: "We propose the highest-impact measures first, with clear pricing, timeline and measurable goals." },
        { title: "Implementation", desc: "We build, migrate and configure – with minimal disruption to clinic operations and training for the team." },
        { title: "Operations and optimization", desc: "Continuous monitoring, support and monthly reporting. We adjust based on the numbers, not gut feeling." },
      ],
    },
    articlesKicker: { no: "Fagartikler", en: "Articles" },
    articlesTitle: {
      no: "Fagartikler og Ressurser",
      en: "Articles and Resources",
    },
    articlesSub: {
      no: "Hold deg oppdatert på de nyeste digitale trendene for tannklinikker.",
      en: "Stay updated on the latest digital trends for dental clinics.",
    },
    ctaKicker: { no: "Ta steget inn i fremtiden", en: "Step into the future" },
    ctaTitle: {
      no: "Klar for å Digitalisere Din Tannklinikk?",
      en: "Ready to Digitalize Your Dental Clinic?",
    },
    ctaSub: {
      no: "Ta det første steget mot en mer effektiv og lønnsom tannklinikk med våre skreddersydde digitale løsninger.",
      en: "Take the first step towards a more efficient and profitable dental clinic with our tailored digital solutions.",
    },
    ctaNote: {
      no: "Gratis konsultasjon og behovsanalyse ved kontakt innen 30 dager",
      en: "Free consultation and needs analysis when contacting us within 30 days",
    },
  },
  about: {
    kicker: { no: "Om Oss", en: "About Us" },
    title: { no: "Din Digitale Partner", en: "Your Digital Partner" },
    sub: {
      no: "Vi startet DentDigital fordi norske tannklinikker fortjener en partner som forstår deres unike behov – både teknologisk og regulativt.",
      en: "We started DentDigital because Norwegian dental clinics deserve a partner who understands their unique needs – both technologically and regulatorily.",
    },
    historyTitle: { no: "Vår Historie", en: "Our Story" },
    history: {
      no: [
        "DentDigital ble grunnlagt av en gruppe teknologieksperter og tannhelsespesialister som så et behov for skreddersydde digitale løsninger for norske tannklinikker.",
        "Vi oppdaget at mange tannklinikker brukte generelle IT-tjenester som ikke forsto de spesifikke behovene og regulatoriske kravene i tannhelsesektoren. Dette førte til ineffektive systemer, sikkerhetsproblemer og frustrerte klinikkeiere.",
        "Vår visjon er å bli den foretrukne digitale partneren for tannklinikker i hele Norge, fra små enkeltmannspraksiser til store klinikkjeder. Vi er dedikert til å gjøre norske tannklinikker mer effektive, sikre og lønnsomme gjennom skreddersydde digitale løsninger.",
      ],
      en: [
        "DentDigital was founded by a group of technology experts and dental health specialists who saw a need for tailored digital solutions for Norwegian dental clinics.",
        "We discovered that many dental clinics used generic IT services that did not understand the specific needs and regulatory requirements of the dental health sector. This led to inefficient systems, security issues and frustrated clinic owners.",
        "Our vision is to become the preferred digital partner for dental clinics throughout Norway, from small solo practices to large clinic chains. We are dedicated to making Norwegian dental clinics more efficient, secure and profitable through tailored digital solutions.",
      ],
    },
    valuesTitle: { no: "Våre Verdier", en: "Our Values" },
    valuesSub: {
      no: "Prinsippene som styrer alt vi gjør hos DentDigital",
      en: "The principles that guide everything we do at DentDigital",
    },
    values: {
      no: [
        { title: "Lokal kunnskap, global teknologi", desc: "Vi kombinerer vår dype forståelse av norske forhold med den nyeste globale teknologien for å levere de beste løsningene." },
        { title: "Sikkerhet først", desc: "Vi tar personvern og datasikkerhet på alvor, og alle våre løsninger er utviklet med GDPR og norske forskrifter i fokus." },
        { title: "Kundefokusert innovasjon", desc: "Vi lytter til våre kunder og utvikler løsninger som adresserer deres faktiske behov, ikke bare det nyeste innen teknologi." },
      ],
      en: [
        { title: "Local knowledge, global technology", desc: "We combine our deep understanding of Norwegian conditions with the latest global technology to deliver the best solutions." },
        { title: "Security first", desc: "We take privacy and data security seriously, and all our solutions are developed with GDPR and Norwegian regulations in focus." },
        { title: "Customer-focused innovation", desc: "We listen to our customers and develop solutions that address their actual needs, not just the latest in technology." },
      ],
    },
    ctaTitle: {
      no: "Bli en del av DentDigital-familien",
      en: "Join the DentDigital family",
    },
    ctaSub: {
      no: "Slå deg sammen med våre fornøyde kunder som stoler på oss for deres digitale behov.",
      en: "Join our satisfied customers who trust us with their digital needs.",
    },
    ctaButton: { no: "Kontakt Oss i Dag", en: "Contact Us Today" },
  },
  contact: {
    kicker: { no: "Kontakt Oss", en: "Contact Us" },
    title: {
      no: "Kontakt DentDigital – Din Digitale Partner",
      en: "Contact DentDigital – Your Digital Partner",
    },
    sub: {
      no: "Vi er her for å hjelpe din tannklinikk med å ta steget inn i den digitale fremtiden.",
      en: "We are here to help your dental clinic step into the digital future.",
    },
    formTitle: { no: "Send oss en melding", en: "Send us a message" },
    formSub: {
      no: "Fyll ut skjemaet nedenfor, så kontakter vi deg så snart som mulig.",
      en: "Fill out the form below and we will contact you as soon as possible.",
    },
    firstName: { no: "Fornavn", en: "First name" },
    lastName: { no: "Etternavn", en: "Last name" },
    email: { no: "E-post", en: "Email" },
    phone: { no: "Telefon", en: "Phone" },
    clinic: { no: "Klinikknavn", en: "Clinic name" },
    message: { no: "Melding", en: "Message" },
    send: { no: "Send Melding", en: "Send Message" },
    sending: { no: "Sender…", en: "Sending…" },
    success: {
      no: "Takk for din henvendelse! Vi kontakter deg snart.",
      en: "Thank you for your message! We will contact you soon.",
    },
    error: {
      no: "Noe gikk galt. Prøv igjen eller send e-post til post@dentdigital.no.",
      en: "Something went wrong. Please try again or email post@dentdigital.no.",
    },
    infoTitle: { no: "Kontaktinformasjon", en: "Contact Information" },
    addressLabel: { no: "Adresse", en: "Address" },
    hoursLabel: { no: "Åpningstider", en: "Opening Hours" },
    hours: {
      no: "Mandag – Fredag: 08:00 – 16:00\nTeknisk support: 24/7",
      en: "Monday – Friday: 08:00 – 16:00\nTechnical support: 24/7",
    },
    websiteLabel: { no: "Nettside", en: "Website" },
    coverage: {
      no: "Vi betjener klinikker i hele Norge – Oslo, Bergen, Trondheim, Stavanger og mer.",
      en: "We serve clinics all over Norway – Oslo, Bergen, Trondheim, Stavanger and more.",
    },
    faqTitle: { no: "Ofte Stilte Spørsmål", en: "Frequently Asked Questions" },
    faqSub: {
      no: "Svar på vanlige spørsmål om våre tjenester",
      en: "Answers to common questions about our services",
    },
    faq: {
      no: [
        { q: "Hvordan håndterer dere personvern (GDPR) i deres løsninger?", a: "Alle våre løsninger er utviklet med GDPR i fokus. Vi bruker kun norske eller EU-baserte datasentre, implementerer strenge tilgangskontroller, og sikrer at all pasientdata er kryptert både ved lagring og overføring. Vi tilbyr også databehandleravtaler som oppfyller alle krav fra Helsedirektoratet og Datatilsynet." },
        { q: "Kan dere hjelpe til med migrering fra vårt gamle system?", a: "Ja, vi har omfattende erfaring med migrering fra ulike systemer. Vår prosess sikrer minimal nedetid og at all historisk data blir korrekt overført. Vi tilbyr også opplæring for hele teamet ditt for å sikre en smidig overgang." },
        { q: "Tilbyr dere akutt IT-support ved nedetid?", a: "Absolutt. Vår tekniske support er tilgjengelig 24/7 for kritiske problemer. Vi garanterer responstid på under 1 time for kritiske hendelser, og de fleste problemer løses fjernstyrt uten behov for besøk på stedet." },
      ],
      en: [
        { q: "How do you handle privacy (GDPR) in your solutions?", a: "All our solutions are developed with GDPR in focus. We only use Norwegian or EU-based data centers, implement strict access controls, and ensure all patient data is encrypted both at rest and in transit. We also offer data processing agreements that meet all requirements from the Norwegian Directorate of Health and the Data Protection Authority." },
        { q: "Can you help with migration from our old system?", a: "Yes, we have extensive experience migrating from various systems. Our process ensures minimal downtime and that all historical data is transferred correctly. We also offer training for your entire team to ensure a smooth transition." },
        { q: "Do you offer emergency IT support during downtime?", a: "Absolutely. Our technical support is available 24/7 for critical issues. We guarantee a response time of under 1 hour for critical incidents, and most problems are resolved remotely without the need for an on-site visit." },
      ],
    },
  },
  ai: {
    title: {
      no: "AI-løsninger for Tannklinikker",
      en: "AI Solutions for Dental Clinics",
    },
    sub: {
      no: "Moderne AI-teknologi skreddersydd for tannhelsesektoren.",
      en: "Modern AI technology tailored for the dental health sector.",
    },
    servicesTitle: { no: "Våre AI-tjenester", en: "Our AI Services" },
    servicesSub: {
      no: "Skreddersydde AI-løsninger som hjelper din tannklinikk med å levere bedre pasientopplevelser og effektivisere driften.",
      en: "Tailored AI solutions that help your dental clinic deliver better patient experiences and streamline operations.",
    },
    services: {
      no: [
        { title: "AI Chatbots", desc: "Intelligente chatbots som kan svare på pasientspørsmål, håndtere timebestillinger og gi behandlingsinformasjon døgnet rundt." },
        { title: "RAG-løsninger", desc: "Retrieval Augmented Generation-systemer som kombinerer din klinikks kunnskap med AI for å gi nøyaktige og kontekstuelle svar på komplekse spørsmål." },
        { title: "Semantisk Søk", desc: "Avanserte søkesystemer som forstår kontekst og intensjon, slik at du raskt kan finne relevant pasientinformasjon og journaler." },
        { title: "Automatisert Pasientkommunikasjon", desc: "AI-drevne systemer som sender personlige påminnelser, oppfølginger og helseinformasjon tilpasset hver enkelt pasient." },
        { title: "Prediktiv Analyse", desc: "Analyseverktøy som forutsier pasientbehov, identifiserer trender og hjelper med strategisk planlegging basert på historiske data." },
      ],
      en: [
        { title: "AI Chatbots", desc: "Intelligent chatbots that can answer patient questions, handle appointment bookings and provide treatment information around the clock." },
        { title: "RAG Solutions", desc: "Retrieval Augmented Generation systems that combine your clinic's knowledge with AI to provide accurate and contextual answers to complex questions." },
        { title: "Semantic Search", desc: "Advanced search systems that understand context and intent, so you can quickly find relevant patient information and records." },
        { title: "Automated Patient Communication", desc: "AI-driven systems that send personal reminders, follow-ups and health information tailored to each individual patient." },
        { title: "Predictive Analytics", desc: "Analytics tools that predict patient needs, identify trends and help with strategic planning based on historical data." },
      ],
    },
    ctaTitle: {
      no: "Interessert i våre AI-løsninger?",
      en: "Interested in our AI solutions?",
    },
    ctaSub: {
      no: "Kontakt oss for en uforpliktende samtale om hvordan AI kan transformere din tannklinikk.",
      en: "Contact us for a no-obligation conversation about how AI can transform your dental clinic.",
    },
  },
  servicesPage: {
    kicker: { no: "Våre Tjenester", en: "Our Services" },
    title: {
      no: "Digitale Løsninger for Tannklinikker",
      en: "Digital Solutions for Dental Clinics",
    },
    sub: {
      no: "Skreddersydde tjenester som hjelper din tannklinikk å vokse, effektivisere og levere bedre pasientopplevelser.",
      en: "Tailored services that help your dental clinic grow, streamline and deliver better patient experiences.",
    },
    benefitsTitle: {
      no: "Fordeler med våre tjenester",
      en: "Benefits of our services",
    },
    benefitsSub: {
      no: "Våre digitale løsninger gir din tannklinikk konkurransefortrinn og effektiviserer driften",
      en: "Our digital solutions give your dental clinic a competitive edge and streamline operations",
    },
    benefits: {
      no: [
        "Spar opptil 40% administrativ tid",
        "Reduser uteblivelser med 30%",
        "Øk pasienttilfredshet med 25%",
        "GDPR-kompatible løsninger",
        "24/7 teknisk support",
        "Norskutviklet for norske forhold",
        "Økt synlighet på Google",
        "Sikker pasientdata i norsk sky",
        "Skreddersydde løsninger for tannklinikker",
      ],
      en: [
        "Save up to 40% administrative time",
        "Reduce no-shows by 30%",
        "Increase patient satisfaction by 25%",
        "GDPR-compliant solutions",
        "24/7 technical support",
        "Developed in Norway for Norwegian conditions",
        "Increased visibility on Google",
        "Secure patient data in Norwegian cloud",
        "Tailored solutions for dental clinics",
      ],
    },
    ctaTitle: {
      no: "Klar for å digitalisere din tannklinikk?",
      en: "Ready to digitalize your dental clinic?",
    },
    ctaSub: {
      no: "Ta kontakt med oss i dag for en uforpliktende samtale om hvordan vi kan hjelpe din klinikk.",
      en: "Get in touch with us today for a no-obligation conversation about how we can help your clinic.",
    },
  },
  articlesPage: {
    kicker: { no: "Fagartikler", en: "Articles" },
    title: {
      no: "Fagartikler og Ressurser",
      en: "Articles and Resources",
    },
    sub: {
      no: "Hold deg oppdatert på de nyeste digitale trendene og beste praksiser for tannklinikker i Norge",
      en: "Stay updated on the latest digital trends and best practices for dental clinics in Norway",
    },
    all: { no: "Alle", en: "All" },
    newsletterTitle: {
      no: "Få Eksklusive Ressurser",
      en: "Get Exclusive Resources",
    },
    newsletterSub: {
      no: "Abonner på vårt nyhetsbrev for å motta gratis guider, maler og tips for din tannklinikk.",
      en: "Subscribe to our newsletter to receive free guides, templates and tips for your dental clinic.",
    },
    subscribe: { no: "Abonner Nå", en: "Subscribe Now" },
    backToArticles: { no: "Tilbake til fagartikler", en: "Back to articles" },
  },
} as const;
