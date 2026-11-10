"use client";

import { useEffect, useState } from "react";

const months = [
  "januar", "februar", "mars", "april", "mai", "juni",
  "juli", "august", "september", "oktober", "november", "desember",
];

const current = () =>
  months[Number(new Date().toLocaleString("en-US", { timeZone: "Europe/Oslo", month: "numeric" })) - 1];

/**
 * Current Oslo month ("november"), or "Novembertilbud" with `offer`.
 * The page is statically built, so the month is filled in on the client.
 */
export default function OfferMonth({ offer = false }: { offer?: boolean }) {
  const [m, setM] = useState<string | null>(null);
  useEffect(() => setM(current()), []);
  if (!m) return <>{offer ? "Tilbud" : "denne måneden"}</>;
  return <>{offer ? `${m[0].toUpperCase()}${m.slice(1)}tilbud` : m}</>;
}
