# Kampanjeplan — Oslo-området, community-segment

Mål: booke 15-minutters samtaler med klinikkeiere i Oslo + 50 km. Din fordel i dette segmentet: felles bakgrunn og språk — bruk det ærlig og lett, ikke som hovedargument.

## Segmenter (fra pak-oslo-clinics.csv)

| Segment | Antall | Kanal | Vinkel |
|---|---|---|---|
| A: Etablert klinikk med e-post (`ready`) | 5 | E-post → oppfølging → telefon | Flere bookinger, lavere kostnad per pasient |
| B: Solo-praksis uten nettside (`finn kontakt`/`ring`) | 21 | Telefon først (slå opp nr. på 1881) | **Har ikke nettside** = usynlig på Google. Sterkeste pitch i hele listen |
| C: `VERIFISER FØRST` (MyDentist) | 1 | — | Mulig samme eier som Din Tannklinikk (allerede kontaktet). Sjekk før du gjør noe |

Segment B utvidet 2026-07-12 med 12 klinikker i 100 km-ringen: Moss ×2, Sarpsborg ×2 (Dilshad – mulig familie, én samtale kan dekke begge), Horten, Åsgårdstrand, Kongsberg, Kongsvinger, Mjøndalen, Gran. For disse gjelder telefon/Teams-avslutningen i e-postmalen – ikke «kommer innom»-tilbudet (utenfor 50 km), men for community-segmentet kan du gjerne tilby å møtes likevel når du ringer.

## Sekvens (segment A)

- **Dag 0 (tir/ons 08:30–10:00):** Personlig e-post (mal under)
- **Dag 5:** Kort oppfølging i samme tråd (gjenbruk oppfølgingsmalen i email-mal.md)
- **Dag 10:** Ring klinikken. Referer til e-posten. Be om 15 min
- **Dag 20:** Siste e-post — «lukker saken», tilby gratis synlighetsanalyse som avslutning

Send maks 5–8 per dag fra egen adresse (unngå spamfilter), og logg status i CSV-en (kolonne `status`: sendt / fulgt opp / ringt / møte / nei).

## E-postmal (segment A) — justert for dette segmentet

**Emne:** {{subject}}

Hei {{contact_name}},

Jeg heter Muhammad Umar Nadeem og driver DentDigital – et byrå som utelukkende jobber med digital markedsføring og IT for tannklinikker i Norge.

Jeg tar kontakt fordi jeg jobber med flere klinikker i Oslo-området og ser det samme mønsteret overalt: klinikkene som vinner «tannlege + bydel»-søkene på Google fyller kalenderen, resten betaler stadig mer per pasient. {{clinic}} har et godt utgangspunkt – men det er konkrete ting som kan løftes.

Det vi leverer:

- Nettside/landingssider med direkte booking, bygget for mobil
- Lokal SEO slik at dere vinner søkene i {{city}} organisk
- Annonsering målt på bookede timer – ikke klikk
- Automatiske SMS-påminnelser som kutter uteblivelser

**Første måned er gratis** – full oppstart, ingen binding.

Og helt uformelt: om det er enklere å ta praten på urdu eller punjabi, gjør vi gjerne det. 

Har du 15 minutter denne eller neste uke?

Vennlig hilsen
Muhammad Umar Nadeem
DentDigital AS · post@dentdigital.no · www.dentdigital.no

## Ringemanus (segment B — solo-praksis uten nettside)

> «Hei, snakker jeg med tannlege {{etternavn}}? Jeg heter Muhammad Umar Nadeem og driver DentDigital – vi bygger nettsider og skaffer pasienter kun for tannklinikker. Grunnen til at jeg ringer akkurat deg: jeg fant praksisen din på 1881, men du har ingen nettside – så når noen googler "tannlege {{bydel}}" i dag, finner de konkurrentene dine, ikke deg. Vi setter opp nettside med online booking og sørger for at du dukker opp på Google. Første måned er gratis, ingen binding. Kan jeg vise deg hvordan det ser ut – 15 minutter, gjerne over kaffe siden jeg er i Oslo selv?»

Innvendinger:
- «Har nok pasienter» → «Flott – da handler det om å eie navnet ditt på Google før noen andre gjør det, og å kutte uteblivelser med SMS. Det sparer deg penger fra dag én.»
- «Hva koster det?» → «Første måned gratis. Etterpå fast månedspris uten binding – jeg viser deg tallene i møtet.»
- «Send meg noe» → Be om e-postadresse (mangler for de fleste i segment B!) og send mal A samme dag.

## Neste steg / mangler

1. **Verifiser MyDentist** mot Din Tannklinikk før kontakt (samme «Manzar»?)
2. Slå opp telefonnumre for segment B på 1881.no (offentlig, 2 min per stk.)
3. Sett opp mail merge (Gmail + YAMM/GMass) med pak-oslo-clinics.csv
4. Samme jusnotat som før: B2B-e-post til klinikkadresser er OK (mfl. § 15); dropp masseutsendelse til private adresser

## Viktig forbehold

Listen er basert på offentlig tilgjengelige navn på eiere/daglig ledere (klinikksider, proff.no, 1881). Navn er en upresis indikator på bakgrunn — verifiser selv før du bruker den personlige vinkelen, og dropp den om du er usikker.
