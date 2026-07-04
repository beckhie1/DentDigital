# QA.md — dentdigital.no redesign

Date: 2026-07-04 · Build: 40 routes, all static except /api/contact

## Lighthouse (mobile, local prod build, simulated throttling)

| Category | Score | Guardrail |
|---|---|---|
| Performance | **92** | ≥ 90 ✅ |
| Accessibility | **100** | ≥ 90 ✅ (fixed: contrast on dark sections, lang-toggle touch target) |
| Best Practices | **100** | ≥ 90 ✅ |
| SEO | **100** | ≥ 90 ✅ |

Core Web Vitals (simulated): LCP 3.2s (simulated slow-4G; expected < 2.5s on Vercel edge + AVIF — verify in field data), CLS **0**, TBT **20ms** (INP proxy ✅).

JS budget: largest chunk ≈ 70KB gz, total first-load well under 300KB ✅. Decision: hero uses Canvas2D particles (~4KB) instead of three.js/R3F (~170KB) — same chaos→order concept, zero budget risk. gsap/motion uninstalled (unused; IO-based reveal system covers the choreography). Lenis powers smooth scroll.

## Redirect map

No slugs changed — no redirects required. New routes added: /resultater (+3 cases), /personvern, /vilkar, /cookies.

## i18n completeness

All routes fully bilingual NO/EN via language toggle (persisted in localStorage): home, tjenester (+10), resultater (+3), om-oss, fagartikler (+12), ai, kontakt, legal ×3, consent banner, nav/footer. No half-translated pages.

Note: i18n is client-side on shared URLs → hreflang alternates are not applicable (one URL serves both languages). Search engines index the Norwegian default; `lang` attribute updates on toggle.

## Reduced-motion pass

`prefers-reduced-motion: reduce` → smooth scroll disabled, particle field renders static ordered grid, all reveals/counters/marquee render final state instantly, custom cursor disabled, view transitions off (global animation kill). Complete static experience ✅.

## Form delivery

/api/contact validated (required fields, email regex, length caps, HTML-escaped). New `tjeneste` select included in email. **Not live-fire tested** to avoid sending noise email — submit one test message after deploy. Note: sends from `onboarding@resend.dev` until dentdigital.no is verified as a Resend domain (recommended).

## Cookie/consent status

Site sets **no cookies**. localStorage only: language + consent choice (strictly necessary, not sent to server). Consent banner gates any future analytics; /cookies documents this accurately.

## Unverified marketing claims — REVIEW REQUIRED

| Claim | Location | Status |
|---|---|---|
| "50+ klinikker i Norge" | home proof strip | ⚠️ unverified — confirm or adjust |
| "5+ års erfaring" | home proof strip | ⚠️ unverified — confirm |
| "30% økt effektivitet / 20% vekst" | why-us section | ⚠️ unverified — confirm |
| **All 3 case studies** (`src/lib/cases.ts`, `verified: false`) | /resultater, home, service pages | ⚠️ **drafted anonymized numbers — replace/confirm with real data before marketing pushes** |
| "Kontorer i flere norske byer" | — | ✅ removed, reworded to "Basert i Oslo – kunder i hele Norge" |
| Old testimonials (Dr. Morten Hansen etc.) | — | ✅ not reintroduced |
| "#1 Digital Partner" | hero badge | kept as positioning tagline |

## Follow-ups (optional)

1. Verify dentdigital.no in Resend → send from own domain.
2. Replace remaining stock-ish PNGs with brand photography/renders when available.
3. Field-verify LCP in Vercel Speed Insights after launch.
