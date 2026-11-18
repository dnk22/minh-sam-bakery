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

Protected Server Components validate the access token against `/api/v1/auth/me`. An expired access credential redirects through `/cms/session-refresh`, whose Route Handler atomically writes both tokens returned by `/api/v1/auth/refresh`. Browser Web Locks serialize refresh attempts across tabs where supported; the flow performs at most one refresh per attempt and never uses process-global token storage. In serverless environments, coordination is limited to tabs in the same browser profile. Strong cross-instance guarantees still depend on the Backend making refresh rotation atomic or idempotent.

State-changing auth handlers enforce same-origin `Origin` checks, JSON content types, server-side input validation, no-store responses, and safe local `/cms` redirects. Logout always clears local cookies; if the Backend is unavailable, the UI states that remote revocation could not be confirmed. Backend rate-limit behavior is not documented, so this application maps HTTP 429 without claiming independent brute-force protection.

The current Phase 2 access policy admits any Backend-authenticated `ACTIVE` account. Resource-specific RBAC remains a later CMS phase and must also be enforced by the corresponding Backend operations—not by menu visibility.

## Public catalog API

The public catalog uses the Backend through server-side native `fetch` and never falls back to local mock products or categories. Responses are revalidated every five minutes. Filters missing from the Backend contract use bounded aggregation of at most 20 pages of 100 records; exceeding that bound fails explicitly rather than showing partial results.

The Backend currently exposes catalog reads only. Fixed-price checkout submission remains disabled for API-backed products, while the separate quotation experience stays editorial.

## Validation

```bash
pnpm test:auth
pnpm exec tsc --noEmit
pnpm lint
pnpm validate:navigation
pnpm build
```

The auth tests use mocked DTO payloads and cover duration parsing, response validation, safe client profile mapping, form validation, redirect safety, Backend error mapping, CSRF origin checks, and cookie flags. Live authentication requires credentials explicitly supplied in the developer environment; no mock user or production bypass exists.
