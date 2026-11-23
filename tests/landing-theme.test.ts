import assert from "node:assert/strict";
import { BackendRequestError } from "../src/lib/api/errors.ts";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  loadActiveLandingTheme,
  resolveLandingThemeData,
  resolveLandingThemeFailure,
  type ActiveLandingTheme,
} from "../src/landing/features/theme/theme-data.ts";
import { SEMANTIC_COLOR_TOKENS } from "../src/theme/colors/semantic-tokens.ts";
import type { ThemeConfigV1 } from "../src/theme/contracts/theme.types.ts";
import { SEMANTIC_FONT_ALIASES } from "../src/theme/fonts/font-registry.ts";
import { CLASSIC_THEME } from "../src/theme/presets/classic.ts";
import { resolveTheme } from "../src/theme/runtime/resolve-theme.ts";

const THEME_API_URL = "https://theme.test/api/v1/public/theme";

function cloneClassic(): ThemeConfigV1 {
  return structuredClone(CLASSIC_THEME);
}

function themeRecord(config: unknown = cloneClassic()) {
  return {
    id: "theme-custom",
    name: "Custom",
    code: "custom",
    config,
    isActive: true,
    createdAt: "2026-11-23T00:00:00.000Z",
    updatedAt: "2026-11-23T00:00:00.000Z",
  };
}

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify({ code: init?.status ?? 200, message: "Thành công", data }), {
    status: init?.status ?? 200,
    headers: { "content-type": "application/json" },
  });
}

function oneResponse(response: Response): typeof fetch {
  return (async (input) => {
    assert.equal(String(input), THEME_API_URL);
    return response;
  }) as typeof fetch;
}

async function loadTheme(fetchImpl: typeof fetch, timeoutMs = 50): Promise<ActiveLandingTheme> {
  try {
    return await loadActiveLandingTheme({
      baseUrl: "https://theme.test",
      fetchImpl,
      timeoutMs,
    });
  } catch (error) {
    return resolveLandingThemeFailure(error);
  }
}

test("validates the public response and resolves only data.config", async () => {
  const config = cloneClassic();
  config.colors.primary = "#14532D";
  const result = await loadTheme(oneResponse(jsonResponse(themeRecord(config))));
  assert.equal(result.source, "active");
  assert.equal(result.activeThemeId, "theme-custom");
  assert.equal(result.theme.config.colors.primary, "#14532D");
  assert.equal(result.theme.colors.primary, "#14532D");
  assert.equal(result.theme.fallbackUsed, false);
});

test("null and inactive records use the Classic fallback", async () => {
  const noRecord = await loadTheme(oneResponse(jsonResponse(null)));
  assert.equal(noRecord.source, "classic-no-active");
  assert.equal(noRecord.theme.fallbackUsed, true);

  const inactive = themeRecord();
  inactive.isActive = false;
  const inactiveResult = await loadTheme(oneResponse(jsonResponse(inactive)));
  assert.equal(inactiveResult.source, "classic-no-active");
  assert.deepEqual(inactiveResult.theme.config, CLASSIC_THEME);
});

test("HTTP, network, invalid JSON and invalid envelope failures use Classic", async () => {
  const cases: Array<[string, typeof fetch, ActiveLandingTheme["source"]]> = [
    ["HTTP 500", oneResponse(jsonResponse(null, { status: 500 })), "classic-api-error"],
    ["network", (async () => { throw new TypeError("offline"); }) as typeof fetch, "classic-api-error"],
    ["invalid JSON", oneResponse(new Response("not-json")), "classic-invalid-response"],
    ["invalid envelope", oneResponse(new Response(JSON.stringify({ data: null }))), "classic-invalid-response"],
  ];
  for (const [label, fetchImpl, source] of cases) {
    const result = await loadTheme(fetchImpl);
    assert.equal(result.source, source, label);
    assert.deepEqual(result.theme.config, CLASSIC_THEME, label);
  }
});

test("timeout uses Classic without leaking the rejected request", async () => {
  const hangingFetch = ((_input: URL | RequestInfo, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    const keepAlive = setInterval(() => undefined, 50);
    init?.signal?.addEventListener("abort", () => {
      clearInterval(keepAlive);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  })) as typeof fetch;
  const result = await loadTheme(hangingFetch, 5);
  assert.equal(result.source, "classic-api-error");
  assert.equal(result.fetchDiagnostic?.code, "timeout");
});

test("cacheable loader propagates transient outages and recovers without caching Classic", async () => {
  const config = cloneClassic();
  config.colors.primary = "#14532D";
  let call = 0;
  const intermittentFetch = (async (input: URL | RequestInfo) => {
    assert.equal(String(input), THEME_API_URL);
    call += 1;
    if (call === 2) throw new TypeError("temporary Backend outage");
    return jsonResponse(themeRecord(config));
  }) as typeof fetch;

  const options = { baseUrl: "https://theme.test", fetchImpl: intermittentFetch };
  const first = await loadActiveLandingTheme(options);
  assert.equal(first.source, "active");
  await assert.rejects(
    () => loadActiveLandingTheme(options),
    (error: unknown) => error instanceof BackendRequestError && error.kind === "network",
  );
  const recovered = await loadActiveLandingTheme(options);
  assert.equal(recovered.source, "active");
  assert.equal(recovered.theme.colors.primary, "#14532D");
  assert.equal(call, 3);
});
test("invalid metadata is separate from invalid theme config", async () => {
  const missingConfig = themeRecord() as Record<string, unknown>;
  delete missingConfig.config;
  const badMetadata = await loadTheme(oneResponse(jsonResponse(missingConfig)));
  assert.equal(badMetadata.source, "classic-invalid-response");
  assert.equal(badMetadata.fetchDiagnostic?.code, "invalid_data");

  for (const config of [{ primaryColor: "#14532D" }, { ...cloneClassic(), schemaVersion: 2 }]) {
    const badConfig = await loadTheme(oneResponse(jsonResponse(themeRecord(config))));
    assert.equal(badConfig.source, "classic-invalid-config");
    assert.equal(badConfig.theme.fallbackUsed, true);
    assert.equal(badConfig.fetchDiagnostic, null);
    assert.equal(badConfig.theme.diagnostics[0]?.kind, "schema");
  }
});

test("a valid low-contrast theme remains active and reports contrast warnings", async () => {
  const config = cloneClassic();
  config.colors.primary = "#FFFFFF";
  config.colors.onPrimary = "#FFFFFF";
  const result = await loadTheme(oneResponse(jsonResponse(themeRecord(config))));
  assert.equal(result.source, "active");
  assert.equal(result.theme.fallbackUsed, false);
  assert.equal(result.theme.colors.primary, "#FFFFFF");
  assert.ok(result.theme.diagnostics.some((item) => item.kind === "contrast" && !item.passed));
});

test("resolved themes expose all runtime variables and custom colors/fonts", () => {
  const config = cloneClassic();
  config.colors.primary = "#14532D";
  config.colors.secondary = "#2456A4";
  config.colors.surface = "#EAF7F5";
  config.typography = { heading: "be-vietnam-pro", body: "noto-serif" };
  const resolved = resolveTheme(config);
  const colorVariables = Object.keys(resolved.cssVariables).filter((key) => key.startsWith("--color-"));
  const fontVariables = Object.keys(resolved.cssVariables).filter((key) => key.startsWith("--font-"));

  assert.equal(colorVariables.length, SEMANTIC_COLOR_TOKENS.length);
  assert.equal(colorVariables.length, 47);
  assert.equal(fontVariables.length, SEMANTIC_FONT_ALIASES.length);
  assert.equal(fontVariables.length, 13);
  assert.equal(resolved.cssVariables["--color-primary"], "#14532D");
  assert.equal(resolved.cssVariables["--color-secondary"], "#2456A4");
  assert.equal(resolved.cssVariables["--color-surface"], "#EAF7F5");
  assert.equal(resolved.cssVariables["--font-display-hero"], "var(--font-be-vietnam-pro)");
  assert.equal(resolved.cssVariables["--font-body-md"], "var(--font-noto-serif)");
  for (const value of Object.values(resolved.cssVariables)) {
    assert.match(value, /^(#[0-9A-F]{6}|var\(--font-(noto-serif|be-vietnam-pro)\))$/);
  }
});

test("Classic runtime variables match the existing Tailwind defaults", () => {
  const globals = readFileSync("src/app/globals.css", "utf8");
  const resolved = resolveTheme(cloneClassic());
  for (const [name, value] of Object.entries(resolved.cssVariables)) {
    assert.match(globals, new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*;`, "i"), name);
  }
});

test("schema rejects CSS injection and SSR markup contains custom variables immediately", () => {
  const unsafe = cloneClassic();
  unsafe.colors.primary = "red; background:url(javascript:alert(1))";
  const unsafeResult = resolveTheme(unsafe);
  assert.equal(unsafeResult.fallbackUsed, true);
  assert.equal(unsafeResult.cssVariables["--color-primary"], "#2E0208");

  const custom = cloneClassic();
  custom.colors.primary = "#14532D";
  const style = resolveTheme(custom).cssVariables;
  const html = renderToStaticMarkup(createElement("div", { "data-landing-theme-root": "", style }));
  assert.match(html, /data-landing-theme-root=""/);
  assert.match(html, /--color-primary:#14532D/);
  assert.doesNotMatch(html, /javascript:/i);
});

test("Landing integration scopes SSR variables and portals without touching CMS", () => {
  const layout = readFileSync("src/app/(landing)/layout.tsx", "utf8");
  const root = readFileSync("src/landing/features/theme/landing-theme.tsx", "utf8");
  const provider = readFileSync("src/landing/features/theme/landing-portal-provider.tsx", "utf8");
  const cmsLayout = readFileSync("src/app/(cms)/cms/layout.tsx", "utf8");
  assert.match(layout, /getActiveLandingTheme\(\)/);
  assert.match(layout, /<LandingThemeRoot theme=\{landingTheme\.theme\}>/);
  assert.match(root, /data-landing-theme-root/);
  assert.match(root, /className="[^"]*\bfont-body-md\b/);
  assert.match(root, /style=\{theme\.cssVariables/);
  assert.match(root, /<LandingPortalProvider>\{children\}<\/LandingPortalProvider>/);
  assert.match(provider, /data-landing-portal-root/);
  assert.doesNotMatch(cmsLayout, /LandingTheme|landing-theme/);
});

test("all Landing Radix dialogs mount inside the shared themed portal root", () => {
  const files = [
    "src/landing/features/search/components/search-filter-drawer.tsx",
    "src/landing/features/catalog/components/product/product-variant-dialog.tsx",
  ];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /useLandingPortalContainer\(\)/, file);
    assert.match(source, /<Dialog\.Portal container=\{portalContainer \?\? undefined\}>/, file);
    assert.match(source, /<Dialog\.Overlay/, file);
    assert.match(source, /<Dialog\.Content/, file);
  }
});

test("Next cache uses one tagged server cache with bounded stale behavior", () => {
  const cache = readFileSync("src/landing/features/theme/theme-cache.ts", "utf8");
  const server = readFileSync("src/landing/features/theme/public-theme.server.ts", "utf8");
  assert.match(cache, /LANDING_ACTIVE_THEME_CACHE_TAG = "landing-active-theme"/);
  assert.match(cache, /LANDING_ACTIVE_THEME_REVALIDATE_SECONDS = 60/);
  assert.match(server, /"use cache"/);
  assert.match(server, /cacheLife\(/);
  assert.match(server, /cacheTag\(LANDING_ACTIVE_THEME_CACHE_TAG\)/);
  const cachedBody = server.split("async function getCachedActiveLandingTheme()")[1]?.split("export async function getActiveLandingTheme()")[0] ?? "";
  assert.match(cachedBody, /return loadActiveLandingTheme\(/);
  assert.doesNotMatch(cachedBody, /catch\s*\(|resolveLandingThemeFailure\(/);
  assert.match(cache, /revalidateTag\(LANDING_ACTIVE_THEME_CACHE_TAG, \{ expire: 0 \}\)/);
  assert.doesNotMatch(server, /no-store|connection\(/);
});
