import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for tannklinikker",
  description:
    "AI-resepsjonist, RAG-løsninger, semantisk søk og prediktiv analyse – moderne AI-teknologi skreddersydd for tannhelsesektoren.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
