---
name: minhsam-clean-architecture
description: >
  Architecture and clean-code workflow for developing,
  reviewing, and refactoring Next.js CMS features in
  Minh Sam Bakery. Use when implementing new modules,
  extracting large components, organizing hooks and APIs,
  or reviewing feature architecture.
---

# Minh Sâm clean architecture

Use this workflow for CMS feature work in this repository. Preserve established UI, API contracts, authentication, and business behavior unless the request explicitly changes them.

## Workflow

1. Read `AGENTS.md`, the applicable docs in `node_modules/next/dist/docs/`, and the complete existing feature before editing.
2. Identify current responsibilities across components, hooks, feature API modules, schemas, utilities, types, and styles.
3. Draw the smallest useful responsibility and dependency map. Shared modules may be imported by features; shared modules must not import features.
4. Reuse primitives under `src/cms/components/` when behavior is cross-feature. Keep feature-specific columns, filters, actions, copy, and workflows under `src/cms/features/<feature>/`.
5. Keep presentation and UI-only state in components. Put URL state, React workflows, form lifecycle, and TanStack Query usage in focused hooks.
6. Keep endpoint calls and response mapping in the feature `api/` folder. Use the shared transport and normalized errors; never create a second HTTP client or expose access tokens to client code.
7. Keep Zod validation and input/output transformations in `schemas/`. Keep pure transformations and tree or list utilities in `lib/`.
8. Extract an oversized component by cohesive responsibility. Prefer explicit, minimal TypeScript props and handler interfaces over repeated inline shapes.
9. Co-locate new component styles in CSS Modules. Do not add feature rules to `src/cms/styles/cms.css`.
10. Keep client/server boundaries explicit. Use React Hook Form with Zod for CMS forms and TanStack Query for asynchronous server state.
11. Preserve responsive behavior, loading/error/empty states, accessibility, URL behavior, cache invalidation, and mutation outcomes.
12. Run the feature test plus `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test:auth`, `pnpm validate:navigation`, and `pnpm build` when the task requires full validation.
13. Report the architectural decisions, validation actually run, and remaining risks without claiming unexecuted checks.

## Refactoring checklist

- Is the page primarily composition and top-level coordination?
- Does each extracted component own a meaningful rendering or interaction responsibility?
- Is URL state parsed and updated in one place, with pagination reset when filters change?
- Is server data owned by TanStack Query rather than copied into local or global state?
- Are API calls absent from presentation components?
- Are React Hook Form resets protected from overwriting dirty edits during refetch?
- Are feature-specific table columns, mobile items, and row actions still inside the feature?
- Are styles scoped to the component that uses them, with obsolete selectors removed?
- Are shared primitives still feature-agnostic?
- Do focused and project-level checks pass?

## Shared UI Reuse & Component Granularity

Use this decision path before adding UI:

```text
Need to render a UI element?
    |
    +-- Existing shared UI primitive?
    |       -> Reuse it
    |
    +-- Reusable across CMS modules?
    |       -> Implement under cms/components
    |
    +-- Business-specific composition?
    |       -> Keep inside its feature
    |
    +-- Small local JSX without independent behavior?
            -> Keep it in the parent
```

Examples:

- Generic input -> `CmsInput`; toolbar search -> `CmsInput type="search"` plus a feature debounce hook.
- Generic select -> `CmsSelect`; status filter -> `CmsSelect` with feature-owned options.
- Status badge -> `CmsBadge` with a feature-owned label and variant mapping.
- Category columns and action definitions -> Category feature; generic row rendering -> `CmsRowActions`.

Folder rules:

- A component with its own CSS Module gets a dedicated directory containing the TSX and CSS.
- A component without CSS can remain a standalone TSX file.
- Avoid component-level `index.ts` files and redundant wrapper components.

Before finishing, verify that shared primitives are reused by both toolbars and forms where relevant, and that feature semantics did not leak into shared UI.

## Anti-patterns

Avoid monolithic page components, god hooks, API calls inside presentation components, duplicated URL or server state, shared components importing features, CSS files containing unrelated component styles, excessive prop drilling, and files or abstractions without a concrete responsibility.

## When not to extract

Do not extract a component merely to reduce line count. Keep small, single-use markup local when it has no independent interaction, styling, testing, reuse, or domain responsibility. Do not create pass-through hooks or wrappers that only rename an existing API. Prefer a clear local block over a speculative abstraction.

## Project map

- `src/cms/features/<feature>/components/`: feature presentation and interactions
- `src/cms/features/<feature>/hooks/`: query, URL, form, and workflow lifecycle
- `src/cms/features/<feature>/api/`: feature endpoint adapters
- `src/cms/features/<feature>/schemas/`: Zod validation and form transformations
- `src/cms/features/<feature>/lib/`: pure feature utilities
- `src/cms/components/`: reusable CMS primitives only
- `src/cms/lib/api/` and `src/lib/api/`: shared transport and normalized API behavior
