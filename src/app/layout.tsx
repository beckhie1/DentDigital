import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body className={`${inter.variable} font-sans antialiased text-slate-800`}>
        <LanguageProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
