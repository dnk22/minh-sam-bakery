import sanitizeHtml from "sanitize-html";
import { parseArticleContent } from "../../../article/html/article-html.ts";
import { isSafeArticleImageUrl } from "../../../article/contracts/article-layout.ts";
import type { PublicPostResponseDto } from "../../../lib/api/types.ts";
import type { JournalArticle } from "./types.ts";

const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" });

export function validIsoDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function plainTextExcerpt(html: string, limit = 180) {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(1, limit - 1)).trimEnd()}…`;
}

export function adaptPublicPost(dto: PublicPostResponseDto, resolveAsset: (url: string) => string = (url) => url): JournalArticle {
  const publishedAt = validIsoDate(dto.publishedAt);
  const canonicalThumbnail = dto.thumbnailUrl && isSafeArticleImageUrl(dto.thumbnailUrl) ? dto.thumbnailUrl : null;
  return {
    id: dto.id,
    title: dto.title.trim(),
    slug: dto.slug,
    href: `/tin-tuc/${encodeURIComponent(dto.slug)}`,
    content: dto.content,
    parsedContent: parseArticleContent(dto.content),
    excerpt: dto.excerpt?.trim() || plainTextExcerpt(dto.content),
    thumbnailUrl: canonicalThumbnail ? resolveAsset(canonicalThumbnail) : null,
    status: dto.status,
    showOnLanding: dto.showOnLanding,
    author: dto.author.fullName.trim() || "Minh Sâm",
    publishedAt,
    publishedLabel: publishedAt ? formatter.format(new Date(publishedAt)) : null,
    seoTitle: dto.seoTitle?.trim() || null,
    seoDescription: dto.seoDescription?.trim() || null,
  };
}

export function visiblePublicPosts(items: JournalArticle[]) {
  return items.filter((item) => item.status === "PUBLISHED");
}

export function uniqueRelatedPosts(items: JournalArticle[], currentSlug: string, limit = 3) {
  const seen = new Set<string>([currentSlug]);
  return visiblePublicPosts(items).filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  }).slice(0, limit);
}
