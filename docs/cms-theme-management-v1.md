# CMS Theme Management V1 — Phase 3

## Scope

CMS route: `/cms/themes`, menu **Nội dung cửa hàng → Giao diện website**. Theme V1 only edits 14 core HEX colors and Heading/Body font choices (Noto Serif or Be Vietnam Pro), preserving layout and Landing business logic. React Query, React Hook Form and Zod follow Categories/Products patterns.

- **List**: paginated `GET /api/v1/themes`, server-side search and `isActive` filter, responsive desktop table / mobile list, status badges and core palette swatches.
- **Detail**: `GET /api/v1/themes/{id}`, metadata, 14 core colors, font IDs, contrast diagnostics.
- **Create**: `POST /api/v1/themes` with `name`, `code`, `description`, full `config: ThemeConfigV1`, and `isActive: false`.
- **Edit**: `PATCH /api/v1/themes/{id}`, only changed metadata and/or full validated `config`. No partial nested palette edits.
- **Duplicate**: load source detail and create an independent inactive copy; supports duplicating active V1 theme safely.
- **Delete**: `DELETE /api/v1/themes/{id}`, confirmation for inactive themes only.

## Module organization

`src/cms/features/themes` contains API BFF/server/client, guarded parsers, Zod schema/form transform, React Query/Form hooks, modular UI components and a single scoped CSS module. Shared CMS UI: `ResponsiveCollection`, `ResponsiveModal`, `CmsFormField`, `CmsInput`, `CmsTextarea`, `CmsFormSelect`, `CmsRowActions`, `CmsBadge` and `CmsButton`.

BFF routes `src/app/api/cms/themes` use the existing session resolution, server-held access token, origin/JSON CSRF checks, no-store responses, backend transport and normalized errors. The Backend remains responsible for authorization.

## Guardrails

1. **Active themes are read-only in Phase 3.** UI hides edit/delete and authenticated BFF rechecks current state before PATCH/DELETE, returning 409 when active. Race-free enforcement of concurrent activation/edit requests requires Backend support.
2. Create always forces `isActive: false`; POST/PATCH schemas reject activation. Phase 4 owns Preview and Activation.
3. A response carrying invalid, legacy or future `config` is shown with a warning, never silently merged/migrated to Classic. Editing/duplicating that record is disabled.
4. Form validation uses `themeConfigV1Schema`, controls only 14 core colors and 2 approved font IDs. Resolver from `src/theme` is reused for color contrast diagnostics. Draft warnings do not auto-correct palette or block saving (Phase 4 activation policy will check).
5. New draft operations do not invalidate the Landing public-theme cache, because the active theme is unchanged; the authenticated activation workflow must call `revalidateLandingActiveTheme()` after Backend confirmation.

## Testing and limitations

Run `pnpm test:themes`, `pnpm test:theme`, `pnpm test:landing-theme`, TypeScript, targeted ESLint and production build. Verify in browser: create/edit/duplicate/delete, validation, mobile list + long modal form, accidental dismiss guard, 401/403/409 responses, and invalid legacy config.

**Not included**: live Landing iframe preview, instant activation, rollback, layout editing, uploading previews, new fonts, semantic token overrides, editing active theme.
