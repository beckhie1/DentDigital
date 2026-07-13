# DentDigital – oppsøkende salg (LES MEG)

Alt er nå samlet i **to lister**. Alle overlappende kilder er arkivert i `kilder/`.

## De to listene

| Fil | Hva | Antall | Kanal |
|---|---|---|---|
| **clinics.csv** | Klinikker med e-post | 118 | 📧 E-post (automatisk via send.mjs) |
| **call-list.csv** | Klinikker uten e-post/nettside | 105 | 📞 Telefon (du ringer) |

Til sammen ~223 unike klinikker. Ingen dobbeltføring – en klinikk er enten i e-postlista eller ringelista.

## Daglig rutine (15–20 min)

**1. Send e-post (tir–tor morgen):**
```
node outreach/send.mjs --send --limit 5
```
Sender til de 5 neste. Logger automatisk i `sent.log` – aldri dobbelt. Øk til 8–10/dag etter uke 1.

**2. Ring 5–10 fra call-list.csv:**
Åpne `call-list.csv`, ring nedover. Bruk manuset nederst her. Skriv i `status`-kolonnen: `svar` / `møte` / `nei` / `ring igjen`.

**3. Svar på innkommende:** Sjekk post@dentdigital.no minst to ganger daglig. Svar innen en time når du kan.

## Ringemanus (call-list)

> «Hei, snakker jeg med tannlege [navn]? Jeg heter Muhammad Umar Nadeem og driver DentDigital – vi bygger nettsider og skaffer pasienter kun for tannklinikker. Grunnen til at jeg ringer: jeg fant klinikken din, men dere har ingen nettside – så når noen googler "tannlege [sted]" i dag, finner de konkurrentene, ikke dere. Første måned er gratis, ingen binding. Kan jeg vise deg hvordan det ser ut – 15 minutter?»

Fellesskap-vinkel (der det passer): tilby gjerne urdu/punjabi og et fysisk møte.

## Kommandoer

| Kommando | Gjør |
|---|---|
| `node outreach/send.mjs --preview` | Vis neste batch uten å sende |
| `node outreach/send.mjs --send --limit 5` | Send 5 e-poster |
| `node outreach/send.mjs --test din@epost.no` | Send testmail til deg selv |

## Statuskolonner (fyll ut selv)

- **clinics.csv → `status`**: `ready` (klar) endres av scriptet til sendt-logg. Skriv `nei`/`svar`/`møte` manuelt ved behov.
- **call-list.csv → `status` / `neste`**: din CRM. Fyll ut etter hver samtale.

## Arkiv (`kilder/`)

Rådataene (prospects-v3/v5, no-website, community-liste) ligger her hvis du trenger å slå opp noe. Du trenger dem ikke i det daglige.
