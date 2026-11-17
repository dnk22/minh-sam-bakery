# Minh Sâm Bakery

Next.js App Router conversion of `DEMO/Option 4/index.html`, implemented with React, TypeScript, Tailwind CSS v4, and pnpm.

## Routes

- `/`: Minh Sâm Bakery landing page converted from the supplied HTML.
- `/cms`: reserved for a future CMS; no CMS route or features are implemented.

## Project structure

- `src/app`: Next.js routing and the original HTML design tokens expressed for Tailwind CSS v4.
- `src/app/(landing)`: route group serving the public homepage at `/`.
- `src/landing/components/layout`: header and footer converted from the source HTML.
- `src/landing/components/sections`: one component per source chapter boundary.
- `src/cms`: reserved future CMS source directory.

## Development

```bash
cp .env.example .env.local
pnpm dev
```

## Public catalog API

The public catalog uses server-side native `fetch` against `BACKEND_BASE_URL`. Set `CATALOG_DATA_SOURCE=api` for the live public API or `CATALOG_DATA_SOURCE=mock` for the explicit local demo dataset. Production defaults to `api`; development defaults to `mock` when the variable is omitted. There is no automatic fallback between the two sources.

Public catalog responses are revalidated every five minutes. The current UI supports filters that are not all available in the backend contract, so the data layer aggregates complete API result pages before applying those filters. Aggregation is bounded to 20 pages of 100 records; exceeding that limit fails explicitly instead of showing misleading partial results. If the catalog grows beyond 2,000 records, add backend price/sort filters or replace this bounded aggregation with server-supported cursor/page filtering.

The backend currently exposes catalog reads only. Checkout submission is therefore disabled for API-backed fixed-price products so the interface cannot display a false order success. The independent quotation experience remains editorial and does not infer quotation data from the API.

## Validation

```bash
pnpm lint
pnpm build
```

Visible editorial content, Lucide icons, layout classes, and responsive behavior are preserved from the supplied HTML while catalog identity, pricing, images, variants, and category availability come from the selected data source.
