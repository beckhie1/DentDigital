"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: instant dot + lerped ring. Ring expands over interactive
 * elements. Desktop fine-pointer only; disabled for reduced motion.
 * Native cursor stays visible (accessibility).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as Element | null;
      hovering = !!target?.closest("a, button, [role=button], input, textarea, select, summary");
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      const scale = hovering ? 2.2 : 1;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-accent opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-8 w-8 rounded-full border border-accent/50 opacity-0 transition-[scale] duration-300"
      />
    </>
  );
}
