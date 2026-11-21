import assert from "node:assert/strict";
import test from "node:test";
import { articleDocumentHasContent, parseArticleContent, serializeArticleDocument } from "../src/article/html/article-html.ts";
import { sanitizeArticleRichText } from "../src/article/html/article-sanitize.ts";
import { articleLayoutRegistry, createArticleDocument } from "../src/article/registry/article-layout-registry.ts";
import { editorialDataSchema, isSafeArticleImageUrl, isSafeArticleLink, photoStoryDataSchema, productStoryDataSchema } from "../src/article/contracts/article-layout.ts";
import { articleLayoutFixtures } from "./fixtures/article-layouts.ts";

test("registers each v1 layout exactly once with valid empty data", () => {
  assert.deepEqual(articleLayoutRegistry.map(({ key, version }) => `${key}@${version}`), ["editorial@1", "photo-story@1", "product-story@1"]);
  for (const layout of articleLayoutRegistry) assert.equal(layout.schema.safeParse(layout.createEmpty()).success, true);
});

test("round-trips all layouts without losing Vietnamese text, images, variants or ordering", () => {
  for (const fixture of articleLayoutFixtures) {
    const html = serializeArticleDocument(fixture); const parsed = parseArticleContent(html);
    assert.equal(parsed.status, "supported"); if (parsed.status !== "supported") continue;
    assert.deepEqual(parsed.document, fixture); assert.equal(serializeArticleDocument(parsed.document), html);
  }
});

test("keeps legacy content virtual and fails closed for unknown, malformed and hostile envelopes", () => {
  assert.equal(parseArticleContent("<p>HTML Tiptap cũ</p>").status, "legacy");
  assert.equal(parseArticleContent('<article data-ms-article-layout="editorial" data-ms-layout-version="2"></article>').status, "unsupported");
  assert.equal(parseArticleContent('<article data-ms-article-layout="editorial" data-ms-layout-version="1"><section data-ms-slot="introduction"><div data-ms-richtext="content"><script>alert(1)</script></div></section></article>').status, "invalid");
  assert.equal(parseArticleContent('<article data-ms-article-layout="editorial" data-ms-layout-version="1"><section data-ms-slot="introduction"><div data-ms-richtext="content"><p>x</p></div></section><section data-ms-block="section" data-ms-block-id="section-x" data-ms-image-side="left"><h2 data-ms-field="title" data-other="bad">x</h2><div data-ms-richtext="body"><p>x</p></div></section></article>').status, "invalid");
  assert.equal(parseArticleContent('<article data-ms-article-layout="editorial" data-ms-layout-version="1"><section data-ms-slot="introduction"><div data-ms-richtext="content"><p>x</p></div></section><aside data-ms-block="unknown"></aside></article>').status, "invalid");
});

test("strict schemas reject duplicate IDs, unsafe URLs, invalid gallery counts and variants", () => {
  const editorial = articleLayoutFixtures[0]!.data; assert.equal(editorial.kind, "editorial");
  if (editorial.kind === "editorial") assert.equal(editorialDataSchema.safeParse({ ...editorial, sections: [editorial.sections[0], editorial.sections[0]] }).success, false);
  const photo = articleLayoutFixtures[1]!.data; if (photo.kind === "photo-story") assert.equal(photoStoryDataSchema.safeParse({ ...photo, chapters: [{ ...photo.chapters[0]!, images: Array.from({ length: 7 }, (_, index) => ({ id: `image-${index}`, url: "/uploads/posts/a.jpg", alt: "a", caption: "" })) }] }).success, false);
  const product = articleLayoutFixtures[2]!.data; if (product.kind === "product-story") assert.equal(productStoryDataSchema.safeParse({ ...product, highlight: { ...product.highlight, ctaHref: "javascript:alert(1)" } }).success, false);
  assert.equal(isSafeArticleImageUrl("/uploads/posts/a.jpg"), true); assert.equal(isSafeArticleImageUrl("/uploads/../secret"), false); assert.equal(isSafeArticleImageUrl("http://cdn.example/a.jpg"), false);
  assert.equal(isSafeArticleImageUrl("/uploads/posts/hostile.svg"), false); assert.equal(isSafeArticleImageUrl("data:image/svg+xml,x"), false);
  assert.equal(isSafeArticleLink("/san-pham/a"), true); assert.equal(isSafeArticleLink("//evil.example"), false); assert.equal(isSafeArticleLink("data:text/html,x"), false);
});

test("sanitizer retains semantic content and removes executable or unrelated markup", () => {
  const sanitized = sanitizeArticleRichText('<p data-other="x" onclick="evil()">Xin <strong>chào</strong><a href="javascript:evil">link</a><svg><script>x</script></svg><iframe src="https://evil"></iframe></p>');
  assert.match(sanitized, /Xin <strong>chào<\/strong>/); assert.doesNotMatch(sanitized, /data-other|onclick|javascript|svg|script|iframe/i);
});

test("populated layout is detectable before an explicit layout reset", () => {
  assert.equal(articleDocumentHasContent(createArticleDocument("editorial")), false);
  assert.equal(articleDocumentHasContent(articleLayoutFixtures[0]!), true);
});
