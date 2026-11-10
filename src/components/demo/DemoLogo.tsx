"use client";

import { useId } from "react";

/**
 * Fonna Tanngruppen identity mark.
 *
 * Concept: "Fonna" = Folgefonna, the glacier above Rosendal on the
 * Hardangerfjord. The mark is a tooth that is also a snow-capped mountain
 * (glacier cap + summit ridge) rising over fjord water lines — dentistry,
 * place, and the clinic name in one symbol. The Husnes sister clinic uses the
 * same tooth over a coastal tideline ("coast" motif), so the group reads as one
 * family.
 */

interface DemoLogoTheme {
  brand: string;
  brandDark: string;
  brandInk: string;
  accent: string;
}

interface DemoLogoProps {
  short: string;
  sub?: string;
  locality?: string;
  theme: DemoLogoTheme;
  motif: "glacier" | "coast";
  variant?: "horizontal" | "stacked" | "mark";
  onDark?: boolean;
  className?: string;
}

const TOOTH =
  "M32 8 C21 8 13 15 13 26 C13 35 16 43 19 52 C20 56.5 24.5 57 25.5 52 C26.5 47 27.5 43 32 43 C36.5 43 37.5 47 38.5 52 C39.5 57 44 56.5 45 52 C48 43 51 35 51 26 C51 15 43 8 32 8 Z";
const CAP =
  "M6 0 H58 V26 C51 29.5 46 24.5 40 27.5 C35 30 30 25 24.5 27.5 C19 30 13 25.5 6 28.5 Z";
const RIDGE = "M17 25 L24 16 L30 21 L37 13 L46 23";

function Mark({
  theme,
  motif,
  onDark = false,
  className = "h-10 w-auto",
}: {
  theme: DemoLogoTheme;
  motif: "glacier" | "coast";
  onDark?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const clip = `t-${uid}`;
  const grad = `g-${uid}`;

  const bodyTop = onDark ? "#ffffff" : theme.brand;
  const bodyBot = onDark ? "#cfe3e6" : theme.brandDark;
  const cap = onDark ? theme.brand : "#f4f8f9";
  const wave = onDark ? "#ffffff" : theme.brand;

  return (
    <svg viewBox="0 0 64 76" className={className} role="img" aria-hidden="true" fill="none">
      <defs>
        <clipPath id={clip}>
          <path d={TOOTH} />
        </clipPath>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bodyTop} />
          <stop offset="1" stopColor={bodyBot} />
        </linearGradient>
      </defs>

      {/* fjord water lines under the tooth */}
      <g stroke={wave} strokeLinecap="round" fill="none">
        <path d="M14 63 C20 60 24 66 30 63 C36 60 40 66 46 63" strokeWidth="2.4" opacity="0.55" />
        {motif === "coast" && (
          <path d="M18 70 C23 67.5 27 72.5 32 70 C37 67.5 41 72.5 45 70" strokeWidth="2.2" opacity="0.32" />
        )}
      </g>

      {/* tooth body + landscape, clipped to the tooth silhouette */}
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="64" height="76" fill={`url(#${grad})`} />
        {motif === "glacier" && (
          <>
            <path d={CAP} fill={cap} />
            <path d={RIDGE} stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        )}
        {motif === "coast" && (
          <path d="M6 40 C16 36 24 44 32 40 C40 36 48 44 58 40 L58 60 L6 60 Z" fill={onDark ? "#ffffff" : theme.brand} opacity="0.14" />
        )}
      </g>

      {/* summit / sun accent */}
      {motif === "coast" && <circle cx="49" cy="14" r="3.4" fill={theme.accent} />}
    </svg>
  );
}

export default function DemoLogo({
  short,
  sub = "Tannklinikk",
  locality,
  theme,
  motif,
  variant = "horizontal",
  onDark = false,
  className = "",
}: DemoLogoProps) {
  const nameColor = onDark ? "#ffffff" : theme.brandDark;
  const subColor = onDark ? "rgba(255,255,255,0.7)" : theme.brandInk;
  const locColor = onDark ? "rgba(255,255,255,0.5)" : "#8b8b84";

  if (variant === "mark") {
    return <Mark theme={theme} motif={motif} onDark={onDark} className={className || "h-10 w-auto"} />;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <Mark theme={theme} motif={motif} onDark={onDark} className="h-14 w-auto" />
        <div className="mt-3 leading-none">
          <div style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: nameColor }} className="text-2xl font-semibold tracking-tight">
            {short}
          </div>
          <div style={{ color: subColor }} className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.34em]">
            {sub}
          </div>
          {locality && (
            <div style={{ color: locColor }} className="mt-1 text-[10px] uppercase tracking-[0.22em]">
              {locality}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark theme={theme} motif={motif} onDark={onDark} className="h-10 w-auto" />
      <span className="leading-none">
        <span style={{ fontFamily: "var(--font-fraunces), Georgia, serif", color: nameColor }} className="block text-xl font-semibold tracking-tight">
          {short}
        </span>
        <span style={{ color: subColor }} className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.3em]">
          {sub}
        </span>
      </span>
    </span>
  );
}
