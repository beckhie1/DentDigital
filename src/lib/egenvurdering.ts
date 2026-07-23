/**
 * Schema for «Egenvurdering av funksjon og arbeidsevne» — patient self-assessment
 * form used before evaluation of sick leave and work capacity.
 *
 * Single source of truth: drives the form UI, the HTML email, and the PDF replica.
 *
 * Answer storage (FormValues):
 * - text/textarea:  values[id] = string
 * - radio:          values[id] = the selected option string
 *                   follow-up text (when followUpLabel is defined) = values[`${id}_utdyp`]
 * - checkboxes:     values[id] = string[] of selected option strings
 *                   follow-up text = values[`${id}_utdyp`]
 * - scale:          values[id] = "0".."10", location text = values[`${id}_hvor`]
 * - matrix:         values[`${id}_${rowNumber}`] = column index as string ("0"-based)
 */

export type FormValues = Record<string, string | string[]>;

export type Item =
  | { kind: "text"; id: string; label: string }
  | { kind: "textarea"; id: string; label: string }
  | { kind: "radio"; id: string; label: string; options: string[]; note?: string; followUpLabel?: string }
  | { kind: "checkboxes"; id: string; label: string; options: string[]; followUpLabel?: string }
  | { kind: "scale"; id: string; label: string; max: number }
  | {
      kind: "matrix";
      id: string;
      /** Sub-heading above the table (e.g. "Stemning (PHQ-9)") */
      heading?: string;
      /** First (label) column header */
      header: string;
      columns: string[];
      rows: string[];
    };

export interface Section {
  num: number;
  title: string;
  intro?: string;
  items: Item[];
}

export const FORM_TITLE = "Egenvurdering av funksjon og arbeidsevne";
export const FORM_SUBTITLE = "Pasientskjema til bruk før vurdering av sykmelding og arbeidsevne";

export const INTRO_BOX = {
  title: "Hvorfor fyller du ut dette?",
  paragraphs: [
    "Legen din har to roller samtidig: behandler for deg, og sakkyndig overfor NAV. Det betyr at legen skal vurdere så objektivt som mulig hva du faktisk kan og ikke kan gjøre i arbeid, og hvordan helsen din påvirker arbeidsevnen. Svarene dine er det viktigste grunnlaget for den vurderingen. Jo mer konkret du svarer, jo bedre plan kan dere legge sammen.",
  ],
  privacy:
    "Personvern: Skjemaet er en del av journalen din og behandles fortrolig. Legen deler bare opplysninger med arbeidsgiver eller NAV når du har samtykket, eller når loven krever det.",
};

/** PHQ-9 item 9 answer key — a value > 0 triggers the crisis-help notice highlight. */
export const PHQ9_SELFHARM_KEY = "phq_9";

export const SAFETY_NOTICE = {
  lead: "Hvis du kjente deg igjen i det siste punktet:",
  text: "det er viktig at du sier det til legen din, så dere kan snakke om det. Du er ikke alene, og det finnes hjelp. Mental Helses hjelpetelefon 116 123 er åpen hele døgnet. Ved akutt fare, ring 113.",
};

const FREQ_COLUMNS = [
  "Ikke i det hele tatt (0)",
  "Flere dager (1)",
  "Mer enn halvparten av dagene (2)",
  "Nesten hver dag (3)",
];

export const sections: Section[] = [
  {
    num: 1,
    title: "Helseplager og sykehistorie",
    items: [
      {
        kind: "textarea",
        id: "q1_1",
        label:
          "1.1 Hva er hovedårsaken til at du søker lege nå? Beskriv hva som plager deg, hva som har skjedd, og hva du ønsker hjelp til.",
      },
      { kind: "textarea", id: "q1_2", label: "1.2 Når startet plagene, og hvordan har de utviklet seg?" },
      { kind: "textarea", id: "q1_3", label: "1.3 Har du hatt lignende plager før? Når, og hva ble gjort da?" },
      { kind: "textarea", id: "q1_4", label: "1.4 Har du fått noen diagnose(r)? Hvis ja, hvilke og av hvem?" },
      {
        kind: "textarea",
        id: "q1_5",
        label: "1.5 Hvilke utredninger er gjort? (røntgen/CT/MR, blodprøver, fysioterapi, spesialist)",
      },
      {
        kind: "textarea",
        id: "q1_6",
        label: "1.6 Hvilke medisiner og kosttilskudd bruker du nå? (navn og dose hvis du vet)",
      },
    ],
  },
  {
    num: 2,
    title: "Symptomer og helsetilstand i dag",
    items: [
      {
        kind: "textarea",
        id: "q2_1",
        label: "2.1 Hvilke symptomer har du nå, og hvordan påvirker de deg fysisk og mentalt?",
      },
      { kind: "textarea", id: "q2_2", label: "2.2 Hvordan er energien din gjennom dagen? Beskriv eventuell utmattelse." },
      { kind: "textarea", id: "q2_3", label: "2.3 Hvordan sover du? Antall timer og eventuelle søvnproblemer." },
      {
        kind: "scale",
        id: "pain",
        label: "2.4 Har du smerter? Marker styrken nå (0 = ingen, 10 = verst tenkelig), og skriv hvor i kroppen.",
        max: 10,
      },
    ],
  },
  {
    num: 3,
    title: "Funksjonsevne – hva du faktisk klarer",
    intro:
      "Dette er kjernen i vurderingen. En sykmelding bygger på funksjon, ikke på diagnose alene. Kryss av for hvor mye helsen påvirker hvert punkt.",
    items: [
      {
        kind: "matrix",
        id: "func",
        header: "Hvor mye påvirker helsen din dette?",
        columns: ["Ingen problemer", "Litt vansker", "Middels", "Store vansker", "Klarer ikke"],
        rows: [
          "Sitte over tid",
          "Stå og gå",
          "Løfte og bære",
          "Bruke armer og hender (finmotorikk)",
          "Konsentrasjon og hukommelse",
          "Tempo og utholdenhet en hel arbeidsdag",
          "Takle tidspress og krav",
          "Samhandle med kolleger, kunder eller pasienter",
          "Takle stress og uforutsette ting",
          "Komme seg til og fra jobb",
        ],
      },
      {
        kind: "textarea",
        id: "q3_1",
        label: "3.1 Hvilke daglige aktiviteter klarer du nå? (f.eks. handle, lage mat, rydde, trene, følge opp barn)",
      },
      { kind: "textarea", id: "q3_2", label: "3.2 Hva får du ikke til, eller klarer bare med hjelp?" },
    ],
  },
  {
    num: 4,
    title: "Arbeidssituasjon",
    items: [
      { kind: "textarea", id: "q4_1", label: "4.1 Hvor jobber du, og hva slags jobb har du?" },
      { kind: "textarea", id: "q4_2", label: "4.2 Hva består arbeidsoppgavene dine i? Vær konkret." },
      { kind: "text", id: "q4_3", label: "4.3 Stillingsprosent og arbeidstid (dag, kveld, helg, skift, natt):" },
      {
        kind: "text",
        id: "q4_4",
        label: "4.4 Har du mer enn én jobb eller annet fast ansvar (frivillighet, omsorg for barn eller voksne)?",
      },
      { kind: "textarea", id: "q4_5", label: "4.5 Er det noe i jobben som belaster deg særlig mye fysisk eller mentalt?" },
      { kind: "text", id: "q4_6", label: "4.6 Hvordan kommer du deg til og fra jobb, og hvor lang reisevei har du?" },
      { kind: "text", id: "q4_7", label: "4.7 Er du helt eller delvis borte fra jobb nå? Hvis ja, hvor lenge sammenhengende?" },
      { kind: "text", id: "q4_8", label: "4.8 Har du hatt lengre sykefravær de siste to årene? Hvor lenge, og for hva?" },
    ],
  },
  {
    num: 5,
    title: "Arbeid og funksjon – hva du kan klare nå",
    items: [
      { kind: "textarea", id: "q5_1", label: "5.1 Hvilke av dine vanlige arbeidsoppgaver klarer du å utføre nå?" },
      { kind: "textarea", id: "q5_2", label: "5.2 Er det oppgaver du fortsatt mestrer fullt ut, selv om du er syk?" },
      { kind: "textarea", id: "q5_3", label: "5.3 Hvordan påvirker arbeid symptomene dine? Hva forverrer, og hva lindrer?" },
      { kind: "textarea", id: "q5_4", label: "5.4 Er det fare for deg selv eller andre hvis du forsøker å jobbe nå? Beskriv hvordan." },
      {
        kind: "radio",
        id: "q5_5",
        label: "5.5 Hvor stor del av ditt normale arbeid tror du at du kan klare nå, hvis du får tilrettelegging?",
        note: "Gradert sykmelding betyr at du er i arbeid i den grad det er mulig. Selv litt arbeid holder deg i kontakt med arbeidsplassen og hverdagen.",
        options: ["Tilnærmet alt", "Mer enn halvparten", "Omtrent halvparten", "Mindre enn halvparten", "Nesten ingenting nå"],
      },
    ],
  },
  {
    num: 6,
    title: "Tilrettelegging og dialog med arbeidsgiver",
    items: [
      {
        kind: "radio",
        id: "q6_1",
        label: "6.1 Har du snakket med arbeidsgiver om muligheten for tilpasning?",
        options: ["Ja", "Nei"],
        followUpLabel: "Hvis nei – hvorfor ikke?",
      },
      {
        kind: "radio",
        id: "q6_2",
        label: "6.2 Opplever du arbeidsgiver som positiv til tilrettelegging?",
        options: ["Ja", "Nei", "Usikker"],
      },
      {
        kind: "checkboxes",
        id: "q6_3",
        label: "6.3 Hva slags tilrettelegging kunne gjort det mulig å være i arbeid? (kryss av alt som passer)",
        options: [
          "Gradert sykmelding",
          "Hjemmekontor",
          "Fleksibel arbeidstid",
          "Redusert tempo eller krav",
          "Midlertidig andre oppgaver",
          "Hjelpemidler",
        ],
        followUpLabel: "Annet, eller utdyp:",
      },
      {
        kind: "textarea",
        id: "q6_4",
        label:
          "6.4 Er det forhold på arbeidsplassen som gjør det vanskelig? (konflikt, stress, omorganisering, oppsigelser, endringer)",
      },
      {
        kind: "radio",
        id: "q6_5",
        label: "6.5 Samtykker du til at legen kan kontakte arbeidsgiver for å hjelpe deg tilbake i arbeid?",
        options: ["Ja", "Nei"],
      },
    ],
  },
  {
    num: 7,
    title: "Behandling og prognose",
    items: [
      { kind: "textarea", id: "q7_1", label: "7.1 Hvilken behandling mottar du nå? (fysioterapi, medisiner, samtaleterapi osv.)" },
      { kind: "textarea", id: "q7_2", label: "7.2 Hva er planlagt fremover av utredning, behandling eller henvisning?" },
      {
        kind: "radio",
        id: "q7_3",
        label: "7.3 Kan behandlingen kombineres med delvis arbeid?",
        options: ["Ja", "Nei", "Vet ikke"],
      },
      { kind: "textarea", id: "q7_4", label: "7.4 Når tror du selv at du kan jobbe mer enn i dag? Hva skal til?" },
    ],
  },
  {
    num: 8,
    title: "Psykisk helse og mestring",
    intro:
      "Mange med fysiske plager har også perioder med nedstemthet eller uro. Disse to skjemaene (PHQ-9 og GAD-7) er anerkjente verktøy som hjelper legen å fange opp dette. Sett ett kryss per linje.",
    items: [
      {
        kind: "matrix",
        id: "phq",
        heading: "Stemning (PHQ-9)",
        header: "I løpet av de siste 2 ukene, hvor ofte har du vært plaget av:",
        columns: FREQ_COLUMNS,
        rows: [
          "1. Liten interesse eller glede av å gjøre ting",
          "2. Følt deg nedfor, deprimert eller fylt av håpløshet",
          "3. Problemer med å sovne, sove uten avbrudd, eller sovet for mye",
          "4. Følt deg trett eller hatt lite energi",
          "5. Dårlig appetitt eller spist for mye",
          "6. Dårlige tanker om deg selv, følt deg mislykket eller at du har sviktet deg selv eller familien",
          "7. Problemer med å konsentrere deg, for eksempel om TV eller lesing",
          "8. Beveget eller snakket så sakte at andre har merket det, eller motsatt vært uvanlig urolig og rastløs",
          "9. Tanker om at du heller ville vært død, eller om å skade deg selv på et eller annet vis",
        ],
      },
      {
        kind: "matrix",
        id: "gad",
        heading: "Uro og bekymring (GAD-7)",
        header: "I løpet av de siste 2 ukene, hvor ofte har du vært plaget av:",
        columns: FREQ_COLUMNS,
        rows: [
          "1. Følt deg nervøs, engstelig eller veldig stresset",
          "2. Ikke klart å stoppe eller kontrollere bekymringene dine",
          "3. Bekymret deg for mye om forskjellige ting",
          "4. Hatt vanskelig for å slappe av",
          "5. Vært så rastløs at du har hatt vanskelig for å sitte stille",
          "6. Blitt lett irritert eller fort sint",
          "7. Følt redsel, som om noe forferdelig kunne skje",
        ],
      },
      {
        kind: "radio",
        id: "q8_1",
        label: "8.1 Hva tror du selv er årsaken til disse plagene?",
        options: ["Jobb", "Privatliv", "Kombinasjon", "Annet"],
        followUpLabel: "",
      },
      { kind: "textarea", id: "q8_2", label: "8.2 Hva gjør du selv for å mestre situasjonen?" },
      { kind: "textarea", id: "q8_3", label: "8.3 Hva har hjulpet deg tidligere når du har hatt det vanskelig?" },
    ],
  },
  {
    num: 9,
    title: "Egenvurdering og mål",
    items: [
      { kind: "textarea", id: "q9_1", label: "9.1 Hva ønsker du å oppnå de neste 4–12 ukene, med tanke på helse og arbeid?" },
      { kind: "textarea", id: "q9_2", label: "9.2 Hva tror du selv skal til for at du kan jobbe mer, eller komme tilbake i jobb?" },
      {
        kind: "radio",
        id: "q9_3",
        label: "9.3 Hvis du tenker at du trenger sykmelding nå: hvor mye, og hvorfor?",
        note: "Beskriv hvordan helsen påvirker arbeidsfunksjonen din, og hva du eventuelt kan gjøre på jobb. Den endelige graden settes av legen sammen med deg.",
        options: ["100 %", "80 %", "60 %", "40 %", "20 %", "Ikke behov nå"],
        followUpLabel: "",
      },
      {
        kind: "radio",
        id: "q9_4",
        label: "9.4 Hvor lang periode tror du at du trenger denne gangen?",
        options: ["Inntil 1 uke", "1–2 uker", "2–3 uker", "Mer – utdyp under"],
        followUpLabel:
          "Hvordan planlegger du å bruke perioden for å komme nærmere arbeid? (behandling, fysioterapi, struktur, søvn, aktivitet, oppfølging med NAV eller arbeidsgiver)",
      },
    ],
  },
  {
    num: 10,
    title: "Tilleggsopplysninger",
    items: [
      {
        kind: "textarea",
        id: "q10_1",
        label: "Er det noe annet du mener legen bør vite for å gi NAV en god vurdering?",
      },
    ],
  },
];

export const CLOSING = {
  title: "Sykmelding og veien videre",
  subtitle: "Til deg som pasient",
  intro:
    "Takk for at du har fylt ut skjemaet. Svarene gir et viktig grunnlag for at vi sammen kan legge en god plan. Som fastlege har jeg ansvar både for å støtte deg som pasient og for å vurdere arbeidsevnen din objektivt overfor NAV. Målet er at du skal bli bedre og komme tilbake i arbeid, helt eller delvis, så raskt det er medisinsk forsvarlig.",
  pointsTitle: "Noen punkter det er greit å kjenne til:",
  points: [
    {
      lead: "Arbeid er ofte god medisin.",
      text: "Ved mange plager, særlig psykiske, kan langt fravær forlenge eller forverre tilstanden. Gradert sykmelding er derfor som regel bedre enn 100 % fravær, fordi det holder deg i kontakt med arbeidsplassen og strukturen i hverdagen.",
    },
    {
      lead: "Vi ser på hva du kan gjøre, ikke bare hva du ikke kan.",
      text: "Det gjelder både for deg og for arbeidsgiver.",
    },
    {
      lead: "Du er en aktiv deltaker.",
      text: "Din viktigste oppgave er å ha dialog med arbeidsgiver om tilrettelegging. Arbeidsgiver har plikt til å tilrettelegge der det er mulig.",
    },
    {
      lead: "Innen 4 uker skal dere ha laget en oppfølgingsplan.",
      text: "Spør arbeidsgiver om dette hvis det ikke er gjort.",
    },
    {
      lead: "Innen 8 uker gjelder aktivitetsplikten.",
      text: "NAV krever da at du deltar i en form for arbeidsrelatert aktivitet, med mindre tungtveiende medisinske grunner taler mot det. Dette må dokumenteres.",
    },
    {
      lead: "Du kan alltid friskmelde deg selv.",
      text: "Blir du bedre raskere enn ventet, kan du gjenoppta arbeidet i dialog med arbeidsgiver når som helst. Du trenger ikke vente på ny legetime.",
    },
    {
      lead: "Sykmelding er ikke alltid svaret.",
      text: "Opplever du ingen bedring av å være borte fra jobb, må vi vurdere andre tiltak. Det gjelder særlig ved langvarige eller sammensatte plager.",
    },
  ],
  quote:
    "Vi jobber sammen – du, jeg og arbeidsgiver – for å finne løsninger som fungerer. Målet er felles: at du skal bli frisk og arbeidsfør igjen.",
  signoff: ["Med vennlig hilsen", "Din fastlege"],
};

/* ---------- helpers shared by form / email / pdf ---------- */

export function getString(values: FormValues, key: string): string {
  const v = values[key];
  return typeof v === "string" ? v.trim() : "";
}

export function getArray(values: FormValues, key: string): string[] {
  const v = values[key];
  return Array.isArray(v) ? v : [];
}

/** Oslo-local date as dd.mm.yyyy */
export function osloDate(): string {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: "Europe/Oslo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}
