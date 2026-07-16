/**
 * Minimal chrome-free wrapper for per-clinic landing pages.
 * The site Header/Footer are suppressed on these routes (see Header/Footer components).
 */
export default function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-16 flex min-h-screen flex-col bg-canvas px-4 pt-10 sm:pt-14">
      <div className="flex-1">{children}</div>
      <p className="py-6 text-center text-xs text-ink-40">
        Levert av{" "}
        <a href="https://www.dentdigital.no" className="underline hover:text-ink">
          DentDigital
        </a>
      </p>
    </div>
  );
}
