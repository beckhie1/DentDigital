import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DentDigital – Digital Marketing Agency",
  description:
    "DentDigital is a full-service digital marketing agency specialising in SEO, social media, paid advertising, and web design to help your brand grow.",
  openGraph: {
    title: "DentDigital – Digital Marketing Agency",
    description:
      "Full-service digital marketing agency helping brands grow, connect, and convert.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
