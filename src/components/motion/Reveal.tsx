"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Scroll-triggered reveal wrapper. Adds `.is-revealed` when the element
 * enters the viewport; pair with `.reveal-line` / `.reveal-fade` children
 * (or apply `reveal-fade` via className directly).
 */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  threshold = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "h1" | "h2" | "h3" | "p" | "span" | "li" | "ul";
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag
      // @ts-expect-error dynamic tag ref
      ref={ref}
      className={`${className} ${revealed ? "is-revealed" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Splits text into masked lines that slide up on reveal. */
export function RevealLines({
  lines,
  className = "",
  stagger = 90,
}: {
  lines: string[];
  className?: string;
  stagger?: number;
}) {
  return (
    <Reveal className={className}>
      {lines.map((line, i) => (
        <span
          key={line + i}
          className="reveal-line"
          style={{ "--reveal-delay": `${i * stagger}ms` } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Reveal>
  );
}

/** Number that counts up when scrolled into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
