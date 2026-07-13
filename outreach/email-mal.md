# Outreach-maler — DentDigital

Førstegangs-e-posten sendes automatisk via `outreach/send.mjs` (tekst + HTML med signatur). Malen under er identisk og brukes ved manuell sending. Flettefelt fra clinics.csv: {{contact_name}}, {{clinic}}, {{subject}}.

---

## Hovedmal (førstegangs e-post — samme som send.mjs)

**Emne:** {{subject}}

Hei {{contact_name | ""}},

Jeg heter Muhammad Umar Nadeem og driver DentDigital – vi jobber utelukkende med digital markedsføring for tannklinikker i Norge.

Jeg kom over {{clinic}} og ser et klart potensial for å hente flere pasienter fra Google og sosiale medier enn dere gjør i dag. Det som skiller oss fra generelle byråer: vi har et eget medieteam som produserer profesjonelle videoer skreddersydd for tannbehandlinger – Invisalign, tannbleking, førstegangsundersøkelse – innhold som faktisk konverterer til timebestillinger, ikke generiske stockbilder.

Kort om hva vi leverer:

- Google- og Meta-annonsering målt på bookede timer – ikke klikk
- Profesjonell videoproduksjon tilpasset deres behandlinger
- Nettside/landingssider bygget for flere timebestillinger
- Automatisk pasientoppfølging og systematisk innsamling av flere Google-anmeldelser

**Første måned er gratis** – dere betaler kun de faktiske annonsekostnadene til Google og Meta. Vi tar ingenting for arbeidet i denne perioden.

Har du 15 minutter til en uforpliktende prat denne uken? Jeg kommer gjerne innom klinikken hvis det er enklere.

Med vennlig hilsen

Muhammad Umar Nadeem
Business Development Manager
DentDigital – Digital partner for norske tannklinikker
post@dentdigital.no · www.dentdigital.no

---

## Oppfølging (5–7 dager senere, samme tråd)

**Emne:** Re: {{subject}}

Hei igjen,

Jeg vet hverdagen på klinikken er travel, så jeg holder det kort: tilbudet om en gratis oppstartsmåned for {{clinic}} står fortsatt – dere betaler kun annonsekostnadene.

Om det er enklere kan jeg først sende en kostnadsfri, uforpliktende analyse av deres synlighet på Google sammenlignet med de nærmeste konkurrentene – den lager vi uansett før vi anbefaler noe.

Er det interessant?

Med vennlig hilsen
Muhammad Umar Nadeem
Business Development Manager, DentDigital

---

## Notater

- Sending: `node outreach/send.mjs --send --limit 5` (dry-run uten `--send`; logg i outreach/sent.log).
- B2B-e-post til klinikkens fellesadresser (post@/kontakt@) er tillatt etter markedsføringsloven § 15; unngå masseutsendelse til personlige adresser uten samtykke.
- Rader med status «email mangler» har kontaktskjema på nettsiden – send manuelt der.
- Smil Tannlegesenter: Bjørvika og Bekkestua deler info@ – send én e-post som nevner begge avdelinger.
- Ikke beskriv styring av anmeldelser («fornøyde til Google») skriftlig – det bryter Googles retningslinjer. Si «systematisk innsamling av flere Google-anmeldelser».
- Ikke nevn hvordan listen er funnet.
