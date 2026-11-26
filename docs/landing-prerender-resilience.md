# Backend-independent Next.js build

The repeated Vercel failure on /danh-muc was preceded by category and active theme timeouts. Cache Components and partial prefetching remain enabled. We defer public Backend-dependent reads until a real request, rather than letting a build depend on a live catalog.

## Route audit

- Shared Landing layout: async theme/header data behind Suspense and a request-time connection boundary. A lightweight shell can be prerendered. This intentionally defers the actual themed header/footer and page tree until the request; first response on a cold Backend may wait longer. The existing tagged data caches and theme fallback are retained.
- Home, about, category index, category detail, product detail, global search, journal list and article: explicit request-time boundaries before their data access; dynamic metadata also waits for a request. Category index allows blocking redirect via instant=false. Cart and checkout have no independent public server fetch and inherit the shared boundary.
- CMS login and protected layout: existing request-time session resolution; CMS API handlers are request-driven, not static content. Theme preview requires an authenticated request and inherits its existing connection through session resolution. No changes to authentication or protected CMS caching.
- Runtime errors: category/search distinguish unavailable data from a successful empty list and preserve search filters. Product/article distinguish API failure from not found; transient metadata API failure returns default metadata rather than a false 404. Existing related-item, banner, theme and journal listing fallbacks remain. The reusable retry UI calls router.refresh or the segment error reset handler.

## Verification

Run pnpm build for the ordinary build and pnpm build:offline for a deterministic regression test. The offline command clears the local .next build output, starts a loopback mock Backend returning 503, points BACKEND_BASE_URL to it, runs next build, and fails on any Backend call made during build. Both are mandatory CI steps. Fonts and dependencies can still need network access; this is specifically a Backend-independence test. No production data is changed.

After CI passes, manually check warm and cold requests for /, /danh-muc, category/product URLs, /tim-kiem with category filters, /tin-tuc, /ve-minh-sam, /don-hang, /thanh-toan and /cms/login. Test valid/invalid slugs, Backend failure and recovery, active theme changes and cache revalidation. An offline build pass does not prove browser behavior or eliminate all possible runtime outages.
