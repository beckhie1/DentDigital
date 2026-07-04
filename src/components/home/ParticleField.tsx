"use client";

import { useEffect, useRef } from "react";

interface P {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  r: number;
  accent: boolean;
}

/**
 * Signature hero visual: a particle field that morphs from chaos into an
 * ordered grid — digitalization made visible. Cursor gently repels particles.
 * Canvas2D, ~zero bundle cost, 60fps. Static ordered state when
 * prefers-reduced-motion.
 */
export default function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: P[] = [];
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    let progress = reduced ? 1 : 0; // 0 = chaos, 1 = order

    const ACCENT = "#00c2b8";
    const INK = "#8b8b84";

    function build() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = Math.max(26, Math.min(40, w / 22));
      const cols = Math.floor(w / gap);
      const rows = Math.floor(h / gap);
      const ox = (w - (cols - 1) * gap) / 2;
      const oy = (h - (rows - 1) * gap) / 2;

      particles = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            tx: ox + c * gap,
            ty: oy + r * gap,
            vx: 0,
            vy: 0,
            r: Math.random() < 0.12 ? 2.2 : 1.4,
            accent: Math.random() < 0.14,
          });
        }
      }
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h);
      if (progress < 1) progress = Math.min(1, progress + 0.004);

      for (const p of particles) {
        // pull toward ordered position, strength grows with progress
        const pull = 0.002 + progress * 0.03;
        p.vx += (p.tx - p.x) * pull;
        p.vy += (p.ty - p.y) * pull;

        // cursor repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          p.vx += (dx / Math.sqrt(d2 + 0.01)) * f * 1.6;
          p.vy += (dy / Math.sqrt(d2 + 0.01)) * f * 1.6;
        }

        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.accent ? ACCENT : INK;
        ctx!.globalAlpha = p.accent ? 0.9 : 0.5;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.tx, p.ty, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.accent ? ACCENT : INK;
        ctx!.globalAlpha = p.accent ? 0.9 : 0.5;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    build();
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) drawStatic();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
