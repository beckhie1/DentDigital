export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="dd-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <path
          d="M16 3C11 3 7 6.5 7 11c0 3 .8 5 1.6 7.6.9 2.9 1.5 6.6 2.6 9.2.5 1.2 2.1 1.3 2.6 0 .8-2 .9-5.3 2.2-5.3s1.4 3.3 2.2 5.3c.5 1.3 2.1 1.2 2.6 0 1.1-2.6 1.7-6.3 2.6-9.2C24.2 16 25 14 25 11c0-4.5-4-8-9-8z"
          fill="url(#dd-grad)"
        />
      </svg>
      <span className={`text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
        Dent<span className="text-teal-500">Digital</span>
      </span>
    </span>
  );
}
