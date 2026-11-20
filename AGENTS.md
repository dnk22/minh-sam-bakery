<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Minh Sâm CMS architecture

- Organize CMS code by feature. Keep feature-specific components, hooks, API adapters, schemas, types, and utilities inside that feature; shared components must not import from features.
- Extract components by cohesive rendering or interaction responsibility, not by arbitrary file length. Refactor an existing responsibility before duplicating its logic.
- Components own presentation and local UI state. Hooks own React workflows, URL state, forms, and TanStack Query server state. Feature API modules own endpoint calls and mapping; schemas own validation and transformations; utilities remain pure.
- Use co-located CSS Modules for new component styles. Do not place feature styling in global CMS styles.
- Reuse shared CMS primitives only for genuinely cross-feature behavior. Keep feature-specific columns, actions, filters, and copy within the feature.
- Treat TanStack Query as the source of asynchronous server state; use stable query keys and invalidation instead of duplicating responses in client stores.
- Prefer minimal, explicit TypeScript interfaces at component and hook boundaries. Avoid `any`, circular imports, speculative abstractions, and god components or hooks.
