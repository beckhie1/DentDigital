import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/articles";
import ArticleView from "./article-view";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: article.title.no, description: article.excerpt.no };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title.no,
    description: article.excerpt.no,
    datePublished: article.date,
    inLanguage: "nb",
    image: `https://www.dentdigital.no${article.image}`,
    author: { "@type": "Organization", name: "DentDigital AS" },
    publisher: { "@id": "https://www.dentdigital.no/#org" },
    mainEntityOfPage: `https://www.dentdigital.no/fagartikler/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView slug={slug} />
    </>
  );
}
