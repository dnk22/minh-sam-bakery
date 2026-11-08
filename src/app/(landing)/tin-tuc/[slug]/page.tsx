import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetailPage } from "@/landing/features/journal/article-detail-page";
import { articles, findArticle } from "@/landing/features/journal/data";

type ArticleRouteProps = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  return {
    title: `${article.detailTitle ?? article.listingTitle} | Minh Sâm Journal`,
    description: article.excerpt,
    openGraph: article.coverImage ? { images: [article.coverImage] } : undefined,
  };
}

export default async function ArticleRoute({ params }: ArticleRouteProps) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();
  return <ArticleDetailPage article={article} />;
}
