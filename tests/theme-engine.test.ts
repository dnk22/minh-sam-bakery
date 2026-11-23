import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { differenceEuclidean } from "culori";

import { CLASSIC_SEMANTIC_COLORS } from "../src/theme/colors/classic-palette.ts";
import {
  CONTRAST_PAIRS,
  validateContrastPairRegistry,
  type ContrastPair,
} from "../src/theme/colors/contrast-pairs.ts";
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

test("every direct semantic mapping exactly reflects its Classic core color", () => {
  const resolved = resolveSemanticColors(CLASSIC_THEME.colors);
  const directMappings = {
    primary: "primary",
    "primary-container": "primaryContainer",
    "on-primary": "onPrimary",
    secondary: "secondary",
    "on-secondary": "onSecondary",
    "secondary-fixed": "accent",
    "secondary-fixed-dim": "secondaryLight",
    background: "background",
    "on-background": "textPrimary",
    surface: "surface",
    "on-surface": "textPrimary",
    "surface-container-low": "surfaceMuted",
    "surface-container-high": "surfaceElevated",
    "on-surface-variant": "textSecondary",
    "outline-variant": "border",
  } as const;

  for (const [token, core] of Object.entries(directMappings)) {
    assert.equal(resolved[token as keyof typeof resolved], CLASSIC_THEME.colors[core]);
  }
  assert.equal(CLASSIC_THEME.colors.surface, "#FFF8F7");
  assert.equal(resolved["surface-container-lowest"], "#FFFFFF");
});

test("direct resolver output stays uppercase even for lowercase typed input", () => {
  const input = cloneClassic();
  input.colors.primary = "#abcdef";
  input.colors.surface = "#f0f1f2";
  const resolved = resolveSemanticColors(input.colors);
  assert.equal(resolved.primary, "#ABCDEF");
  assert.equal(resolved.surface, "#F0F1F2");
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

test("primary derivatives remain continuous for one-step changes around Classic", () => {
  const distance = differenceEuclidean("oklab");
  const lower = cloneClassic();
  const upper = cloneClassic();
  lower.colors.primary = "#2E0207";
  upper.colors.primary = "#2E0209";
  const classic = resolveSemanticColors(CLASSIC_THEME.colors);
  const below = resolveSemanticColors(lower.colors);
  const above = resolveSemanticColors(upper.colors);
  const primaryDerived = [
    "primary-fixed",
    "primary-fixed-dim",
    "on-primary-fixed",
    "on-primary-fixed-variant",
    "inverse-primary",
    "surface-tint",
  ] as const;

  // 0.01 OKLab is a conservative near-Classic bound: well below a clearly
  // visible palette jump while allowing final HEX quantization.
  for (const token of primaryDerived) {
    assert.ok(distance(below[token], classic[token]) < 0.01, `${token} jumped below Classic`);
    assert.ok(distance(classic[token], above[token]) < 0.01, `${token} jumped above Classic`);
    assert.ok(distance(below[token], above[token]) < 0.02, `${token} is discontinuous around Classic`);
  }
});

test("secondary changes do not affect surface families", () => {
  const input = cloneClassic();
  input.colors.secondary = "#2456A4";
  const resolved = resolveSemanticColors(input.colors);
  const surfaceTokens = SEMANTIC_COLOR_TOKENS.filter((token) =>
    token === "background"
    || token === "on-background"
    || token === "outline"
    || token === "outline-variant"
    || token === "on-surface"
    || token === "on-surface-variant"
    || token.startsWith("surface")
    || token.startsWith("inverse-surface")
    || token === "inverse-on-surface",
  );
  for (const token of surfaceTokens) assert.equal(resolved[token], CLASSIC_SEMANTIC_COLORS[token]);
  assert.notEqual(resolved["secondary-container"], CLASSIC_SEMANTIC_COLORS["secondary-container"]);
});

test("surface changes propagate continuously to dependent surface tokens", () => {
  const distance = differenceEuclidean("oklab");
  const input = cloneClassic();
  input.colors.surface = "#EAF7F5";
  const resolved = resolveSemanticColors(input.colors);
  assert.equal(resolved.surface, "#EAF7F5");
  for (const token of ["surface-bright", "surface-container-lowest", "inverse-surface", "inverse-on-surface"] as const) {
    assert.ok(distance(resolved[token], CLASSIC_SEMANTIC_COLORS[token]) > 0.005, `${token} did not follow Surface`);
  }
  assert.equal(resolved.secondary, CLASSIC_SEMANTIC_COLORS.secondary);
});

test("extreme and near-neutral custom colors stay deterministic and in HEX gamut", () => {
  for (const primary of ["#000000", "#FFFFFF", "#7F7F80"] as const) {
    const input = cloneClassic();
    input.colors.primary = primary;
    input.colors.primaryContainer = primary;
    const first = resolveSemanticColors(input.colors);
    const second = resolveSemanticColors(input.colors);
    assert.deepEqual(first, second);
    for (const color of Object.values(first)) assert.match(color, /^#[0-9A-F]{6}$/);
  }
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

test("fallback results are editable clones and cannot corrupt the frozen Classic preset", () => {
  const first = resolveThemeConfig(null);
  const second = resolveThemeConfig({ schemaVersion: 99 });
  assert.notStrictEqual(first.config, second.config);
  assert.notStrictEqual(first.config.colors, second.config.colors);
  first.config.colors.primary = "#FFFFFF";
  first.config.typography.heading = "be-vietnam-pro";
  const third = resolveThemeConfig({ legacy: true });
  assert.equal(third.config.colors.primary, "#2E0208");
  assert.equal(third.config.typography.heading, "noto-serif");
  assert.equal(CLASSIC_THEME.colors.primary, "#2E0208");
  assert.equal(Object.isFrozen(CLASSIC_THEME), true);
  assert.equal(Object.isFrozen(CLASSIC_THEME.colors), true);
  assert.throws(() => {
    (CLASSIC_THEME.colors as { primary: string }).primary = "#000000";
  });
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

test("Landing Hero contrast detects accent matching Primary", () => {
  const input = cloneClassic();
  input.colors.accent = input.colors.primary;
  const before = structuredClone(input);
  const hero = validateThemeContrast(input).find((item) => item.id === "landing-hero-title");
  assert.equal(hero?.ratio, 1);
  assert.equal(hero?.passed, false);
  assert.equal(hero?.foreground, "secondary-fixed");
  assert.equal(hero?.background, "primary");
  assert.deepEqual(input, before);
});

test("contrast diagnostics expose stable CMS-ready metadata", () => {
  const diagnostics = validateThemeContrast(cloneClassic());
  assert.equal(diagnostics.length, CONTRAST_PAIRS.length);
  assert.ok(diagnostics.every((item) => item.passed));
  for (const item of diagnostics) {
    assert.ok(item.id.length > 0);
    assert.ok(item.context.length > 0);
    assert.ok(["normal", "large", "ui"].includes(item.textCategory));
    assert.match(item.effectiveForeground, /^#[0-9A-F]{6}$/);
    assert.match(item.effectiveBackground, /^#[0-9A-F]{6}$/);
    assert.ok(item.requiredRatio === 3 || item.requiredRatio === 4.5);
  }
});

test("contrast pair registry rejects duplicate and malformed definitions", () => {
  assert.deepEqual(validateContrastPairRegistry(CONTRAST_PAIRS), []);
  const first = CONTRAST_PAIRS[0];
  const invalid = [
    first,
    { ...first },
    { ...first, id: "Invalid ID", requiredRatio: 3, context: "" },
  ] as unknown as readonly ContrastPair[];
  const errors = validateContrastPairRegistry(invalid);
  assert.ok(errors.some((error) => error.includes("ID contrast bị trùng")));
  assert.ok(errors.some((error) => error.includes("Cặp contrast bị trùng")));
  assert.ok(errors.some((error) => error.includes("ID contrast không hợp lệ")));
  assert.ok(errors.some((error) => error.includes("Ngưỡng contrast")));
  assert.ok(errors.some((error) => error.includes("Context contrast")));
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
  assert.equal(resolved.diagnostics.filter((item) => item.kind === "contrast").length, CONTRAST_PAIRS.length);
});
