# Landing Journal public integration

Phase 7.3 connects `/tin-tuc` and `/tin-tuc/[slug]` to the documented public Posts API. It does not use CMS cookies, BFF routes or local article mocks.

## Queries and visibility

- The normal Journal listing calls `GET /api/v1/public/posts` with `landing=false`, `sortCreated=desc`, a bounded page size and optional `search`. In this Backend contract, `landing=false` means all published posts.
- A future homepage-curated surface must explicitly use `landing=true`; it must not reinterpret that flag as draft visibility.
- Detail is loaded by public slug. Both listing and detail gate anomalous responses to `status=PUBLISHED`.
- Related cards use `GET /api/v1/public/posts/{slug}/related`; the frontend removes the current slug and duplicates but does not fabricate relationships.

## Rendering and compatibility

The API adapter validates the DTO, canonical image paths, nullable strings and dates, then parses `content` with the Phase 7.2 article contract. `editorial@1`, `photo-story@1` and `product-story@1` use the same `ArticleRenderer` as CMS preview. Safe legacy HTML uses the shared rich-text sanitizer. Unknown versions, malformed envelopes and hostile attributes display an explicit unsupported state and are never coerced to another layout.

Public assets accept canonical `/uploads/...` paths or safe HTTPS URLs. `/uploads/...` is resolved against the configured Backend base URL. The CMS-authenticated asset proxy is never used publicly.

## SEO and caching

Detail metadata prefers `seoTitle`/`seoDescription`, then real post title/excerpt/content-derived text. Canonical, Open Graph and Twitter values use the public slug and validated thumbnail only. No static mock slugs are generated, so new posts work without rebuilding.

Public fetches use a five-minute revalidation fallback and these tags:

- `journal-posts`
- `journal-post-{slug}`
- `journal-related-{slug}`

Successful CMS create, update, publish and delete Route Handlers call `revalidateTag(tag, "max")`. Updates invalidate old and new slugs. This is Next 16 stale-while-revalidate behavior: a request may briefly receive stale content while the next request refreshes it. `updateTag` is not used because Next 16 limits it to Server Actions, while CMS mutations are Route Handlers.

## Backend limitations

The API has no topic/category, view count, reading duration, featured rank, previous/next relationship, ETag or conditional update. The public UI therefore omits those former mock labels and controls. There is no production mutation in the Phase 7.3 verification suite.
