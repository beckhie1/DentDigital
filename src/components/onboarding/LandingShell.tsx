import type { Clinic } from "@/lib/clinics";

/**
 * Minimal chrome-free wrapper for per-clinic landing pages.
 * The site Header/Footer are suppressed on these routes (see Header/Footer components).
 * Sets clinic-brand CSS vars (defaults = DentDigital palette) consumed by the landing components.
 */
export default function LandingShell({
  children,
  clinic,
}: {
  children: React.ReactNode;
  clinic?: Clinic;
}) {
  const b = clinic?.branding;
  const vars = {
    "--l-dark": b?.dark ?? "#0c0c0b",
    "--l-dark-to": b?.darkTo ?? b?.dark ?? "#161615",
    "--l-cta": b?.cta ?? "#00c2b8",
    "--l-cta-hover": b?.ctaHover ?? "#2de8de",
    "--l-on-cta": b?.onCta ?? "#111110",
    "--l-glow": b?.glow ?? "#2de8de",
    "--l-accent-ink": b?.accentInk ?? "#007a73",
  } as React.CSSProperties;

  return (
    <div
      style={vars}
      className="-mt-16 flex min-h-screen flex-col bg-canvas px-4 pt-10 sm:pt-14"
    >
      <div className="flex-1">{children}</div>
    </div>
  );
}
