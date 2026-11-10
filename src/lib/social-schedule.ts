/**
 * Weekly organic Reels for Groruddalen Tannlegesenter (FB page + Instagram),
 * published by the /api/social-weekly cron every Saturday 18:00 Oslo time.
 */

const BLOB = "https://gisgkzjbvkzk4doq.public.blob.vercel-storage.com/social/gdts";
const OFFER_URL = "https://www.dentdigital.no/groruddalen-tannlegesenter-tilbud";

export const GDTS_SOCIAL = {
  pageId: "686064441256481",
  igUserId: "17841435653380210",
};

export interface SocialPost {
  /** Oslo date, YYYY-MM-DD (a Saturday) */
  date: string;
  tag: string;
  videoUrl: string;
  /** Body shared by both platforms; first line must be unique (used for duplicate detection) */
  text: string;
}

const footerIg =
  "📞 Ring 92 02 92 02 eller send oss en melding her på Instagram, så finner vi en time.\n" +
  "📍 Kakkelovnskroken 3, 0954 Oslo – rett ved Rødtvet T-bane\n\n" +
  "#groruddalen #tannlege #tannlegeoslo #airflow #tannrens #grorud #stovner #romsås";
const footerFb = (tag: string) =>
  `👉 Bestill her: ${OFFER_URL}?utm_source=facebook&utm_medium=organic&utm_campaign=hoest_2026&utm_content=${tag}\n` +
  "📞 Eller ring 92 02 92 02\n📍 Kakkelovnskroken 3, 0954 Oslo – rett ved Rødtvet T-bane";

export const GDTS_POSTS: SocialPost[] = [
  {
    date: "2026-10-31",
    tag: "vo01_generell",
    videoUrl: `${BLOB}/GDTS_01_Generell_paaminnelse_med_voice.mp4`,
    text:
      "Er det lenge siden du sjekket tennene sist? 🦷\n\n" +
      "Nå får du komplett undersøkelse med røntgen og konsultasjon + Premium Airflow-rens for kun 590 kr (ordinær pris 1 390 kr). Begrenset antall plasser.",
  },
  {
    date: "2026-11-07",
    tag: "vo02_ny_kampanje",
    videoUrl: `${BLOB}/GDTS_02_Ny_kampanje_med_voice.mp4`,
    text:
      "Gikk du glipp av sommertilbudet? Nå er det ny kampanje! 🍂\n\n" +
      "Komplett undersøkelse med røntgen + Premium Airflow-rens for bare 590 kr hos Groruddalen Tannlegesenter. Begrenset antall plasser.",
  },
  {
    date: "2026-11-14",
    tag: "vo03_tannverk",
    videoUrl: `${BLOB}/GDTS_03_Tannverk_med_voice.mp4`,
    text:
      "Har du tannverk? Ikke vent til det blir alvorlig – og dyrere. 😬\n\n" +
      "Vi hjelper deg raskt. Akkurat nå: komplett undersøkelse med røntgen, konsultasjon og Airflow-rens for kun 590 kr.",
  },
  {
    date: "2026-11-21",
    tag: "vo04a_misfarging_ba",
    videoUrl: `${BLOB}/GDTS_04_Misfarging_foer-etter_med_voice.mp4`,
    text:
      "Misfarging på tennene etter år med kaffe, te og rødvin? ☕\n\n" +
      "Premium Airflow-rens fjerner misfarging skånsomt – helt uten bleking. Nå får du komplett undersøkelse med røntgen og Airflow-rens for bare 590 kr.",
  },
  {
    date: "2026-11-28",
    tag: "vo04b_misfarging_modell",
    videoUrl: `${BLOB}/GDTS_04_Misfarging_modell_med_voice.mp4`,
    text:
      "Vil du ha smilet ditt tilbake? ✨\n\n" +
      "Airflow-rens løfter misfarging fra kaffe, te og rødvin skånsomt bort – uten bleking. Komplett undersøkelse med røntgen og Airflow-rens: kun 590 kr.",
  },
  {
    date: "2026-12-05",
    tag: "vo05_tannstein",
    videoUrl: `${BLOB}/GDTS_05_Tannstein_med_voice.mp4`,
    text:
      "Tannstein? Tannbørsten klarer ikke å fjerne den alene. 🪥\n\n" +
      "Belegg langs tannkjøttet bør fjernes profesjonelt før det gir betennelse og dårlig ånde. Komplett undersøkelse med røntgen og Airflow-rens koster nå kun 590 kr.",
  },
  {
    date: "2026-12-12",
    tag: "vo06_tannlegeskrekk",
    videoUrl: `${BLOB}/GDTS_06_Tannlegeskrekk_med_voice.mp4`,
    text:
      "Gruer du deg til å gå til tannlegen? Du er langt fra alene. 💙\n\n" +
      "Hos oss tar vi oss god tid og forklarer alt underveis. Nå får du en trygg og grundig undersøkelse med røntgen, konsultasjon og Airflow-rens for kun 590 kr.",
  },
];

export const igCaption = (p: SocialPost) => `${p.text}\n\n${footerIg}`;
export const fbCaption = (p: SocialPost) => `${p.text}\n\n${footerFb(p.tag)}`;

/** Today's date in Oslo as YYYY-MM-DD. */
export function osloDate(d = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Oslo" }).format(d);
}
