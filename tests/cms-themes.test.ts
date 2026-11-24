import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { THEME_COLOR_GROUPS, THEME_FONT_OPTIONS } from "../src/cms/features/themes/constants.ts";
import { backendThemeFieldErrors, buildThemeListQuery, isDeletedTheme, isTheme, isThemeList, parseThemeActive, parseThemePage } from "../src/cms/features/themes/lib/theme-data.ts";
import { themeCodeFromName, themeConfigStatus } from "../src/cms/features/themes/lib/theme-format.ts";
import { themeQueryKeys } from "../src/cms/features/themes/lib/theme-query-keys.ts";
import { formToThemeCreate, formToThemePatch, themeCreateSchema, themeFormSchema, themePatchSchema, themeToForm } from "../src/cms/features/themes/schemas/theme.schema.ts";
import type { CmsTheme } from "../src/cms/features/themes/types.ts";
import { CLASSIC_THEME } from "../src/theme/presets/classic.ts";
import { parseThemeConfig } from "../src/theme/contracts/theme-config.schema.ts";
import type { ThemeConfigV1 } from "../src/theme/contracts/theme.types.ts";
import { executeThemeActivation, ThemeActivationError } from "../src/cms/features/themes/lib/theme-activation.ts";
import { parseThemeImportJson } from "../src/cms/features/themes/lib/theme-import.ts";

const fixture: CmsTheme = {
  id: "theme-1", name: "Classic", code: "classic", description: "Mặc định",
  config: structuredClone(CLASSIC_THEME), isActive: false,
  createdAt: "2026-11-01T00:00:00Z", updatedAt: "2026-11-02T00:00:00Z",
};

test("CMS exposes exactly 14 unique core colors and the two registered fonts", () => {
  const keys = THEME_COLOR_GROUPS.flatMap((group) => group.entries.map((entry) => entry.key));
  assert.equal(keys.length, 14);
  assert.equal(new Set(keys).size, 14);
  assert.deepEqual([...keys].sort(), Object.keys(CLASSIC_THEME.colors).sort());
  assert.deepEqual(THEME_FONT_OPTIONS.map((option) => option.value), ["noto-serif", "be-vietnam-pro"]);
});

test("create and patch accept only ThemeConfigV1 in config and never activate", () => {
  const values = themeToForm();
  values.name = "Minh Sâm Tết";
  values.code = "minh-sam-tet";
  const payload = formToThemeCreate(values);
  assert.equal(themeCreateSchema.safeParse(payload).success, true);
  assert.equal(payload.isActive, false);
  assert.deepEqual(payload.config, CLASSIC_THEME);
  assert.equal(themeCreateSchema.safeParse({ ...payload, isActive: true }).success, false);
  assert.equal(themeCreateSchema.safeParse({ ...payload, previewUrl: "https://evil.test/" }).success, false);
  assert.equal(themePatchSchema.safeParse({ isActive: true }).success, false);
  assert.equal(themePatchSchema.safeParse({}).success, false);
  assert.equal(themePatchSchema.safeParse({ config: { primaryColor: "#123456" } }).success, false);
});

test("form validates names, slug codes, font choices, hex and strict nested config", () => {
  const form = themeToForm();
  form.name = "Ví dụ";
  form.code = "vi-du";
  assert.equal(themeFormSchema.safeParse(form).success, true);
  assert.equal(themeFormSchema.safeParse({ ...form, code: "UpperCase" }).success, false);
  assert.equal(themeFormSchema.safeParse({ ...form, name: "" }).success, false);
  assert.equal(themeFormSchema.safeParse({ ...form, config: { ...form.config, colors: { ...form.config.colors, primary: "red" } } }).success, false);
  assert.equal(themeFormSchema.safeParse({ ...form, config: { ...form.config, typography: { heading: "arbitrary", body: "noto-serif" } } }).success, false);
  assert.equal(themeCodeFromName("Minh Sâm - Đặc Biệt"), "minh-sam-dac-biet");
});

test("duplicate is editable but does not copy active status or mutate preset", () => {
  const active = { ...fixture, isActive: true };
  const form = themeToForm(active, true);
  assert.equal(form.name, "Classic - Bản sao");
  assert.equal(form.code, "classic-copy");
  form.config.colors.primary = "#14532D";
  assert.equal(formToThemeCreate(form).isActive, false);
  assert.equal(CLASSIC_THEME.colors.primary, "#2E0208");
});

test("patch compares normalized values and sends a complete config only when changed", () => {
  const unchanged = themeToForm(fixture);
  assert.deepEqual(formToThemePatch(unchanged, fixture), {});
  const modified = themeToForm(fixture);
  modified.config.colors.primary = "#f0aabb";
  const patch = formToThemePatch(modified, fixture);
  assert.equal(patch.config?.colors.primary, "#F0AABB");
  assert.deepEqual(Object.keys(patch), ["config"]);
  assert.equal(themePatchSchema.safeParse(patch).success, true);
});

test("legacy config remains readable but is not silently promoted to V1", () => {
  const legacy = { ...fixture, config: { primaryColor: "#123456", fontFamily: "Georgia" } };
  assert.equal(isTheme(legacy), true);
  assert.equal(themeConfigStatus(legacy).valid, false);
  assert.equal(parseThemeConfig(legacy.config).success, false);
  assert.throws(() => formToThemePatch(themeToForm(legacy), legacy), /không thuộc V1/);
});

test("validates API pagination and read-only metadata", () => {
  assert.equal(isTheme(fixture), true);
  assert.equal(isTheme({ ...fixture, isActive: "true" }), false);
  assert.equal(isThemeList({ items: [fixture], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isDeletedTheme({ id: fixture.id }), true);
  assert.equal(isDeletedTheme({}), false);
  assert.equal(buildThemeListQuery({ page: 2, limit: 20, search: "Tết", isActive: false }), "page=2&limit=20&search=T%E1%BA%BFt&isActive=false");
  assert.equal(parseThemePage("0"), 1);
  assert.equal(parseThemeActive("false"), false);
  assert.equal(parseThemeActive("other"), undefined);
  assert.deepEqual(themeQueryKeys.detail(fixture.id), ["cms", "themes", "detail", fixture.id]);
  assert.deepEqual(backendThemeFieldErrors({ errors: [{ field: "code", message: "Trùng mã" }] }), { code: "Trùng mã" });
});

test("routes require auth and CSRF; active themes cannot be updated or removed in Phase 3", () => {
  const listRoute = readFileSync("src/app/api/cms/themes/route.ts", "utf8");
  const detailRoute = readFileSync("src/app/api/cms/themes/[id]/route.ts", "utf8");
  const navigation = readFileSync("src/cms/config/navigation.ts", "utf8");
  assert.match(listRoute, /requireThemeAccess/);
  assert.match(detailRoute, /requireThemeAccess/);
  assert.match(listRoute, /isTrustedSameOriginRequest/);
  assert.match(detailRoute, /isTrustedSameOriginRequest/);
  assert.match(listRoute, /isActive: false/);
  assert.match(detailRoute, /current.isActive/);
  assert.match(detailRoute, /themeError\(409/);
  assert.match(navigation, /href: "\/cms\/themes"/);
  assert.doesNotMatch(detailRoute, /revalidateLandingActiveTheme/);
});

test("theme toolbar uses the shared responsive filter group", () => {
  const toolbar = readFileSync("src/cms/features/themes/components/themes-toolbar/themes-toolbar.tsx", "utf8");
  const styles = readFileSync("src/cms/features/themes/components/themes-toolbar/themes-toolbar.module.css", "utf8");
  assert.match(toolbar, /<CmsFilterGroup/);
  assert.match(toolbar, /activeCount=\{Number\(filters\.isActive !== undefined\)\}/);
  assert.match(toolbar, /onClear=\{\(\) => filters\.setActive\(undefined\)\}/);
  assert.match(toolbar, /className=\{styles\.clearAll\}/);
  assert.match(styles, /@media \(max-width: 767px\)/);
  assert.match(styles, /\.clearAll \{ display: none; \}/);
});

test("JSON import accepts strict config-only payload and normalizes HEX", () => {
  const config: ThemeConfigV1 = structuredClone(CLASSIC_THEME);
  config.colors.primary = "#abcdef";
  const imported = parseThemeImportJson(JSON.stringify(config));
  assert.equal(imported.success, true);
  if (imported.success) {
    assert.equal(imported.data.config.colors.primary, "#ABCDEF");
    assert.equal(imported.data.metadata, undefined);
  }
});

test("JSON import accepts the CMS create payload without activation", () => {
  const config: ThemeConfigV1 = structuredClone(CLASSIC_THEME);
  const imported = parseThemeImportJson(JSON.stringify({
    name: "Minh Sâm Tết 2027", code: "minh-sam-tet-2027",
    description: "Tết cổ truyền", config, isActive: false,
  }));
  assert.equal(imported.success, true);
  if (imported.success) {
    assert.deepEqual(imported.data.metadata, {
      name: "Minh Sâm Tết 2027", code: "minh-sam-tet-2027", description: "Tết cổ truyền",
    });
    assert.equal(imported.data.config.colors.primary, CLASSIC_THEME.colors.primary);
  }
});

test("JSON import rejects corrupt, partial, legacy, unsupported and unsafe inputs", () => {
  const invalid = [
    "{", "null", "[]",
    JSON.stringify({ primaryColor: "#123456", fontFamily: "Georgia" }),
    JSON.stringify({ ...CLASSIC_THEME, schemaVersion: 2 }),
    JSON.stringify({ ...CLASSIC_THEME, colors: { primary: "#000000" } }),
    JSON.stringify({ ...CLASSIC_THEME, colors: { ...CLASSIC_THEME.colors, primary: "url(javascript:alert(1))" } }),
    JSON.stringify({ name: "Tết", code: "tet", config: CLASSIC_THEME, isActive: true }),
    JSON.stringify({ name: "Tết", code: "tet", config: CLASSIC_THEME, extra: true }),
  ];
  for (const input of invalid) assert.equal(parseThemeImportJson(input).success, false, input);
});

test("import control is only rendered during create and keeps the existing form/schema", () => {
  const modal = readFileSync("src/cms/features/themes/components/theme-modal/theme-modal.tsx", "utf8");
  const component = readFileSync("src/cms/features/themes/components/theme-json-import/theme-json-import.tsx", "utf8");
  assert.match(modal, /mode === "create" \? <ThemeJsonImport/);
  assert.match(modal, /form.setValue\("config", data.config/);
  assert.match(component, /type="file"/);
  assert.match(component, /MAX_FILE_BYTES = 64 \* 1024/);
  assert.match(component, /type="button"/);
  assert.match(component, /parseThemeImportJson/);
  assert.match(modal, /formToThemeCreate\(values\)/);
});

test("Phase 4 activation is isolated, authenticated and only revalidates after Backend success", () => {
  const route = readFileSync("src/app/api/cms/themes/[id]/activate/route.ts", "utf8");
  const server = readFileSync("src/cms/features/themes/api/themes.server.ts", "utf8");
  const client = readFileSync("src/cms/features/themes/api/themes.client.ts", "utf8");
  assert.match(route, /isTrustedSameOriginRequest\(request\)/);
  assert.match(route, /requireThemeAccess\(\)/);
  assert.match(route, /backendThemeDetail\(access\.accessToken, id/);
  assert.match(route, /executeThemeActivation/);
  assert.match(route, /synchronize: revalidateLandingActiveTheme/);
  assert.match(server, /body: \{ isActive: true \}/);
  assert.match(client, /"\/activate"/);
  const edit = readFileSync("src/app/api/cms/themes/[id]/route.ts", "utf8");
  assert.match(edit, /themePatchSchema/);
  assert.doesNotMatch(edit, /backendActivateTheme/);
});

test("Phase 4 CMS actions show preview and restrict activation to valid inactive theme", () => {
  const columns = readFileSync("src/cms/features/themes/components/theme-columns/theme-columns.tsx", "utf8");
  const page = readFileSync("src/cms/features/themes/components/themes-page/themes-page.tsx", "utf8");
  const modal = readFileSync("src/cms/features/themes/components/theme-modal/theme-modal.tsx", "utf8");
  const dialog = readFileSync("src/cms/features/themes/components/theme-activate-dialog/theme-activate-dialog.tsx", "utf8");
  assert.match(columns, /theme-preview\//);
  assert.match(columns, /disabled: theme\.isActive \|\| !themeConfigStatus\(theme\)\.valid/);
  assert.match(page, /<ThemeActivateDialog/);
  assert.match(modal, /onActivate\(theme\)/);
  assert.match(dialog, /validateThemeContrast\(parsed\.data\)/);
  assert.match(dialog, /activation\.mutateAsync\(\{ id: theme\.id/);
  assert.match(dialog, /type="checkbox"/);
  assert.match(page, /setModal\(null\); setActivateTarget\(theme\)/);
});

test("Private Landing preview does not read/write the active public theme cache", () => {
  const preview = readFileSync("src/app/theme-preview/[id]/page.tsx", "utf8");
  assert.match(preview, /requireThemeAccess\(\)/);
  assert.match(preview, /backendThemeDetail\(access\.accessToken, id\)/);
  assert.match(preview, /parseThemeConfig\(theme\.config\)/);
  assert.match(preview, /resolveTheme\(parsed\.data\)/);
  assert.match(preview, /robots: \{ index: false, follow: false/);
  assert.match(preview, /<HomePage \/>/);
  assert.doesNotMatch(preview, /getActiveLandingTheme|revalidateLandingActiveTheme|cacheTag|use cache/);
});

test("activation distinguishes committed Backend state from failed cache synchronization", async () => {
  let writes = 0;
  const active = { ...fixture, isActive: true };
  const deps = {
    read: async () => fixture,
    activate: async () => { writes++; return active; },
    synchronize: () => { throw new Error("cache unavailable"); },
    reportSyncFailure: () => {},
  };
  const result = await executeThemeActivation(fixture.id, true, deps);
  assert.equal(result.theme.isActive, true);
  assert.equal(result.cacheSync, "pending");
  const retry = await executeThemeActivation(fixture.id, true, { ...deps, read: async () => active, synchronize: () => {} }, true);
  assert.equal(retry.cacheSync, "synced");
  assert.equal(writes, 1);
  await assert.rejects(() => executeThemeActivation(fixture.id, true, deps, true), ThemeActivationError);
  assert.equal(writes, 1);
});

test("ambiguous activation response is reconciled without repeating PATCH", async () => {
  let reads = 0;
  let writes = 0;
  const result = await executeThemeActivation(fixture.id, true, {
    read: async () => ++reads === 1 ? fixture : { ...fixture, isActive: true },
    activate: async () => { writes++; throw new Error("response lost"); },
    synchronize: () => {},
    reportSyncFailure: () => {},
  });
  assert.equal(result.recovered, true);
  assert.equal(result.cacheSync, "synced");
  assert.equal(writes, 1);
  assert.equal(reads, 2);
});

test("unconfirmed activation does not invalidate Landing cache", async () => {
  let syncs = 0;
  await assert.rejects(() => executeThemeActivation(fixture.id, true, {
    read: async () => fixture,
    activate: async () => { throw new Error("timeout"); },
    synchronize: () => { syncs++; },
    reportSyncFailure: () => {},
  }), ThemeActivationError);
  assert.equal(syncs, 0);
});

test("contrast warnings require explicit confirmation on server", async () => {
  const invalidContrast = { ...fixture, config: { ...CLASSIC_THEME, colors: { ...CLASSIC_THEME.colors, onPrimary: CLASSIC_THEME.colors.primary } } };
  let writes = 0;
  await assert.rejects(() => executeThemeActivation(fixture.id, false, {
    read: async () => invalidContrast,
    activate: async () => { writes++; return { ...invalidContrast, isActive: true }; },
    synchronize: () => {},
    reportSyncFailure: () => {},
  }), ThemeActivationError);
  assert.equal(writes, 0);
});
