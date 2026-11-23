# Minh Sâm Bakery

Next.js App Router application for the public Minh Sâm Bakery experience and the internal CMS workspace.

## Routes

- `/`: public landing page and catalog experience.
- `/cms/login`: public CMS sign-in page.
- `/cms`, `/cms/products`, `/cms/categories`, `/cms/orders`, `/cms/quotations`, and `/cms/settings/*`: server-protected CMS routes.
- `/api/cms/auth/login`, `/api/cms/auth/refresh`, `/api/cms/auth/logout`, and `/api/cms/auth/me`: same-origin authentication BFF endpoints.

The CMS placeholders do not implement business CRUD yet.

## Environment

```bash
cp .env.example .env.local
pnpm dev
```

`BACKEND_BASE_URL` is server-only and is shared by the public catalog client and CMS authentication client. Production authentication refuses a non-HTTPS backend origin. Do not expose this variable through a `NEXT_PUBLIC_` alias and do not add credentials to environment files.

## CMS authentication

The browser submits credentials only to the same-origin Next.js BFF. The BFF validates the Backend envelope and stores access and rotating refresh credentials in CMS-specific HttpOnly cookies. Cookies use `SameSite=Lax`, `Path=/`, and `Secure` in production. The access cookie follows the validated Backend `expiresIn` duration; the undocumented refresh lifetime is intentionally represented by a browser-session cookie.

CMS client code follows one explicit dependency path: presentation components call feature hooks, hooks call the Auth browser API, and that API uses the same-origin CMS client under `/api/cms`. Route Handlers call the server-only Auth API, which uses the shared Backend transport in `src/lib/api`. Browser modules never receive Backend tokens or origins. Login uses React Hook Form with a shared server-safe Zod schema; the login Route Handler parses the same schema independently.

Protected Server Components validate the access token against `/api/v1/auth/me`. An expired or nearly expired access credential redirects through `/cms/session-refresh`, which always performs one bounded rotation attempt instead of accepting a merely successful `/me` check. The Route Handler replaces both tokens together and preserves the rotated pair if post-refresh user verification is temporarily unavailable. Browser Web Locks serialize refresh attempts across tabs where supported; the flow never uses process-global token storage. In serverless environments, coordination is limited to tabs in the same browser profile. Strong cross-instance guarantees still depend on the Backend making refresh rotation atomic or idempotent.

State-changing auth handlers enforce same-origin `Origin` checks, JSON content types, server-side input validation, no-store responses, and safe local `/cms` redirects. Logout refreshes an expired access credential at most once before requesting Backend revocation, then always clears local cookies. If revocation cannot be confirmed, the UI reports local-only logout. Backend rate-limit behavior is not documented, so this application maps HTTP 429 without claiming independent brute-force protection.

The current Phase 2 access policy admits any Backend-authenticated `ACTIVE` account. Resource-specific RBAC remains a later CMS phase and must also be enforced by the corresponding Backend operations—not by menu visibility.

## Public catalog API

The public catalog, product detail pages, and global search use Backend data only. Product detail pages share one priced-product presentation; there is no editorial product or quotation fallback. The category page uses the category-specific GET API; `/tim-kiem` uses the public filter API. Category metadata is loaded with bounded pagination.

The public Landing now includes a selectable cart (/don-hang), Buy Now intent, and a standalone checkout form (/thanh-toan). These pages display provisional product prices from catalog snapshots and do not submit orders. Real order creation and payment remain disabled until the public create-order contract supports quantities, variants, fulfillment, and correct totals. Old quotation and mock-checkout drawers are removed from the Landing; CMS quotation routes are unaffected.

## Validation

```bash
pnpm test:auth
pnpm exec tsc --noEmit
pnpm lint
pnpm validate:navigation
pnpm build
```

The auth tests use mocked responses and cover shared Backend transport, query/body/header serialization, public cache options, authenticated no-store requests, network/timeout/abort behavior, CMS browser errors, Zod validation, near-expiry policy, refresh error decisions, redirect safety, CSRF checks, profile narrowing, and cookie flags. Live authentication requires credentials explicitly supplied in the developer environment; no mock user or production bypass exists.
