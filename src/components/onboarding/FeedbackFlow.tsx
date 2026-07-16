"use client";

import { useState } from "react";
import Image from "next/image";
import type { Clinic } from "@/lib/clinics";
import { submitFeedback } from "@/app/actions/submit-feedback";
import LandingShell from "./LandingShell";

const EMOJIS = ["😞", "😕", "😐", "😊", "😁"];

type View = "survey" | "negative" | "positive" | "submitted";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-base placeholder:text-ink-40 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--l-cta)]";

/** Feedback flow: dentdigital.no/{feedbackCode} — mirrors gdts.no/tilbakemelding. */
export default function FeedbackFlow({ clinic }: { clinic: Clinic }) {
  const [view, setView] = useState<View>("survey");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitRating = () => {
    if (!rating) return;
    setView(rating <= 4 ? "negative" : "positive");
  };

  const handleSubmitNegative = async () => {
    setSubmitting(true);
    try {
      await submitFeedback({ clinicSlug: clinic.slug, rating: rating!, name, phone, comment });
    } finally {
      setSubmitting(false);
      setView("submitted");
    }
  };

  return (
    <LandingShell clinic={clinic}>
      <div className="mx-auto w-full max-w-md">
        {/* Clinic identity */}
        <div className="mb-6 text-center">
          {clinic.branding?.logo && (
            <Image
              src={clinic.branding.logo}
              alt={clinic.name}
              width={64}
              height={64}
              className="mx-auto mb-2 h-14 w-14 rounded-xl sm:h-16 sm:w-16"
            />
          )}
          <h2 className="font-display text-lg font-semibold tracking-tight">{clinic.name}</h2>
          <p className="text-xs uppercase tracking-widest text-ink-40">Tilbakemelding</p>
        </div>

        {view === "survey" && (
          <div className="rounded-card border border-line bg-white p-5 shadow-lg sm:p-7">
            <h1 className="font-display mb-3 text-xl font-semibold sm:text-2xl">Tilbakemelding</h1>
            <p className="mb-4 text-[15px] leading-relaxed text-ink-60">
              Vi ønsker alltid å forbedre oss og setter pris på din tilbakemelding. Ditt svar er 100 % anonymt.
            </p>
            <p className="mb-5 text-sm font-medium">
              Basert på behandlingen, hvor fornøyd er du med opplevelsen?
            </p>

            <div className="mb-2 flex gap-1.5 sm:gap-2">
              {EMOJIS.map((emoji, i) => {
                const score = i + 1;
                const selected = rating === score;
                return (
                  <button
                    key={score}
                    onClick={() => setRating(score)}
                    className={`flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border-2 py-2.5 transition-all active:scale-95 sm:py-3 ${
                      selected
                        ? "border-[var(--l-cta)] bg-[color-mix(in_srgb,var(--l-cta)_10%,transparent)]"
                        : "border-transparent bg-canvas hover:bg-line/40"
                    }`}
                  >
                    <span className="text-[24px] sm:text-[28px]">{emoji}</span>
                    <span className="text-[11px] font-medium text-ink-40">{score}</span>
                  </button>
                );
              })}
            </div>
            <div className="mb-6 flex justify-between text-[12px] text-ink-40">
              <span>Lite fornøyd</span>
              <span>Veldig fornøyd</span>
            </div>

            <button
              onClick={handleSubmitRating}
              disabled={!rating}
              className="w-full rounded-xl bg-[var(--l-cta)] py-3.5 text-base font-semibold text-[var(--l-on-cta)] transition-all hover:bg-[var(--l-cta-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Send inn
            </button>
          </div>
        )}

        {view === "negative" && (
          <div className="rounded-card border border-line bg-white p-5 shadow-lg sm:p-7">
            <h1 className="font-display mb-3 text-xl font-semibold sm:text-2xl">Tilbakemelding</h1>
            <p className="mb-2 text-[15px] leading-relaxed text-ink-60">
              Vi beklager at opplevelsen ikke var som forventet. Klinikken tar dette på alvor og ønsker å gjøre det bedre.
            </p>
            <p className="mb-5 text-[15px] leading-relaxed text-ink-60">
              Legg igjen telefonnummeret ditt, så kontakter klinikken deg for å rette opp opplevelsen.
            </p>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium">Navn</label>
              <input placeholder="Ditt navn" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium">Telefonnummer</label>
              <input type="tel" inputMode="tel" placeholder="f.eks. 98 76 54 32" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </div>
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium">Kommentar</label>
              <textarea
                rows={4}
                placeholder="Legg gjerne igjen en kommentar. Klinikken setter pris på ærlige tilbakemeldinger."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              onClick={handleSubmitNegative}
              disabled={submitting}
              className="w-full rounded-xl bg-[var(--l-cta)] py-3.5 text-base font-semibold text-[var(--l-on-cta)] transition-all hover:bg-[var(--l-cta-hover)] active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? "Sender…" : "Send inn"}
            </button>
          </div>
        )}

        {view === "positive" && (
          <div className="rounded-card border border-line bg-white p-5 shadow-lg sm:p-7">
            <h1 className="font-display mb-3 text-xl font-semibold sm:text-2xl">Tusen takk! 🎉</h1>
            <p className="mb-2 text-[15px] leading-relaxed text-ink-60">
              Vi er veldig glade for at du er fornøyd med behandlingen!
            </p>
            <p className="mb-5 text-[15px] leading-relaxed text-ink-60">
              Vil du hjelpe andre med å finne en god tannlege? Legg igjen en anmeldelse på Google – det betyr mye for klinikken!
            </p>

            <a
              href={clinic.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#4285F4] py-3.5 text-base font-medium text-white no-underline transition-all hover:bg-[#3367D6] active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
              </svg>
              Legg igjen en Google-anmeldelse
            </a>

            <p className="mt-5 text-center text-sm text-ink-40">Velkommen tilbake! 😊</p>
          </div>
        )}

        {view === "submitted" && (
          <div className="rounded-card border border-line bg-white p-5 text-center shadow-lg sm:p-7">
            <div className="mb-4 text-5xl">✅</div>
            <h1 className="font-display mb-3 text-2xl font-semibold">Takk for tilbakemeldingen!</h1>
            <p className="text-[15px] leading-relaxed text-ink-60">
              Vi har mottatt din tilbakemelding og setter stor pris på at du tok deg tid. Klinikken tar kontakt så snart som mulig.
            </p>
          </div>
        )}

        <p className="mt-5 text-center text-xs text-ink-40">
          {clinic.name} · {clinic.address}
        </p>
      </div>
    </LandingShell>
  );
}
