export interface ArticleSection {
  heading: string;
  text: string;
}

export interface Article {
  slug: string;
  image: string;
  date: string; // ISO
  category: { no: string; en: string };
  title: { no: string; en: string };
  excerpt: { no: string; en: string };
  body: { no: ArticleSection[]; en: ArticleSection[] };
}

export const articles: Article[] = [
  {
    slug: "ai-resepsjonist-tannklinikker",
    image: "/digital-patient-experience.png",
    date: "2026-05-12",
    category: { no: "Teknologi", en: "Technology" },
    title: {
      no: "AI-resepsjonist for Tannklinikker: Slik Fungerer Det",
      en: "AI Receptionist for Dental Clinics: How It Works",
    },
    excerpt: {
      no: "AI-drevne resepsjonister svarer på henvendelser, booker timer og avlaster teamet – døgnet rundt. Her er hva du bør vite før du tar i bruk teknologien.",
      en: "AI-powered receptionists answer inquiries, book appointments and relieve your team – around the clock. Here's what to know before adopting the technology.",
    },
    body: {
      no: [
        { heading: "Hva gjør en AI-resepsjonist?", text: "En AI-resepsjonist håndterer henvendelser på nettsiden, SMS og telefon: den svarer på vanlige spørsmål om priser, åpningstider og behandlinger, foreslår ledige timer og booker direkte i kalenderen. De beste løsningene eskalerer sømløst til et menneske når spørsmålet krever det." },
        { heading: "Gevinsten er konkret", text: "Klinikker mister bookinger hver eneste dag fordi telefonen er opptatt eller henvendelsen kommer etter stengetid. En AI-resepsjonist svarer umiddelbart, hele døgnet. Kombinert med automatiske påminnelser reduseres både tapte henvendelser og uteblivelser målbart." },
        { heading: "Personvern må på plass først", text: "Pasientdialog er helseopplysninger. Løsningen må ha databehandleravtale, EU/EØS-datalagring og tydelige rutiner for hva AI-en får og ikke får svare på. Diagnostiske råd skal alltid til behandler – AI-en skal kjenne sin grense." },
        { heading: "Slik kommer du i gang", text: "Start med én kanal – for eksempel chat på nettsiden – og et avgrenset oppgavesett: booking, priser, åpningstider. Mål svarkvalitet og konvertering i fire uker, juster kunnskapsbasen, og utvid deretter til SMS og telefon. DentDigital setter opp hele løsningen GDPR-sikkert." },
      ],
      en: [
        { heading: "What does an AI receptionist do?", text: "An AI receptionist handles inquiries on your website, SMS and phone: it answers common questions about prices, opening hours and treatments, suggests available slots and books directly into the calendar. The best solutions escalate seamlessly to a human when the question requires it." },
        { heading: "The gains are concrete", text: "Clinics lose bookings every single day because the phone is busy or the inquiry arrives after closing. An AI receptionist responds instantly, around the clock. Combined with automatic reminders, both lost inquiries and no-shows drop measurably." },
        { heading: "Privacy must come first", text: "Patient dialogue is health data. The solution must have a data processing agreement, EU/EEA data storage and clear rules for what the AI may and may not answer. Diagnostic advice always goes to the clinician – the AI must know its limits." },
        { heading: "How to get started", text: "Start with one channel – for example website chat – and a limited task set: booking, prices, opening hours. Measure answer quality and conversion for four weeks, tune the knowledge base, then expand to SMS and phone. DentDigital sets up the entire solution GDPR-safely." },
      ],
    },
  },
  {
    slug: "google-annonsering-tannleger-2026",
    image: "/dental-seo.png",
    date: "2026-03-18",
    category: { no: "Markedsføring", en: "Marketing" },
    title: {
      no: "Google-annonsering for Tannleger i 2026",
      en: "Google Advertising for Dentists in 2026",
    },
    excerpt: {
      no: "Søkeannonser er fortsatt den raskeste veien til nye pasienter – men spillereglene har endret seg. Slik får du mest ut av annonsebudsjettet i 2026.",
      en: "Search ads are still the fastest route to new patients – but the rules have changed. Here's how to get the most from your ad budget in 2026.",
    },
    body: {
      no: [
        { heading: "AI-oversikter endrer søket", text: "Googles AI-genererte svar tar stadig mer plass i søkeresultatene. For klinikker betyr det at organisk synlighet under AI-oversikten blir tøffere – og at betalt plassering øverst, kombinert med sterk Google Business-profil, blir viktigere for lokale søk som «tannlege nær meg»." },
        { heading: "Performance Max med lokale mål", text: "Kampanjetypene er blitt mer automatiserte. Performance Max fungerer godt for klinikker når den mates med riktige konverteringsmål: fullførte bookinger – ikke bare klikk. Koble annonsekontoen til bookingsystemet slik at Google optimaliserer mot faktiske timebestillinger." },
        { heading: "Landingssiden avgjør prisen", text: "Kvalitetsscore styrer hva du betaler per klikk. En rask, mobiloptimalisert side med synlig booking, priser og omtaler kan halvere kostnaden per pasient sammenlignet med å sende trafikk til forsiden." },
        { heading: "Mål det som teller", text: "Med samtykkebasert sporing (Consent Mode v2) må målingen settes opp riktig for å være både lovlig og presis. Følg kostnad per ny pasient – ikke kostnad per klikk – og flytt budsjett til behandlingene med best livstidsverdi, som implantat og ortodonti." },
      ],
      en: [
        { heading: "AI overviews change search", text: "Google's AI-generated answers take up ever more space in results. For clinics this means organic visibility below the AI overview gets tougher – and paid placement at the top, combined with a strong Google Business profile, matters more for local searches like 'dentist near me'." },
        { heading: "Performance Max with local goals", text: "Campaign types have become more automated. Performance Max works well for clinics when fed the right conversion goals: completed bookings – not just clicks. Connect your ad account to the booking system so Google optimizes toward actual appointments." },
        { heading: "The landing page sets your price", text: "Quality Score drives what you pay per click. A fast, mobile-optimized page with visible booking, prices and reviews can halve the cost per patient compared to sending traffic to your homepage." },
        { heading: "Measure what counts", text: "With consent-based tracking (Consent Mode v2), measurement must be set up correctly to be both legal and precise. Track cost per new patient – not cost per click – and shift budget to treatments with the best lifetime value, like implants and orthodontics." },
      ],
    },
  },
  {
    slug: "journalsystem-integrasjoner-2026",
    image: "/dental-imaging-software.png",
    date: "2026-01-22",
    category: { no: "Programvare", en: "Software" },
    title: {
      no: "Journalsystem-integrasjoner: Slutt på Dobbeltregistrering",
      en: "Record System Integrations: The End of Duplicate Data Entry",
    },
    excerpt: {
      no: "Booking, bildediagnostikk, regnskap og journal som snakker sammen sparer klinikken timer hver uke. Slik bygger du en integrert systemflyt.",
      en: "Booking, imaging, accounting and records that talk to each other save the clinic hours every week. Here's how to build an integrated system flow.",
    },
    body: {
      no: [
        { heading: "Kostnaden ved datasiloer", text: "Når booking, journal, Opus og regnskap lever hver for seg, betaler klinikken med tid: samme pasientdata registreres to–tre ganger, feil sniker seg inn, og ingen har full oversikt. En gjennomsnittsklinikk bruker flere timeverk i uken på ren dobbeltregistrering." },
        { heading: "Start med pasientreisen", text: "Kartlegg flyten fra henvendelse til betalt behandling: hvor tastes samme informasjon inn flere ganger? De vanligste gevinstene ligger i booking → journal, journal → faktura, og bildesystem → journal." },
        { heading: "API-er og mellomvare", text: "Moderne journalsystemer tilbyr API-er, men kvaliteten varierer. Der direkteintegrasjon mangler, kan sikker mellomvare bygge broen – med kryptert dataflyt og full sporbarhet. Krev alltid databehandleravtale og EU/EØS-behandling i alle ledd." },
        { heading: "Tenk stort, start smått", text: "Velg den ene integrasjonen som fjerner mest manuelt arbeid, sett den i drift, og mål tidsbesparelsen. Suksess i første ledd gjør resten av systemkartet både enklere å prioritere og lettere å finansiere." },
      ],
      en: [
        { heading: "The cost of data silos", text: "When booking, records, Opus and accounting live separately, the clinic pays with time: the same patient data is entered two or three times, errors creep in, and no one has the full picture. An average clinic spends several man-hours a week on pure duplicate entry." },
        { heading: "Start with the patient journey", text: "Map the flow from inquiry to paid treatment: where is the same information typed more than once? The most common wins are booking → records, records → invoice, and imaging → records." },
        { heading: "APIs and middleware", text: "Modern record systems offer APIs, but quality varies. Where direct integration is missing, secure middleware can bridge the gap – with encrypted data flow and full traceability. Always require a data processing agreement and EU/EEA processing at every step." },
        { heading: "Think big, start small", text: "Pick the one integration that removes the most manual work, put it into production, and measure the time saved. Success in the first step makes the rest of the system map both easier to prioritize and easier to fund." },
      ],
    },
  },
  {
    slug: "ai-i-tanndiagnostikk",
    image: "/dental-software-dashboard.png",
    date: "2025-06-10",
    category: { no: "Teknologi", en: "Technology" },
    title: {
      no: "AI i Tanndiagnostikk: Fremtiden er Her",
      en: "AI in Dental Diagnostics: The Future is Here",
    },
    excerpt: {
      no: "Hvordan kunstig intelligens revolusjonerer diagnostisering av karies, periodontitt og andre tilstander med høyere presisjon enn noensinne.",
      en: "How artificial intelligence is revolutionizing the diagnosis of caries, periodontitis and other conditions with higher precision than ever before.",
    },
    body: {
      no: [
        { heading: "En ny æra for diagnostikk", text: "Kunstig intelligens har på få år gått fra forskningslaboratoriene til klinikkhverdagen. Moderne AI-modeller kan analysere røntgenbilder og CBCT-skanninger på sekunder og markere områder med mulig karies, periodontal bennedbrytning eller periapikale lesjoner – ofte med presisjon på nivå med, eller over, erfarne klinikere." },
        { heading: "Hvordan fungerer det?", text: "Systemene trenes på hundretusenvis av annoterte tannbilder. Ved analyse markerer AI-en funn med sannsynlighetsscore, slik at tannlegen raskt kan verifisere eller avkrefte. Det er viktig å understreke at AI-en er et beslutningsstøtteverktøy – den endelige diagnosen stilles alltid av behandleren." },
        { heading: "Gevinster for norske klinikker", text: "Klinikker som tar i bruk AI-assistert diagnostikk rapporterer raskere bildegjennomgang, færre oversette funn og bedre pasientkommunikasjon. Når pasienten ser de markerte områdene på skjermen, blir behandlingsbehovet mer forståelig og aksepten for behandlingsplaner øker." },
        { heading: "Kom i gang", text: "Start med en pilot på ett behandlingsrom, sørg for at løsningen er CE-merket og GDPR-kompatibel, og involver hele teamet i opplæringen. DentDigital hjelper deg med å vurdere leverandører, integrasjon mot journalsystemet og sikker datahåndtering." },
      ],
      en: [
        { heading: "A new era for diagnostics", text: "In just a few years, artificial intelligence has moved from research labs into everyday clinical practice. Modern AI models can analyze X-rays and CBCT scans in seconds, flagging areas of possible caries, periodontal bone loss or periapical lesions – often with precision at or above the level of experienced clinicians." },
        { heading: "How does it work?", text: "The systems are trained on hundreds of thousands of annotated dental images. During analysis, the AI marks findings with probability scores so the dentist can quickly verify or dismiss them. Importantly, AI is a decision-support tool – the final diagnosis is always made by the clinician." },
        { heading: "Benefits for Norwegian clinics", text: "Clinics adopting AI-assisted diagnostics report faster image review, fewer missed findings and better patient communication. When patients see the highlighted areas on screen, the need for treatment becomes more understandable and acceptance of treatment plans increases." },
        { heading: "Getting started", text: "Start with a pilot in one treatment room, ensure the solution is CE-marked and GDPR-compliant, and involve the whole team in training. DentDigital helps you evaluate vendors, integrate with your record system and handle data securely." },
      ],
    },
  },
  {
    slug: "gdpr-for-tannklinikker",
    image: "/gdpr-compliance.png",
    date: "2025-04-03",
    category: { no: "Sikkerhet", en: "Security" },
    title: {
      no: "5 Ting Du Må Vite Om GDPR for Tannklinikker",
      en: "5 Things You Must Know About GDPR for Dental Clinics",
    },
    excerpt: {
      no: "En praktisk guide til hvordan din tannklinikk kan sikre at den overholder personvernforordningen.",
      en: "A practical guide to how your dental clinic can ensure compliance with the privacy regulation.",
    },
    body: {
      no: [
        { heading: "1. Pasientdata er særlige kategorier", text: "Helseopplysninger er underlagt GDPRs strengeste beskyttelsesnivå. Det betyr at all lagring, deling og behandling av journaler, røntgenbilder og betalingsinformasjon krever et tydelig rettslig grunnlag og dokumenterte rutiner." },
        { heading: "2. Du trenger databehandleravtaler", text: "Alle leverandører som behandler pasientdata på dine vegne – journalsystem, skylagring, SMS-tjenester – må ha en databehandleravtale (DPA). Uten dette bryter klinikken loven, selv om leverandøren er stor og kjent." },
        { heading: "3. Data bør lagres i Norge/EU", text: "Overføring av helsedata til land utenfor EØS krever særskilte garantier. Den enkleste og tryggeste løsningen er å velge leverandører med datasentre i Norge eller EU." },
        { heading: "4. Ansatte er den største risikoen", text: "De fleste avvik skyldes menneskelige feil: svake passord, phishing eller feilsendte e-poster. Regelmessig sikkerhetsopplæring og tilgangsstyring basert på roller reduserer risikoen dramatisk." },
        { heading: "5. Avvik må meldes innen 72 timer", text: "Ved brudd på personopplysningssikkerheten har du plikt til å varsle Datatilsynet innen 72 timer. Ha en beredskapsplan klar – DentDigital hjelper deg med både planverk, testing og teknisk sikring." },
      ],
      en: [
        { heading: "1. Patient data is a special category", text: "Health information falls under GDPR's strictest level of protection. All storage, sharing and processing of records, X-rays and payment information requires a clear legal basis and documented procedures." },
        { heading: "2. You need data processing agreements", text: "All vendors processing patient data on your behalf – record systems, cloud storage, SMS services – must have a data processing agreement (DPA). Without it, the clinic is in breach of the law, no matter how large or well-known the vendor is." },
        { heading: "3. Data should be stored in Norway/EU", text: "Transferring health data outside the EEA requires special safeguards. The simplest and safest solution is choosing vendors with data centers in Norway or the EU." },
        { heading: "4. Employees are the biggest risk", text: "Most incidents are caused by human error: weak passwords, phishing or misdirected emails. Regular security training and role-based access control dramatically reduce the risk." },
        { heading: "5. Breaches must be reported within 72 hours", text: "In case of a personal data breach, you are required to notify the Data Protection Authority within 72 hours. Have an incident response plan ready – DentDigital helps with planning, testing and technical safeguards." },
      ],
    },
  },
  {
    slug: "digital-transformasjon-guide",
    image: "/digital-dental-partnership.png",
    date: "2025-05-28",
    category: { no: "Strategi", en: "Strategy" },
    title: {
      no: "Digital Transformasjon: En Steg-for-Steg Guide for Tannklinikker",
      en: "Digital Transformation: A Step-by-Step Guide for Dental Clinics",
    },
    excerpt: {
      no: "En omfattende veiledning for å digitalisere din tannklinikk – fra pasientjournaler til markedsføring og alt imellom.",
      en: "A comprehensive guide to digitalizing your dental clinic – from patient records to marketing and everything in between.",
    },
    body: {
      no: [
        { heading: "Steg 1: Kartlegg nåsituasjonen", text: "Start med en ærlig gjennomgang av dagens systemer: journalsystem, bildediagnostikk, booking, fakturering og markedsføring. Identifiser flaskehalser, manuelle rutiner og systemer som ikke snakker sammen." },
        { heading: "Steg 2: Prioriter etter effekt", text: "Ikke digitaliser alt på en gang. Størst gevinst kommer vanligvis fra online booking, automatiske SMS-påminnelser og digital anamnese – tiltak som sparer resepsjonen for timer hver uke og reduserer uteblivelser." },
        { heading: "Steg 3: Velg integrerte løsninger", text: "Velg verktøy som integrerer med journalsystemet ditt. Frittstående løsninger skaper dobbeltarbeid og datasiloer. Krev åpne API-er og norsk/EU-datalagring fra alle leverandører." },
        { heading: "Steg 4: Involver teamet", text: "Digitalisering lykkes bare når teamet er med. Utnevn en digital superbruker på klinikken, sett av tid til opplæring, og innfør endringer gradvis med tydelige rutiner." },
        { heading: "Steg 5: Mål og optimaliser", text: "Følg med på nøkkeltall som timeutnyttelse, uteblivelser og pasienttilfredshet. Et enkelt dashboard gir deg oversikt og viser hvor neste forbedring bør skje." },
      ],
      en: [
        { heading: "Step 1: Map the current state", text: "Start with an honest review of today's systems: records, imaging, booking, invoicing and marketing. Identify bottlenecks, manual routines and systems that don't talk to each other." },
        { heading: "Step 2: Prioritize by impact", text: "Don't digitalize everything at once. The biggest gains usually come from online booking, automatic SMS reminders and digital medical history forms – measures that save reception hours every week and reduce no-shows." },
        { heading: "Step 3: Choose integrated solutions", text: "Choose tools that integrate with your record system. Standalone solutions create duplicate work and data silos. Require open APIs and Norwegian/EU data storage from all vendors." },
        { heading: "Step 4: Involve the team", text: "Digitalization only succeeds when the team is on board. Appoint a digital super-user at the clinic, set aside time for training, and roll out changes gradually with clear routines." },
        { heading: "Step 5: Measure and optimize", text: "Track key metrics like appointment utilization, no-shows and patient satisfaction. A simple dashboard gives you the overview and shows where the next improvement should happen." },
      ],
    },
  },
  {
    slug: "oke-pasienttilstromning-med-seo",
    image: "/dental-seo.png",
    date: "2025-05-15",
    category: { no: "Markedsføring", en: "Marketing" },
    title: {
      no: "Hvordan Øke Pasienttilstrømningen med SEO",
      en: "How to Increase Patient Flow with SEO",
    },
    excerpt: {
      no: "Lær hvordan du kan optimalisere nettsiden din for lokale søk og tiltrekke flere pasienter til klinikken din.",
      en: "Learn how to optimize your website for local searches and attract more patients to your clinic.",
    },
    body: {
      no: [
        { heading: "Lokal SEO er gullgruven", text: "Når noen søker «tannlege Oslo» eller «akutt tannlege nær meg», vil du være øverst. Lokal SEO handler om å optimalisere Google Business-profilen, samle anmeldelser og sørge for konsistent navn, adresse og telefonnummer på tvers av nettet." },
        { heading: "Innhold som svarer på spørsmål", text: "Pasienter googler symptomer og behandlinger før de bestiller time. Artikler om tannbleking, visdomstenner eller tannlegeskrekk bygger tillit og fanger søketrafikk tidlig i beslutningsprosessen." },
        { heading: "Teknisk kvalitet teller", text: "Google belønner raske, mobilvennlige nettsider. Moderne rammeverk som Next.js, optimaliserte bilder og god Core Web Vitals-score gir målbart bedre rangering." },
        { heading: "Mål det som betyr noe", text: "Følg med på hvor mange bestillinger som kommer fra organisk søk, ikke bare besøkstall. Med riktig sporing ser du nøyaktig hvilke sider og søkeord som gir nye pasienter." },
      ],
      en: [
        { heading: "Local SEO is the goldmine", text: "When someone searches 'dentist Oslo' or 'emergency dentist near me', you want to be at the top. Local SEO is about optimizing your Google Business profile, collecting reviews and ensuring consistent name, address and phone number across the web." },
        { heading: "Content that answers questions", text: "Patients google symptoms and treatments before booking. Articles about whitening, wisdom teeth or dental anxiety build trust and capture search traffic early in the decision process." },
        { heading: "Technical quality matters", text: "Google rewards fast, mobile-friendly websites. Modern frameworks like Next.js, optimized images and good Core Web Vitals scores measurably improve rankings." },
        { heading: "Measure what matters", text: "Track how many bookings come from organic search, not just visitor numbers. With proper tracking you see exactly which pages and keywords bring in new patients." },
      ],
    },
  },
  {
    slug: "opus-bildeprogram",
    image: "/dental-imaging-software.png",
    date: "2025-03-21",
    category: { no: "Programvare", en: "Software" },
    title: {
      no: "Hvorfor Opus Er det Beste Bildeprogrammet for Norske Klinikker",
      en: "Why Opus Is the Best Imaging Software for Norwegian Clinics",
    },
    excerpt: {
      no: "En gjennomgang av fordelene med Opus bildebehandlingsprogram spesielt tilpasset norske tannklinikker.",
      en: "A review of the benefits of the Opus imaging software specially adapted for Norwegian dental clinics.",
    },
    body: {
      no: [
        { heading: "Bygget for norsk klinikkhverdag", text: "Opus er utbredt i Norge av en grunn: programmet er tilpasset norske arbeidsflyter, refusjonsregler og journalkrav, og har solid støtte for norsk helsenett-integrasjon." },
        { heading: "Sømløs bildediagnostikk", text: "Fra intraorale bilder til CBCT og 3D-modellering samler Opus alt i én arbeidsflate. Riktig konfigurert reduseres tiden per bildeopptak betydelig, og bildene er umiddelbart tilgjengelige i journalen." },
        { heading: "Integrasjoner som sparer tid", text: "Opus kan kobles mot journalsystemer som DIPS og Tannlegen. God integrasjon eliminerer dobbeltregistrering og gjør at hele teamet jobber i samme oppdaterte datasett." },
        { heading: "Riktig oppsett er avgjørende", text: "Mange klinikker bruker bare en brøkdel av Opus' kapasitet. Profesjonelt oppsett, jevnlige oppdateringer og opplæring av personalet er forskjellen på et arkiv og et diagnostisk kraftverktøy." },
      ],
      en: [
        { heading: "Built for Norwegian clinical practice", text: "Opus is widespread in Norway for a reason: the software is adapted to Norwegian workflows, reimbursement rules and record requirements, with solid support for Norwegian health network integration." },
        { heading: "Seamless imaging diagnostics", text: "From intraoral images to CBCT and 3D modeling, Opus gathers everything in one workspace. Properly configured, time per image capture drops significantly, and images are instantly available in the record." },
        { heading: "Integrations that save time", text: "Opus can connect to record systems like DIPS and Tannlegen. Good integration eliminates duplicate data entry and lets the whole team work in the same up-to-date dataset." },
        { heading: "Proper setup is crucial", text: "Many clinics use only a fraction of Opus' capacity. Professional setup, regular updates and staff training are the difference between an archive and a diagnostic power tool." },
      ],
    },
  },
  {
    slug: "sikre-data-mot-cyberangrep",
    image: "/cybersecurity-healthcare.png",
    date: "2025-02-08",
    category: { no: "Sikkerhet", en: "Security" },
    title: {
      no: "Slik Sikrer Du Tannklinikkens Data mot Cyberangrep",
      en: "How to Protect Your Dental Clinic's Data Against Cyberattacks",
    },
    excerpt: {
      no: "Praktiske tips for å beskytte sensitive pasientdata og klinikkens systemer mot stadig mer sofistikerte trusler.",
      en: "Practical tips for protecting sensitive patient data and clinic systems against increasingly sophisticated threats.",
    },
    body: {
      no: [
        { heading: "Helsedata er et attraktivt mål", text: "Pasientjournaler omsettes for høye summer på det svarte markedet, og små klinikker angripes oftere enn store sykehus – nettopp fordi sikkerheten ofte er svakere. Ransomware kan lamme en klinikk i dagevis." },
        { heading: "Grunnmuren: backup og oppdateringer", text: "Daglig, automatisk sikkerhetskopi etter 3-2-1-prinsippet (tre kopier, to medier, én offsite) er din viktigste forsikring. Kombiner med automatiske sikkerhetsoppdateringer på alle maskiner og servere." },
        { heading: "To-faktor overalt", text: "Aktiver to-faktor autentisering på journalsystem, e-post og skytjenester. Dette ene tiltaket stopper de aller fleste kontokapringer, selv om passord kommer på avveie." },
        { heading: "Tren teamet", text: "Phishing er angrepsvei nummer én. Korte, jevnlige øvelser der ansatte lærer å gjenkjenne mistenkelige e-poster gir mer sikkerhet per krone enn noe annet tiltak." },
        { heading: "Ha en plan for det verste", text: "Lag en beredskapsplan: hvem ringer du, hvordan isolerer du systemer, hvordan gjenoppretter du fra backup? En testet plan kutter nedetiden fra uker til timer." },
      ],
      en: [
        { heading: "Health data is an attractive target", text: "Patient records sell for high sums on the black market, and small clinics are attacked more often than large hospitals – precisely because security is often weaker. Ransomware can paralyze a clinic for days." },
        { heading: "The foundation: backup and updates", text: "Daily, automatic backups following the 3-2-1 principle (three copies, two media, one offsite) are your most important insurance. Combine with automatic security updates on all machines and servers." },
        { heading: "Two-factor everywhere", text: "Enable two-factor authentication on record systems, email and cloud services. This single measure stops the vast majority of account takeovers, even if passwords leak." },
        { heading: "Train the team", text: "Phishing is attack vector number one. Short, regular exercises teaching staff to recognize suspicious emails deliver more security per krone than any other measure." },
        { heading: "Have a worst-case plan", text: "Create an incident response plan: who do you call, how do you isolate systems, how do you restore from backup? A tested plan cuts downtime from weeks to hours." },
      ],
    },
  },
  {
    slug: "digitale-verktoy-pasientopplevelse",
    image: "/digital-patient-experience.png",
    date: "2025-01-17",
    category: { no: "Pasientbehandling", en: "Patient Care" },
    title: {
      no: "Digitale Verktøy som Forbedrer Pasientopplevelsen",
      en: "Digital Tools that Improve the Patient Experience",
    },
    excerpt: {
      no: "Utforsk hvordan moderne teknologi kan gjøre tannlegebesøket mer behagelig og effektivt for pasientene dine.",
      en: "Explore how modern technology can make dental visits more comfortable and efficient for your patients.",
    },
    body: {
      no: [
        { heading: "Opplevelsen starter før besøket", text: "Online booking, digital anamnese og automatiske påminnelser fjerner friksjon før pasienten i det hele tatt setter seg i stolen. Pasienter som selv kan velge time, møter oftere opp og er mer fornøyde." },
        { heading: "Trygghet gjennom visualisering", text: "Intraorale kameraer og skjermer ved stolen lar pasienten se det tannlegen ser. Forståelse reduserer angst, og visualiserte behandlingsplaner øker aksepten betydelig." },
        { heading: "Smidig oppgjør og oppfølging", text: "Digital betaling, automatiske kvitteringer og oppfølgings-SMS etter behandling gir en helhetlig, profesjonell opplevelse som pasientene husker – og anbefaler videre." },
        { heading: "Tilbakemeldinger i sanntid", text: "Korte digitale spørreundersøkelser etter besøket fanger opp misnøye før den havner på Google. Systematisk innsamling av tilbakemeldinger er også gull for kontinuerlig forbedring." },
      ],
      en: [
        { heading: "The experience starts before the visit", text: "Online booking, digital medical history forms and automatic reminders remove friction before the patient even sits in the chair. Patients who choose their own appointment show up more often and are more satisfied." },
        { heading: "Reassurance through visualization", text: "Intraoral cameras and chairside screens let patients see what the dentist sees. Understanding reduces anxiety, and visualized treatment plans significantly increase acceptance." },
        { heading: "Smooth payment and follow-up", text: "Digital payment, automatic receipts and follow-up SMS after treatment create a cohesive, professional experience patients remember – and recommend." },
        { heading: "Real-time feedback", text: "Short digital surveys after the visit catch dissatisfaction before it ends up on Google. Systematic feedback collection is also gold for continuous improvement." },
      ],
    },
  },
  {
    slug: "velge-it-leverandor",
    image: "/it-support-dental.png",
    date: "2024-12-05",
    category: { no: "IT-infrastruktur", en: "IT Infrastructure" },
    title: {
      no: "Slik Velger Du Riktig IT-Leverandør for Din Tannklinikk",
      en: "How to Choose the Right IT Provider for Your Dental Clinic",
    },
    excerpt: {
      no: "Viktige faktorer å vurdere når du skal velge en IT-partner som forstår tannhelsetjenestens unike behov.",
      en: "Important factors to consider when choosing an IT partner who understands the unique needs of dental healthcare.",
    },
    body: {
      no: [
        { heading: "Bransjekunnskap er avgjørende", text: "En generell IT-leverandør kan drifte PC-er, men forstår sjelden Opus, journalsystemer, helsenett og Datatilsynets krav. Spør konkret om erfaring fra tannhelsesektoren og be om referanser fra andre klinikker." },
        { heading: "Responstid når det haster", text: "Når journalsystemet er nede, stopper klinikken. Krev tydelige SLA-er: garantert responstid for kritiske hendelser, tilgjengelighet utenfor kontortid og mulighet for fjernhjelp." },
        { heading: "Sikkerhet og GDPR i praksis", text: "Be leverandøren dokumentere hvordan de håndterer backup, kryptering, tilgangsstyring og databehandleravtaler. En seriøs partner har svarene klare – og utfordrer deg på ting du ikke har tenkt på." },
        { heading: "Partner, ikke bare leverandør", text: "De beste avtalene inkluderer proaktiv overvåking, faste statusmøter og strategisk rådgivning. Du vil ha en partner som løfter klinikken videre, ikke bare en som rykker ut når noe er ødelagt." },
      ],
      en: [
        { heading: "Industry knowledge is crucial", text: "A generic IT provider can manage PCs but rarely understands Opus, record systems, the health network and Data Protection Authority requirements. Ask specifically about dental sector experience and request references from other clinics." },
        { heading: "Response time when it matters", text: "When the record system is down, the clinic stops. Demand clear SLAs: guaranteed response time for critical incidents, availability outside office hours and remote support capability." },
        { heading: "Security and GDPR in practice", text: "Ask the provider to document how they handle backup, encryption, access control and data processing agreements. A serious partner has the answers ready – and challenges you on things you haven't considered." },
        { heading: "Partner, not just provider", text: "The best agreements include proactive monitoring, regular status meetings and strategic advice. You want a partner who moves the clinic forward, not just someone who shows up when something breaks." },
      ],
    },
  },
  {
    slug: "teledentistry-fjernkonsultasjoner",
    image: "/digital-patient-experience.png",
    date: "2025-05-02",
    category: { no: "Teknologi", en: "Technology" },
    title: {
      no: "Teledentistry: Fjernkonsultasjoner i Tannhelsesektoren",
      en: "Teledentistry: Remote Consultations in Dental Healthcare",
    },
    excerpt: {
      no: "Hvordan implementere og dra nytte av fjernkonsultasjoner for å utvide din praksis og betjene pasienter uavhengig av geografiske begrensninger.",
      en: "How to implement and benefit from remote consultations to expand your practice and serve patients regardless of geographic constraints.",
    },
    body: {
      no: [
        { heading: "Hva er teledentistry?", text: "Teledentistry omfatter videokonsultasjoner, bildebasert triage og digital oppfølging. Det erstatter ikke klinisk behandling, men er svært effektivt for vurderinger, kontroller og rådgivning." },
        { heading: "Bruksområder som fungerer", text: "Akuttvurderinger («må jeg komme inn nå?»), postoperativ oppfølging, ortodontisk monitorering og second opinions egner seg godt for fjernkonsultasjon. Pasienter i distriktene sparer lange reiser for korte kontroller." },
        { heading: "Krav til sikkerhet", text: "Vanlige videotjenester holder ikke for helsekonsultasjoner. Løsningen må ha ende-til-ende-kryptering, norsk/EU-datalagring og integrasjon med journalsystemet for dokumentasjon." },
        { heading: "Slik kommer du i gang", text: "Definer hvilke konsultasjonstyper som tilbys digitalt, sett opp en sikker plattform, og informer pasientene ved booking. Start smått – én fast digital konsultasjonstime per dag – og utvid etter behov." },
      ],
      en: [
        { heading: "What is teledentistry?", text: "Teledentistry includes video consultations, image-based triage and digital follow-up. It doesn't replace clinical treatment, but is highly effective for assessments, check-ups and advice." },
        { heading: "Use cases that work", text: "Emergency assessments ('do I need to come in now?'), post-operative follow-up, orthodontic monitoring and second opinions are well suited for remote consultation. Rural patients save long trips for short check-ups." },
        { heading: "Security requirements", text: "Regular video services aren't adequate for health consultations. The solution must have end-to-end encryption, Norwegian/EU data storage and record system integration for documentation." },
        { heading: "How to get started", text: "Define which consultation types are offered digitally, set up a secure platform, and inform patients at booking. Start small – one fixed digital consultation slot per day – and expand as needed." },
      ],
    },
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
