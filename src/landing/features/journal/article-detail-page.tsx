/* eslint-disable @next/next/no-img-element */
import { AlertTriangle, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { ArticleRenderer } from "@/article/renderer/article-renderer";
import { sanitizeArticleRichText } from "@/article/html/article-sanitize";
import { resolvePublicJournalAsset } from "./api";
import { ArticleShareActions } from "./journal-interactions";
import type { JournalArticle } from "./types";

export function ArticleDetailPage({ article, related }: { article: JournalArticle; related: JournalArticle[] }) {
  return <main className="w-full bg-surface pt-[var(--landing-header-height)]"><ArticleChrome article={article} /><ArticleContent article={article} />{related.length ? <RelatedStories articles={related} /> : null}</main>;
}

function ArticleChrome({ article }: { article: JournalArticle }) {
  return <section className="border-b border-outline-variant/40 bg-surface-container-low/60 py-6"><div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-5 px-margin md:flex-row md:items-center md:px-margin-tablet lg:px-margin-desktop"><nav aria-label="Đường dẫn trang" className="flex min-w-0 flex-wrap items-center gap-2 font-body-sm text-body-sm text-on-surface-variant"><Link className="hover:text-primary" href="/">Trang chủ</Link><span>/</span><Link className="hover:text-primary" href="/tin-tuc">Tin tức & Tạp chí</Link><span>/</span><span className="max-w-md truncate font-medium text-secondary">{article.title}</span></nav><ArticleShareActions title={article.title} /></div></section>;
}

function ArticleContent({ article }: { article: JournalArticle }) {
  const parsed = article.parsedContent;
  if (parsed.status === "supported") return <ArticleRenderer document={parsed.document} presentation={{ title: article.title, excerpt: article.excerpt, coverUrl: article.thumbnailUrl ?? undefined, coverAlt: article.title, author: article.author, publishedAt: article.publishedAt ?? undefined, publishedLabel: article.publishedLabel ?? undefined }} resolveImageUrl={resolvePublicJournalAsset} />;
  if (parsed.status === "legacy") return <article className="mx-auto max-w-[900px] px-margin py-14 md:px-margin-tablet"><header className="mb-10 border-b border-outline-variant pb-8"><p className="font-label-eyebrow uppercase tracking-widest text-secondary">Minh Sâm Journal</p><h1 className="mt-3 font-display-hero text-headline-lg text-primary md:text-display-hero">{article.title}</h1>{article.excerpt ? <p className="mt-4 font-subheading text-subheading text-on-surface-variant">{article.excerpt}</p> : null}<div className="mt-5 flex flex-wrap gap-4 text-body-sm text-on-surface-variant"><span>{article.author}</span>{article.publishedLabel ? <time dateTime={article.publishedAt ?? undefined}>{article.publishedLabel}</time> : null}</div>{article.thumbnailUrl ? <img alt={article.title} className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" src={article.thumbnailUrl} /> : null}</header><div className="prose prose-lg max-w-none text-on-surface" dangerouslySetInnerHTML={{ __html: sanitizeArticleRichText(article.content) }} /></article>;
  return <section className="mx-auto max-w-2xl px-margin py-24 text-center md:px-margin-tablet"><AlertTriangle className="mx-auto size-12 text-secondary" /><h1 className="mt-5 font-headline-lg text-headline-md text-primary">Nội dung đang cần được cập nhật</h1><p className="mt-3 text-on-surface-variant">{parsed.reason} Bài viết không được tự động chuyển layout để tránh mất hoặc hiển thị sai nội dung.</p><Link className="mt-7 inline-flex rounded-lg bg-primary px-6 py-3 text-on-primary" href="/tin-tuc">Quay lại Journal</Link></section>;
}

function RelatedStories({ articles }: { articles: JournalArticle[] }) {
  return <section className="bg-surface-container-low py-16"><div className="mx-auto max-w-[1360px] px-margin md:px-margin-tablet lg:px-margin-desktop"><div className="mb-8 flex items-center gap-3"><BookOpen className="size-6 text-secondary" /><h2 className="font-headline-lg text-headline-md text-primary">Bài viết liên quan</h2></div><div className="grid gap-6 md:grid-cols-3">{articles.map((article) => <article className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm" key={article.id}>{article.thumbnailUrl ? <img alt={article.title} className="aspect-[16/10] w-full object-cover" src={article.thumbnailUrl} /> : <div className="flex aspect-[16/10] items-center justify-center bg-primary text-on-primary"><BookOpen className="size-9 opacity-70" /></div>}<div className="flex flex-1 flex-col p-6">{article.publishedLabel ? <time className="text-body-sm text-on-surface-variant" dateTime={article.publishedAt ?? undefined}>{article.publishedLabel}</time> : null}<h3 className="mt-2 line-clamp-2 font-headline-sm text-headline-sm text-primary"><Link href={article.href}>{article.title}</Link></h3>{article.excerpt ? <p className="mt-3 line-clamp-2 text-body-sm text-on-surface-variant">{article.excerpt}</p> : null}<Link className="mt-auto inline-flex items-center gap-2 pt-5 font-label-ui text-secondary" href={article.href}>Đọc tiếp <ArrowRight className="size-4" /></Link></div></article>)}</div></div></section>;
}
