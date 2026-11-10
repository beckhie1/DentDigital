import type { IconKey } from "@/lib/demo-clinics";

const paths: Record<IconKey, React.ReactNode> = {
  tooth: (
    <path d="M12 3c-2 0-3 1-5 1S4 3 3.5 5C2.5 9 4 20 6 20c1.4 0 1.6-4 3-4s1.6 4 3 4c2 0 3.5-11 2.5-15C17 3 16 4 14 4S14 3 12 3z" />
  ),
  aligner: (
    <>
      <path d="M4 8c0-1.5 1-3 4-3s4 1.5 4 1.5S13 5 16 5s4 1.5 4 3-1 3.5-2 5-2 4.5-4 4.5-2-2-4-2-2 2-4 2-3-3-4-4.5S4 9.5 4 8z" />
    </>
  ),
  implant: (
    <>
      <path d="M9 3h6l-1 4h-4z" />
      <path d="M12 7v4" />
      <path d="M10 11h4l-1 5-1 5-1-5z" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M12 8c-2 0-3 1.2-3 3 0 2 .6 5 1.4 5 .7 0 .5-2 1.6-2s.9 2 1.6 2c.8 0 1.4-3 1.4-5 0-1.8-1-3-3-3z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  heart: <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />,
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" />
    </>
  ),
  crown: <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13z" />,
  denture: (
    <path d="M4 9c0-1.5 1.2-2.5 3-2.5S9 8 12 8s3.2-1.5 5-1.5S20 7.5 20 9c0 3-1.5 8-4 8-1.5 0-1.8-2.5-4-2.5S9.5 17 8 17c-2.5 0-4-5-4-8z" />
  ),
  emergency: (
    <>
      <path d="M12 3c-2 0-3 1-5 1S4 3 3.5 5C2.5 9 4 20 6 20c1.4 0 1.6-4 3-4s1.6 4 3 4c2 0 3.5-11 2.5-15" />
      <path d="M16.5 3.5v5M14 6h5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L17 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />
  ),
  star: <path d="M12 3.5l2.6 5.6 6.1.7-4.6 4.1 1.3 6L12 16.9 6.6 20l1.3-6L3.3 9.8l6.1-.7z" />,
  check: <path d="M4 12.5l5 5 11-11" />,
  gift: (
    <>
      <path d="M4 11h16v9H4z" />
      <path d="M4 7h16v4H4zM12 7v13" />
      <path d="M12 7S10.5 3.5 8.5 4.5 10 7 12 7zM12 7s1.5-3.5 3.5-2.5S14 7 12 7z" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h11v4M4 7v10a2 2 0 0 0 2 2h13V9H6a2 2 0 0 1-2-2z" />
      <circle cx="16" cy="14" r="1.3" />
    </>
  ),
  calendar: (
    <>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-6 w-6",
  stroke = 1.6,
}: {
  name: IconKey;
  className?: string;
  stroke?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
