import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const clash = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  display: "swap",
  weight: "200 700",
});

const generalSans = localFont({
  src: "../fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  display: "swap",
  weight: "200 700",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dentdigital.no"),
  title: {
    default: "DentDigital – Digital Partner for Norske Tannklinikker",
    template: "%s | DentDigital",
  },
  description:
    "Skreddersydde IT-løsninger, markedsføring og teknologisupport som hjelper tannklinikker å vokse, effektivisere og levere bedre pasientopplevelser.",
  openGraph: {
    siteName: "DentDigital",
    locale: "nb_NO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <body className={`${clash.variable} ${generalSans.variable} grain bg-canvas font-sans text-ink antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
