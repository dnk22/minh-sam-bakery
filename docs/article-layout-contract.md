# Minh Sâm article layout contract

## Authoring flow

New CMS posts start with the recommended `editorial@1` layout. Before entering content, an editor can choose:

- `editorial@1`: introduction, ordered narrative/image sections, quotes and an automatic desktop table of contents.
- `photo-story@1`: introduction and ordered photo chapters with `full`, `two-up`, `image-left` or `image-right` presentation.
- `product-story@1`: introduction, ordered narrative sections, a product/CTA highlight and ordered benefit cards.

The selector and slot forms are CMS-only. Rich-text slots use Tiptap, while structure, image placement, gallery variants and ordering use dedicated controls. Preview serializes the current React Hook Form `content` value, parses it through the shared registry and renders it with the same `ArticleRenderer` now used by Landing Journal.

## Registry and versions

`src/article/registry/article-layout-registry.ts` is the single registry of layout key, immutable version, display metadata, Zod schema and empty data factory. Shared code has no CMS, auth, BFF or Tiptap imports.

Version meaning is immutable. A visual or structural breaking change creates `editorial@2`; it does not reinterpret `editorial@1`. A future registry entry must provide a strict schema, empty data and parser/serializer support. Migration is an explicit user action and must prove that every source slot is retained.

## Canonical HTML envelope

Only the documented Backend `content: string` field is used. No layout field is added to request DTOs.

```html
<article data-ms-article-layout="editorial" data-ms-layout-version="1">
  <section data-ms-slot="introduction">
    <div data-ms-richtext="content"><p>Mở đầu...</p></div>
  </section>
  <section data-ms-block="section" data-ms-block-id="section-history" data-ms-image-side="left">
    <h2 data-ms-field="title">Khởi đầu</h2>
    <div data-ms-richtext="body"><p>Câu chuyện...</p></div>
    <figure data-ms-field="image">
      <img src="/uploads/posts/history.jpg" alt="Người thợ làm bánh">
      <figcaption>Gian bếp đầu tiên</figcaption>
    </figure>
  </section>
</article>
```

Photo chapters use `data-ms-block="photo-chapter"`, stable block/image IDs, a controlled `data-ms-variant` and semantic figures. Product stories use narrative sections plus fixed `product-highlight` and `benefits` slots. The serializer is deterministic; a parse/serialize round trip preserves ordering and typed values.

## Parsing and safety

`parse5` parses HTML on Node and in the browser. Parsing never uses regular expressions to interpret the envelope. The parser returns `supported`, `legacy`, `unsupported` or `invalid` and validates:

- one namespaced article root and a registered key/version;
- known structural attributes, slots, blocks and variants;
- strict layout schemas, limits and unique stable IDs;
- canonical `/uploads/...` or HTTPS image URLs;
- safe internal/hash/http/https CTA links;
- sanitized semantic rich text with no scripts, event handlers, styles, iframe/SVG or unrelated data attributes.

Plain Phase 7.1 HTML remains on the virtual legacy path and is never automatically upgraded. Unknown keys/newer versions and malformed documents are read-only. Metadata-only PATCH continues to omit `content`, preserving original bytes. Changing a populated layout requires explicit confirmation and creates a fresh layout; cancel leaves the original form value untouched.

Image URLs persist as Backend canonical URLs, never authenticated `/api/cms/assets` URLs. CMS preview applies `cmsAssetUrl`; Phase 7.3 now provides a public Backend asset resolver for Landing Journal.

## Adding and evolving layouts

To add `new-layout@1`:

1. Define its discriminated strict schema and types under `src/article/contracts`.
2. Add one registry definition and empty data factory.
3. Add canonical parser/serializer branches with fixtures and malicious-input tests.
4. Add its CMS slot composition and a distinct shared renderer.

To add `editorial@2`, retain all v1 code and fixtures, register version 2 separately and offer only a tested, lossless migration. Never silently reset v1 data.

## Backend and Phase 7.3 limits

- Backend stores one HTML `content` value and has no native layout columns or template registry.
- Backend exposes no ETag/conditional update, so the CMS can warn and avoid refetch resets but cannot guarantee multi-editor conflict prevention.
- No media deletion endpoint exists; orphan cleanup is not claimed.
- Phase 7.3 integrates public Post APIs, adapts public DTOs to `ArticlePresentation`, adds dynamic Journal list/detail/SEO and uses a public asset resolver. See `docs/landing-journal-integration.md`.
