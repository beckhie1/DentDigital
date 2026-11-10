import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for helseklinikker",
  description:
    "AI-resepsjonist, RAG-løsninger, semantisk søk og prediktiv analyse – moderne AI-teknologi skreddersydd for helsesektoren.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
