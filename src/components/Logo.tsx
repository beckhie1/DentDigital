export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path
          d="M16 3C11 3 7 6.5 7 11c0 3 .8 5 1.6 7.6.9 2.9 1.5 6.6 2.6 9.2.5 1.2 2.1 1.3 2.6 0 .8-2 .9-5.3 2.2-5.3s1.4 3.3 2.2 5.3c.5 1.3 2.1 1.2 2.6 0 1.1-2.6 1.7-6.3 2.6-9.2C24.2 16 25 14 25 11c0-4.5-4-8-9-8z"
          fill="#00c2b8"
        />
      </svg>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          dark ? "text-canvas" : "text-ink"
        }`}
      >
        Dent<span className={dark ? "text-accent-bright" : "text-accent-ink"}>Digital</span>
      </span>
    </span>
  );
}
