import type { ArticleParseResult } from "../../../article/contracts/article-layout.ts";
import type { PaginationMetaDto } from "../../../lib/api/types.ts";

export type JournalArticle = {
  id: string;
  title: string;
  slug: string;
  href: string;
  content: string;
  parsedContent: ArticleParseResult;
  excerpt: string;
  thumbnailUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  showOnLanding: boolean;
  author: string;
  publishedAt: string | null;
  publishedLabel: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type JournalPageData = {
  items: JournalArticle[];
  pagination: PaginationMetaDto;
};

export type JournalCard = Pick<JournalArticle, "id" | "title" | "slug" | "href" | "excerpt" | "thumbnailUrl" | "author" | "publishedAt" | "publishedLabel">;

export type JournalListQuery = {
  page: number;
  limit: number;
  search?: string;
  sortCreated: "asc" | "desc";
  landing: boolean;
};
