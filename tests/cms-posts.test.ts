import assert from "node:assert/strict";
import test from "node:test";
import { clearPostAdvancedFilterQuery, countPostAdvancedFilters, isPost, isPostList, parsePostListQuery, postDeleteRequest, postPublishRequest } from "../src/cms/features/posts/lib/post-data.ts";
import { inspectEditorCompatibility, isMeaningfulPostHtml, isSafeLinkHref, sanitizePostHtml } from "../src/cms/features/posts/lib/post-html.ts";
import { postQueryKeys } from "../src/cms/features/posts/lib/post-query-keys.ts";
import { formToPostCreate, formToPostPatch, postCreateSchema, postToForm, vietnamesePostSlug } from "../src/cms/features/posts/schemas/post.schema.ts";
import { isAllowedCmsUploadFolder } from "../src/cms/lib/api/upload-validation.ts";
import type { Post } from "../src/cms/features/posts/types.ts";

const post = (overrides: Partial<Post> = {}): Post => ({ id: "post-1", title: "Bánh và ký ức", slug: "banh-va-ky-uc", thumbnailUrl: null, content: "<p>Nội dung an toàn</p>", excerpt: null, status: "DRAFT", showOnLanding: false, publishedAt: null, seoTitle: null, seoDescription: null, author: { id: "user-1", fullName: "Minh Sâm" }, createdAt: "2026-11-21T08:00:00.000Z", updatedAt: "2026-11-21T09:00:00.000Z", ...overrides });

test("strictly validates post detail/list and rejects Swagger object inconsistencies", () => {
  assert.equal(isPost(post()), true); assert.equal(isPost({ ...post(), thumbnailUrl: { url: "/x.jpg" } }), false);
  assert.equal(isPost({ ...post(), author: { id: "x" } }), false); assert.equal(isPost({ ...post(), publishedAt: "not-a-date" }), false);
  assert.equal(isPostList({ items: [post()], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } }), true);
  assert.equal(isPostList({ items: [post()], pagination: { page: 0, limit: 10, total: 1, totalPages: 1 } }), false);
});

test("parses list filters including explicit false and rejects malformed values", () => {
  assert.deepEqual(parsePostListQuery(new URLSearchParams("page=2&limit=20&search=banh&status=PUBLISHED&showOnLanding=false")), { ok: true, data: { page: 2, limit: 20, search: "banh", status: "PUBLISHED", showOnLanding: false } });
  assert.deepEqual(parsePostListQuery(new URLSearchParams()), { ok: true, data: { page: 1, limit: 10, search: undefined, status: undefined, showOnLanding: undefined } });
  assert.equal(parsePostListQuery(new URLSearchParams("showOnLanding=0")).ok, false); assert.equal(parsePostListQuery(new URLSearchParams("status=DELETED")).ok, false);
  assert.equal(countPostAdvancedFilters({ status: "DRAFT", showOnLanding: false }), 2);
  assert.equal(clearPostAdvancedFilterQuery(new URLSearchParams("search=kem&status=DRAFT&showOnLanding=false&page=4&extra=kept")).toString(), "search=kem&extra=kept");
});

test("validates create content, Tiptap empty docs and Vietnamese slugs", () => {
  assert.equal(postCreateSchema.safeParse({ title: "Bài", content: "<p>Nội dung</p>" }).success, true);
  assert.equal(postCreateSchema.safeParse({ title: "Bài", content: "<p>Nội dung</p>", unknown: true }).success, false);
  assert.equal(postCreateSchema.safeParse({ title: "Bài", content: "<p></p>" }).success, false);
  assert.equal(isMeaningfulPostHtml("<p><br></p>"), false); assert.equal(vietnamesePostSlug("Bánh Đậu Xanh – Ký Ức"), "banh-dau-xanh-ky-uc");
  assert.deepEqual(formToPostCreate({ ...postToForm(), title: " Bài mới ", content: "<p>Đủ nội dung</p>" }), { title: "Bài mới", content: "<p>Đủ nội dung</p>", status: "DRAFT", showOnLanding: false });
});

test("builds true partial patches and preserves original HTML for metadata-only edits", () => {
  const original = post({ content: '<div data-block="gallery"><img src="/legacy.jpg"></div>' }); const values = { ...postToForm(original), seoTitle: "SEO mới" };
  assert.deepEqual(formToPostPatch(values, original, { contentChanged: false, contentCompatible: false }), { seoTitle: "SEO mới" });
  assert.deepEqual(formToPostPatch({ ...values, excerpt: "" }, { ...original, excerpt: "Cũ" }, { contentChanged: false, contentCompatible: false }), { excerpt: "", seoTitle: "SEO mới" });
  assert.deepEqual(formToPostPatch({ ...postToForm(post()), content: "<p>Mới</p>" }, post(), { contentChanged: true, contentCompatible: true }), { content: "<p>Mới</p>" });
});

test("fails closed for custom/CKEditor HTML and sanitizes hostile preview markup", () => {
  assert.equal(inspectEditorCompatibility('<section data-block="cta"><p>CTA</p></section>').compatible, false);
  assert.equal(inspectEditorCompatibility('<figure class="image ck-widget"><img src="/x"></figure>').compatible, false);
  assert.equal(inspectEditorCompatibility("<p><strong>Hợp lệ</strong></p>").compatible, true);
  assert.equal(isSafeLinkHref("javascript:alert(1)"), false); assert.equal(isSafeLinkHref("https://minhsam.vn/bai-viet"), true);
  const safe = sanitizePostHtml('<p onclick="evil()">Hi<img src="javascript:evil" onerror="evil()"><script>alert(1)</script><iframe src="https://evil"></iframe><a href="javascript:evil">x</a></p>');
  assert.doesNotMatch(safe, /script|iframe|onclick|onerror|javascript/i);
});

test("publish uses PATCH without body, delete is soft-delete endpoint, and keys are stable", () => {
  assert.deepEqual(postPublishRequest("post-1"), { method: "PATCH", path: "/posts/post-1/publish", body: undefined });
  assert.deepEqual(postDeleteRequest("post-1"), { method: "DELETE", path: "/posts/post-1" });
  assert.deepEqual(postQueryKeys.detail("post-1"), ["cms", "posts", "detail", "post-1"]);
});

test("upload folder allowlist retains existing folders and adds posts only", () => {
  assert.equal(isAllowedCmsUploadFolder("categories"), true); assert.equal(isAllowedCmsUploadFolder("products"), true); assert.equal(isAllowedCmsUploadFolder("posts"), true);
  assert.equal(isAllowedCmsUploadFolder("posts/nested"), false); assert.equal(isAllowedCmsUploadFolder("../posts"), false);
});
