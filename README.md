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
pnpm dev
```

## Validation

```bash
pnpm lint
pnpm build
```

The homepage is built from Server Components only. Visible content, remote image URLs, Lucide icons, layout classes, and responsive behavior are preserved from the supplied HTML.
