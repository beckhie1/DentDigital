import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { LtTracking } from "@/components/lillestrom/Tracking";
import { LT } from "@/lib/lillestrom";

/** Lillestrøm Tannhelse ad pages: the clinic's own font, icon and pixel instead of DentDigital's. */

const display = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/clinics/lillestrom-tannhelse-icon.png", apple: "/clinics/lillestrom-tannhelse-icon.png" },
  openGraph: { siteName: LT.name, locale: "nb_NO", type: "website" },
  robots: { index: false, follow: false }, // ad landing pages stay out of search
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#15171c",
};

export default function LillestromLayout({ children }: { children: React.ReactNode }) {
  // -mt-16 cancels the root <main> padding reserved for the DentDigital header, which is hidden here.
  return (
    <div className={`${display.variable} lt-root -mt-16`}>
      {children}
      <LtTracking />
    </div>
  );
}
