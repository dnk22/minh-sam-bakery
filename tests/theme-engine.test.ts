import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CLASSIC_SEMANTIC_COLORS } from "../src/theme/colors/classic-palette.ts";
import { calculateContrastRatio, validateThemeContrast } from "../src/theme/colors/contrast-validator.ts";
import { resolveSemanticColors } from "../src/theme/colors/palette-resolver.ts";
import { SEMANTIC_COLOR_TOKENS } from "../src/theme/colors/semantic-tokens.ts";
import { parseThemeConfig } from "../src/theme/contracts/theme-config.schema.ts";
import type { ThemeConfigV1 } from "../src/theme/contracts/theme.types.ts";
import {
  BODY_FONT_ALIASES,
  HEADING_FONT_ALIASES,
  resolveSemanticFonts,
  SEMANTIC_FONT_ALIASES,
} from "../src/theme/fonts/font-registry.ts";
import { CLASSIC_THEME } from "../src/theme/presets/classic.ts";
import { resolveTheme, resolveThemeConfig } from "../src/theme/runtime/resolve-theme.ts";

function cloneClassic(): ThemeConfigV1 {
  return structuredClone(CLASSIC_THEME);
}

test("strictly parses ThemeConfigV1 and normalizes lowercase HEX", () => {
  const input = cloneClassic();
  input.colors.primary = "#abcdef";
  const result = parseThemeConfig(input);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.colors.primary, "#ABCDEF");
});

test("rejects malformed, incomplete, unsupported and unknown config fields", () => {
  const cases: unknown[] = [
    { ...cloneClassic(), schemaVersion: 2 },
    { ...cloneClassic(), unexpected: true },
    { ...cloneClassic(), typography: { heading: "comic-sans", body: "be-vietnam-pro" } },
    { ...cloneClassic(), colors: { ...cloneClassic().colors, primary: "oklch(0.5 0.2 20)" } },
    { ...cloneClassic(), colors: { ...cloneClassic().colors, primary: "#FFF" } },
    { ...cloneClassic(), colors: { ...cloneClassic().colors, extra: "#FFFFFF" } },
    { ...cloneClassic(), colors: { primary: "#2E0208" } },
  ];
  for (const input of cases) assert.equal(parseThemeConfig(input).success, false);
});

test("Classic preset contains 14 core colors and both expected fonts", () => {
  assert.equal(Object.keys(CLASSIC_THEME.colors).length, 14);
  assert.deepEqual(CLASSIC_THEME.typography, {
    heading: "noto-serif",
    body: "be-vietnam-pro",
  });
});

test("Classic resolves every semantic color exactly to the globals.css baseline", () => {
  const resolved = resolveSemanticColors(CLASSIC_THEME.colors);
  assert.equal(Object.keys(resolved).length, SEMANTIC_COLOR_TOKENS.length);
  assert.deepEqual(resolved, CLASSIC_SEMANTIC_COLORS);
});

test("semantic color source of truth cannot drift from globals.css", () => {
  const globals = readFileSync("src/app/globals.css", "utf8");
  const themeBlock = globals.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const tokens = [...themeBlock.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((match) => match[1]).sort();
  assert.deepEqual(tokens, [...SEMANTIC_COLOR_TOKENS].sort());

  const values = Object.fromEntries(
    [...themeBlock.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)]
      .map((match) => [match[1], match[2].toUpperCase()]),
  );
  assert.deepEqual(values, CLASSIC_SEMANTIC_COLORS);
});

test("custom color resolution is deterministic, immutable and scoped to relevant families", () => {
  const input = cloneClassic();
  input.colors.primary = "#14532D";
  const before = structuredClone(input);
  const first = resolveSemanticColors(input.colors);
  const second = resolveSemanticColors(input.colors);
  assert.deepEqual(first, second);
  assert.deepEqual(input, before);
  assert.equal(first.primary, "#14532D");
  assert.notEqual(first["primary-fixed"], CLASSIC_SEMANTIC_COLORS["primary-fixed"]);
  assert.equal(first.secondary, CLASSIC_SEMANTIC_COLORS.secondary);
  assert.equal(first.background, CLASSIC_SEMANTIC_COLORS.background);
  assert.equal(first["surface-container"], CLASSIC_SEMANTIC_COLORS["surface-container"]);
  for (const color of Object.values(first)) assert.match(color, /^#[0-9A-F]{6}$/);
});

test("invalid and legacy configs fall back safely with schema diagnostics", () => {
  const legacy = { primaryColor: "#8B3A2B", fontFamily: "Georgia" };
  const resolved = resolveThemeConfig(legacy);
  assert.equal(resolved.fallbackUsed, true);
  assert.deepEqual(resolved.config, CLASSIC_THEME);
  assert.equal(resolved.diagnostics[0]?.code, "invalid-config");

  const unsupported = resolveThemeConfig({ ...cloneClassic(), schemaVersion: 9 });
  assert.equal(unsupported.diagnostics[0]?.code, "unsupported-version");
});

test("contrast validation reports ratios without mutating or repairing config", () => {
  assert.equal(calculateContrastRatio("#000000", "#FFFFFF"), 21);
  const input = cloneClassic();
  input.colors.primary = "#FFFFFF";
  input.colors.onPrimary = "#FFFFFF";
  const before = structuredClone(input);
  const diagnostics = validateThemeContrast(input);
  const primary = diagnostics.find((item) => item.foreground === "on-primary");
  assert.equal(primary?.passed, false);
  assert.equal(primary?.ratio, 1);
  assert.equal(primary?.requiredRatio, 4.5);
  assert.match(primary?.message ?? "", /cần tối thiểu/);
  assert.deepEqual(input, before);
});

test("typography resolves all 13 aliases to the selected registered font", () => {
  assert.equal(SEMANTIC_FONT_ALIASES.length, 13);
  assert.equal(new Set(SEMANTIC_FONT_ALIASES).size, 13);
  for (const heading of ["noto-serif", "be-vietnam-pro"] as const) {
    for (const body of ["noto-serif", "be-vietnam-pro"] as const) {
      const resolved = resolveSemanticFonts({ heading, body });
      for (const alias of HEADING_FONT_ALIASES) assert.equal(resolved[alias], `var(--font-${heading})`);
      for (const alias of BODY_FONT_ALIASES) assert.equal(resolved[alias], `var(--font-${body})`);
    }
  }
});

test("semantic font aliases cannot drift from globals.css", () => {
  const globals = readFileSync("src/app/globals.css", "utf8");
  const themeBlock = globals.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const aliases = [...themeBlock.matchAll(/^\s*--(font-[a-z0-9-]+)\s*:/gm)].map((match) => match[1]).sort();
  assert.deepEqual(aliases, [...SEMANTIC_FONT_ALIASES].sort());
});

test("resolveTheme returns server-safe CSS variables and accessibility diagnostics", () => {
  const resolved = resolveTheme(CLASSIC_THEME);
  assert.equal(resolved.fallbackUsed, false);
  assert.equal(resolved.cssVariables["--color-primary"], "#2E0208");
  assert.equal(resolved.cssVariables["--font-body-md"], "var(--font-be-vietnam-pro)");
  assert.equal(resolved.diagnostics.filter((item) => item.kind === "contrast").length, 9);
});
