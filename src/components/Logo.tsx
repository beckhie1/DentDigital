import { Plus_Jakarta_Sans } from "next/font/google";

const wordmark = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "800"],
  display: "swap",
});

export default function Logo({ dark = false }: { dark?: boolean }) {
  const bars = dark ? "#ffffff" : "#1E40AF";
  return (
    <span className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 280 286"
        aria-hidden="true"
        className="h-8 w-auto"
        style={{ aspectRatio: "280 / 286" }}
      >
        <rect y="203" width="54" height="84" rx="27" fill={bars} />
        <rect x="72" y="161" width="54" height="126" rx="27" fill={bars} />
        <rect x="144" y="113" width="54" height="174" rx="27" fill={bars} />
        <rect x="216" y="58" width="54" height="229" rx="27" fill="#22C7A9" />
        <path d="M205 64H280L242.5 0Z" fill="#22C7A9" stroke="#22C7A9" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <span
        className={`${wordmark.className} text-[22px] leading-none tracking-tight ${
          dark ? "text-canvas" : "text-[#0F1B2D]"
        }`}
      >
        <span className="font-extrabold">dent</span>
        <span className="font-normal">digital</span>
      </span>
    </span>
  );
}
