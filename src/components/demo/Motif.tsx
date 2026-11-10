"use client";

/**
 * Signature backdrops for the demo clinics.
 *  - "glacier": stacked contour lines (Folgefonna / Hardangerfjord bathymetry)
 *  - "coast":   layered horizon / tideline bands (Sunnhordland coast)
 * Pure SVG + currentColor so each clinic tints it via its brand color.
 */

export function GlacierContours({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  const lines = Array.from({ length: 9 });
  return (
    <svg
      className={className}
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {lines.map((_, i) => {
        const y = 70 + i * 58;
        const amp = 26 + i * 6;
        const d = `M-40 ${y} C 200 ${y - amp}, 420 ${y + amp}, 660 ${y - amp / 1.5} S 1080 ${y + amp}, 1240 ${y - amp / 2}`;
        return (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? 1.4 : 0.9}
            strokeOpacity={0.5 - i * 0.03}
            className={animate ? "contour-draw" : ""}
            style={animate ? { animationDelay: `${i * 90}ms` } : undefined}
          />
        );
      })}
    </svg>
  );
}

export function CoastHorizon({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  const bands = Array.from({ length: 7 });
  return (
    <svg
      className={className}
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {bands.map((_, i) => {
        const y = 150 + i * 62;
        const amp = 10 + i * 3;
        const d = `M-40 ${y} C 300 ${y + amp}, 600 ${y - amp}, 900 ${y + amp / 2} S 1160 ${y - amp}, 1240 ${y}`;
        return (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.45 - i * 0.045}
            className={animate ? "contour-draw" : ""}
            style={animate ? { animationDelay: `${i * 110}ms` } : undefined}
          />
        );
      })}
    </svg>
  );
}

export function Motif({
  kind,
  className = "",
  animate = false,
}: {
  kind: "glacier" | "coast";
  className?: string;
  animate?: boolean;
}) {
  return kind === "glacier" ? (
    <GlacierContours className={className} animate={animate} />
  ) : (
    <CoastHorizon className={className} animate={animate} />
  );
}
