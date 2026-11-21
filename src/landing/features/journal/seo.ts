import type { JournalArticle } from "./types.ts";

export function journalSeoValues(article: JournalArticle) {
  const title = article.seoTitle || `${article.title} | Minh Sâm Journal`;
  const description = article.seoDescription || article.excerpt || article.title;
  return { title, description, canonical: `/tin-tuc/${encodeURIComponent(article.slug)}` };
}
