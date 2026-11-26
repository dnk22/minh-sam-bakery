import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LandingDataUnavailable } from "@/landing/components/ui/landing-data-unavailable";
import { ArticleDetailPage } from "@/landing/features/journal/article-detail-page";
import { getPublicPost, getRelatedPublicPosts } from "@/landing/features/journal/api";
import { journalSeoValues } from "@/landing/features/journal/seo";
import { isJournalNotFoundStatus } from "@/landing/features/journal/query";
import { ApiClientError } from "@/lib/api/client";

type ArticleRouteProps = { params: Promise<{ slug: string }> };

export const instant = false;

async function loadPublicArticle(slug: string) {
  try { return await getPublicPost(slug); }
  catch (error) { if (error instanceof ApiClientError && isJournalNotFoundStatus(error.status)) return null; throw error; }
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  let article: Awaited<ReturnType<typeof loadPublicArticle>>;
  try {
    article = await loadPublicArticle(slug);
  } catch (error) {
    if (!(error instanceof ApiClientError)) throw error;
    return {};
  }
  if (!article || article.status !== "PUBLISHED") notFound();
  const seo = journalSeoValues(article);
  const image = article.thumbnailUrl ? [{ url: article.thumbnailUrl, alt: article.title }] : undefined;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: { type: "article", title: seo.title, description: seo.description, url: seo.canonical, images: image, publishedTime: article.publishedAt ?? undefined, authors: [article.author] },
    twitter: { card: image ? "summary_large_image" : "summary", title: seo.title, description: seo.description, images: image?.map((item) => item.url) },
  };
}

async function ArticleContent({ params }: ArticleRouteProps) {
  await connection();
  const { slug } = await params;
  let article: Awaited<ReturnType<typeof loadPublicArticle>>;
  try {
    article = await loadPublicArticle(slug);
  } catch (error) {
    if (!(error instanceof ApiClientError)) throw error;
    return <LandingDataUnavailable title="Chưa thể mở bài viết" />;
  }
  if (!article || article.status !== "PUBLISHED") notFound();
  const related = await getRelatedPublicPosts(article.slug, 3).catch(() => []);
  return <ArticleDetailPage article={article} related={related} />;
}

function ArticleLoading() {
  return <main className="min-h-[70vh] animate-pulse bg-surface pt-[var(--landing-header-height)]"><div className="mx-auto max-w-[1100px] px-margin py-16"><div className="mx-auto h-12 w-3/4 rounded bg-surface-container" /><div className="mt-10 h-96 rounded-xl bg-surface-container-low" /></div></main>;
}

export default function ArticleRoute({ params }: ArticleRouteProps) {
  return <Suspense fallback={<ArticleLoading />}><ArticleContent params={params} /></Suspense>;
}
