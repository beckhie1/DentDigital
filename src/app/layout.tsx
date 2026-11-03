import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/shell/SmoothScroll";
import ConsentBanner from "@/components/shell/ConsentBanner";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dentdigital.no"),
  title: {
    default: "DentDigital – Digital Partner for Norske Helseklinikker",
    template: "%s | DentDigital",
  },
  description:
    "Annonsering, innhold for sosiale medier, nettsider og IT-løsninger som hjelper helseklinikker – tannlege, fysio, kiropraktor, hudpleie og mer – å vokse og få flere pasienter.",
  keywords: [
    "markedsføring helseklinikk",
    "markedsføring tannlege",
    "markedsføring fysioterapeut",
    "markedsføring kiropraktor",
    "nettside klinikk",
    "sosiale medier klinikk",
    "IT for helseklinikker",
    "GDPR helseklinikk",
  ],
  openGraph: {
    siteName: "DentDigital",
    locale: "nb_NO",
    type: "website",
    images: [{ url: "/digital-dental-partnership.png", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.dentdigital.no/#org",
      name: "DentDigital AS",
      url: "https://www.dentdigital.no",
      email: "post@dentdigital.no",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rødtvetveien 5",
        postalCode: "0955",
        addressLocality: "Oslo",
        addressCountry: "NO",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.dentdigital.no/#service",
      name: "DentDigital",
      parentOrganization: { "@id": "https://www.dentdigital.no/#org" },
      description:
        "Digital partner for norske helseklinikker: annonsering, innhold og posting i sosiale medier, nettsider, lokal SEO, IT-drift, sikkerhetskopi og datainnsikt.",
      areaServed: "NO",
      url: "https://www.dentdigital.no",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <body className={`${bricolage.variable} ${sourceSans.variable} bg-canvas font-sans text-ink antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <SmoothScroll />
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <ConsentBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
