# UPGRADE_PLAN.md — dentdigital.no redesign (v2, audit-informed)

Status: **awaiting approval** · Phase 1 of the working process

---

## 1. Repo audit (current state)

The codebase was rebuilt from scratch on 2026-07-04 (old repo lost; content recovered from live site). It is already modern — no framework migration needed.

| Area | Current state | Verdict |
|---|---|---|
| Framework | Next.js 16, **App Router**, React 19, TS strict | ✅ Keep |
| Styling | Tailwind CSS **v4** (`@theme` tokens in `globals.css`) | ✅ Keep, extend token layer |
| i18n | Client context (`src/lib/i18n.tsx`), NO default + EN, localStorage persist | ✅ Keep mechanism; extend strings |
| Content | Typed TS modules: `src/lib/content.ts` (UI strings), `services.ts` (10 services), `articles.ts` (9 articles, full bilingual bodies) | ✅ Keep (brief allows "typed local content"); add `cases.ts` |
| Routes | `/`, `/tjenester` (+10 slugs), `/om-oss`, `/fagartikler` (+9 slugs), `/ai`, `/kontakt`, `/api/contact` — 28 static pages | ✅ Keep all slugs (SEO) |
| Contact form | Resend via route handler, validated, works (sends from `onboarding@resend.dev` until domain verified in Resend) | ✅ Keep; restyle |
| Fonts | Inter via `next/font/google` (1 family) | 🔁 Replace: display + body pair, self-hosted |
| Images | 13 PNGs, **up to 1.3MB each**, from old site | 🔁 Re-encode to optimized formats; several look stocky → replace usage where design allows |
| Motion | One CSS fade-up keyframe | 🔁 Rebuild: Lenis + GSAP/ScrollTrigger + Motion |
| Legal | Footer Personvern/Vilkår/Cookies → link to `/kontakt` | ❌ **Defect** — build real pages |
| Case studies | None | ❌ **Defect** — build `/resultater` |
| Analytics/cookies | None set (only localStorage lang, no consent required for it) | ➕ Consent banner gating future analytics |
| Deploy | Vercel `dentdigital`, git-connected to `beckhie1/DentDigital`, domain `dentdigital.no`, auto-deploy on push to `main` | ✅ Keep |

**Defects confirmed from the brief:** no case studies · legal links broken · articles dated 2022–2023 · template aesthetics · generic dashboard-screenshot hero.

## 2. Keep / Migrate / Rebuild

**Keep as-is:** IA + all URL slugs, i18n mechanism, content data model, Resend form handler, Vercel pipeline.

**Migrate (content preserved, presentation rebuilt):** every page gets the new design language; articles get refreshed dates (2025–2026) + typographic article template; AI page reframed as capability page.

**Rebuild / net-new:**
- Design system: token layer (color, type scale, spacing, radii, motion durations) in Tailwind v4 `@theme`
- Motion system: Lenis smooth scroll, GSAP ScrollTrigger reveals, masked line reveals, count-up stats, marquee, magnetic CTAs + custom cursor (desktop), View-Transition page fades — all behind `prefers-reduced-motion`
- Hero: R3F/WebGL particle field morphing **chaos → order** (digitalization metaphor), cursor-reactive, `dynamic(..., { ssr: false })`, GPU/mobile heuristic → static poster fallback; never blocks LCP
- `/resultater` index + 2–3 case detail pages (sticky metrics column, parallax media)
- `/personvern`, `/vilkar`, `/cookies` with real GDPR content (Datatilsynet conventions) + consent banner
- 2–3 new articles (2026-dated): "AI-resepsjonist for tannklinikker", "Google-annonsering for tannleger i 2026", "Journalsystem-integrasjoner i 2026"

## 3. Design language — "Klinisk presisjon møter høyteknologi"

- Canvas `#FAFAF8` warm off-white · ink `#111110` · accent **[DECISION 1 below]** · dark inverted sections `#0C0C0B` (1–2 per page rhythm)
- Type: **Clash Display** (headlines, self-hosted via Fontshare OFL-style license) + **General Sans or Inter** (body) = 2 families max via `next/font/local`
- Editorial devices: numbered sections (01–06), hairline rules, subtle grain overlay, oversized headlines, strict 12-col grid
- Iconography: custom thin-stroke SVG set (drawn in-code), no icon library
- Emojis currently used as icons → removed everywhere

## 4. Page-by-page (target architecture)

```
/            WebGL hero → numbered services (hover-expand rows) → featured
             resultater (2 cases w/ metrics) → prosess (4 steg) → proof strip
             (count-up) → hvorfor oss → 3 nyeste fagartikler → CTA
/tjenester   Editorial index + 6 primary detail pages (slugs unchanged);
             4 secondary services fold into the index
/resultater  NEW index + case pages (utfordring → løsning → resultater)
/om-oss      Story, verdier, tech stack, lokal tilstedeværelse
/fagartikler Refreshed index + article template w/ proper typography
/ai          Capability page, demo-feel chat mock (pure UI, no live AI)
/kontakt     Lead form (navn, klinikk, tjeneste-select, melding) + org info
/personvern  /vilkar  /cookies   NEW legal + consent banner
```

No slug changes → no redirects needed; sitemap + robots + JSON-LD (`Organization`, `ProfessionalService`, `Article`) + hreflang nb/en added.

## 5. Performance & a11y budget

- Landing JS < 300KB gz **before** lazy 3D chunk (three/R3F ≈ 170KB gz loads post-LCP, desktop + capable GPUs only)
- All raster images re-encoded (target ≤ 150KB each), `next/image` everywhere
- Lighthouse ≥ 90 ×4 (mobile) · LCP < 2.5s · CLS < 0.1 · INP < 200ms — documented in `QA.md`
- WCAG AA: accent contrast tested on light + dark, focus-visible styles, full keyboard nav, reduced-motion complete experience

## 6. New dependencies

`gsap` · `lenis` · `motion` (Framer Motion) · `three` + `@react-three/fiber` + `@react-three/drei` (lazy chunk only)

## 7. Unverified marketing claims — need your review

| Claim | Source | Risk |
|---|---|---|
| "50+ klinikker i Norge" | old site | Keep? Need substantiation |
| "30% økt effektivitet og 20% vekst" | old site | Needs a case behind it |
| "5+ års erfaring" | old site | Plausible — confirm |
| "Kontorer i flere norske byer" | old site | **Likely false** (one Oslo address) → propose rewording to "Basert i Oslo – kunder i hele Norge" |
| Testimonials "Dr. Morten Hansen", "Lise Andersen" | old site (not in current build) | Do not reintroduce unless real |
| "#1 Digital Partner" | positioning | Keep as tagline (puffery, acceptable) |

## 8. Open items ([FILL IN]s from the brief)

1. **Accent color** — electric teal `#00C2B8` vs deep dental-blue `#1240FF`
2. **Case study data** — real data, or I draft 2–3 realistic anonymized cases clearly marked `[UTKAST – verifiser tall]` for your review
3. **Booking link** — Calendly/Cal.com URL for "Book gratis behovsanalyse", or CTA stays mailto/form
4. **Form destination** — stays Resend → post@dentdigital.no (recommend verifying dentdigital.no domain in Resend)

## 9. Milestones (commit per milestone, self-review vs reference bar)

1. `UPGRADE_PLAN.md` ← **you are here, awaiting approval**
2. Design system + tokens + fonts + motion utils + **one styled sample section** (home hero, static fallback first) → **pause for approval**
3. Shell: nav/footer/cursor/consent banner + smooth scroll
4. Home (incl. WebGL hero)
5. Tjenester (index + 6 details)
6. Resultater (index + cases)
7. Om oss + AI
8. Fagartikler (refresh + 3 new articles)
9. Kontakt + legal pages
10. `QA.md`: Lighthouse, i18n completeness, reduced-motion pass, form test, claims list
