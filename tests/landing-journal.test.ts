import assert from "node:assert/strict";
import test from "node:test";
import { journalMutationTags } from "../src/article/cache/journal-cache.ts";
import { parseArticleContent, serializeArticleDocument } from "../src/article/html/article-html.ts";
import { adaptPublicPost, uniqueRelatedPosts, visiblePublicPosts } from "../src/landing/features/journal/adapters.ts";
import { buildJournalPageHref, buildPublicPostsPath, buildRelatedPostsPath, isJournalNotFoundStatus, parseJournalSearchParams, selectFeaturedArticles } from "../src/landing/features/journal/query.ts";
import { isPublicPost, isPublicPostPage } from "../src/landing/features/journal/schema.ts";
import { journalSeoValues } from "../src/landing/features/journal/seo.ts";
import type { PublicPostResponseDto } from "../src/lib/api/types.ts";
import { articleLayoutFixtures } from "./fixtures/article-layouts.ts";

function dto(overrides: Partial<PublicPostResponseDto> = {}): PublicPostResponseDto {
  return {
    id: "post-1", title: "Chuyện bánh Việt", slug: "chuyen-banh-viet",
    content: serializeArticleDocument(articleLayoutFixtures[0]!), status: "PUBLISHED", showOnLanding: false,
    author: { id: "author-1", fullName: "Ban biên tập" }, createdAt: "2026-11-20T08:00:00.000Z", updatedAt: "2026-11-20T08:00:00.000Z",
    ...overrides,
  };
}

test("public list query keeps landing=false distinct from curated landing=true", () => {
  const normal = parseJournalSearchParams({ page: "2", search: "  bánh sen  " });
  assert.deepEqual(normal, { page: 2, limit: 9, search: "bánh sen", sortCreated: "desc", landing: false });
  assert.match(buildPublicPostsPath(normal), /landing=false/);
  assert.match(buildPublicPostsPath({ ...normal, landing: true }), /landing=true/);
});

test("pagination parsing and links are bounded and retain search", () => {
  assert.equal(parseJournalSearchParams({ page: "invalid" }).page, 1);
  assert.equal(parseJournalSearchParams({ page: "-2" }).page, 1);
  assert.equal(parseJournalSearchParams({ page: "999999" }).page, 10_000);
  assert.equal(buildJournalPageHref(1, "bánh sen"), "/tin-tuc?search=b%C3%A1nh+sen");
  assert.equal(buildJournalPageHref(2, "bánh sen"), "/tin-tuc?page=2&search=b%C3%A1nh+sen");
});

test("carousel selection handles zero, one, two and many posts without positional assumptions", () => {
  const articles = Array.from({ length: 8 }, (_, index) => adaptPublicPost(dto({ id: `post-${index}`, slug: `post-${index}` })));
  assert.equal(selectFeaturedArticles([]).length, 0);
  assert.equal(selectFeaturedArticles(articles.slice(0, 1)).length, 1);
  assert.equal(selectFeaturedArticles(articles.slice(0, 2)).length, 2);
  assert.equal(selectFeaturedArticles(articles).length, 4);
});

test("public post guard accepts optional nullable fields and rejects malformed records", () => {
  assert.equal(isPublicPost(dto()), true);
  assert.equal(isPublicPost({ ...dto(), author: null }), false);
  assert.equal(isPublicPostPage({ items: [dto()], pagination: { page: 1, limit: 9, total: 1, totalPages: 1 } }), true);
  assert.equal(isPublicPostPage({ items: [dto()], pagination: { page: 0, limit: 9, total: 1, totalPages: 1 } }), false);
});

test("adapter validates dates and image paths while preserving honest fallbacks", () => {
  const article = adaptPublicPost(dto({ thumbnailUrl: "javascript:alert(1)", publishedAt: "not-a-date", excerpt: null, author: { id: "a", fullName: "" } }), (url) => `https://api.example${url}`);
  assert.equal(article.thumbnailUrl, null);
  assert.equal(article.publishedAt, null);
  assert.equal(article.author, "Minh Sâm");
  assert.match(article.excerpt, /Hành trình nghề bánh/);
  const safe = adaptPublicPost(dto({ thumbnailUrl: "/uploads/posts/a.jpg" }), (url) => `https://api.example${url}`);
  assert.equal(safe.thumbnailUrl, "https://api.example/uploads/posts/a.jpg");
});

test("draft anomalies are never exposed and related results remove self and duplicates", () => {
  const published = adaptPublicPost(dto());
  const draft = adaptPublicPost(dto({ id: "draft", slug: "draft", status: "DRAFT" }));
  const duplicate = { ...published, id: "duplicate" };
  assert.deepEqual(visiblePublicPosts([draft, published]).map((item) => item.slug), [published.slug]);
  assert.deepEqual(uniqueRelatedPosts([published, duplicate, draft, adaptPublicPost(dto({ id: "other", slug: "other" }))], published.slug).map((item) => item.slug), ["other"]);
  assert.equal(buildRelatedPostsPath("bánh/sen", 1, 3), "/api/v1/public/posts/b%C3%A1nh%2Fsen/related?page=1&limit=3");
  assert.equal(isJournalNotFoundStatus(404), true);
  assert.equal(isJournalNotFoundStatus(500), false);
});

test("all Phase 7.2 layouts and compatibility states resolve from stored content", () => {
  for (const fixture of articleLayoutFixtures) {
    const parsed = parseArticleContent(serializeArticleDocument(fixture));
    assert.equal(parsed.status, "supported");
    if (parsed.status === "supported") assert.equal(parsed.document.key, fixture.key);
  }
  assert.equal(parseArticleContent("<p>Nội dung cũ an toàn</p>").status, "legacy");
  assert.equal(parseArticleContent('<article data-ms-article-layout="editorial" data-ms-layout-version="99"></article>').status, "unsupported");
  assert.equal(parseArticleContent('<article data-ms-article-layout="editorial" data-ms-layout-version="1" onclick="evil()"></article>').status, "invalid");
});

test("SEO fallbacks use real post values and cache invalidation covers old and new slugs", () => {
  const article = adaptPublicPost(dto({ seoTitle: null, seoDescription: null, excerpt: "Tóm tắt thật" }));
  assert.deepEqual(journalSeoValues(article), { title: "Chuyện bánh Việt | Minh Sâm Journal", description: "Tóm tắt thật", canonical: "/tin-tuc/chuyen-banh-viet" });
  assert.deepEqual(journalMutationTags("slug-cu", "slug-moi"), ["journal-posts", "journal-post-slug-cu", "journal-related-slug-cu", "journal-post-slug-moi", "journal-related-slug-moi"]);
  assert.deepEqual(journalMutationTags("same", "same"), ["journal-posts", "journal-post-same", "journal-related-same"]);
});
