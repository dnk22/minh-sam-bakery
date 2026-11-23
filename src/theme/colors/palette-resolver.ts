import { converter, formatHex, interpolate, wcagContrast } from "culori";

import type { ThemeColorsV1 } from "../contracts/theme.types.ts";
import { CLASSIC_THEME } from "../presets/classic.ts";
import { CLASSIC_SEMANTIC_COLORS } from "./classic-palette.ts";
import type { SemanticColorToken } from "./semantic-tokens.ts";

type CoreColorKey = keyof ThemeColorsV1;

const toOklch = converter("oklch");

function mix(from: string, to: string, amount: number) {
  return formatHex(interpolate([from, to], "oklch")(amount)).toUpperCase();
}

function rotateHue(color: string, degrees: number) {
  const value = toOklch(color);
  if (!value) return color;
  return formatHex({ ...value, h: ((value.h ?? 0) + degrees + 360) % 360 }).toUpperCase();
}

function readableForeground(background: string, candidates: readonly string[]) {
  return candidates.reduce((best, candidate) =>
    wcagContrast(candidate, background) > wcagContrast(best, background) ? candidate : best,
  );
}

function keysMatchClassic(colors: ThemeColorsV1, keys: readonly CoreColorKey[]) {
  return keys.every((key) => colors[key] === CLASSIC_THEME.colors[key]);
}

/**
 * Keeps each unchanged Classic palette family byte-for-byte compatible while
 * deriving only families whose core inputs changed. This is config-based and
 * never depends on a Backend theme name or code.
 */
function classicOr(
  colors: ThemeColorsV1,
  token: SemanticColorToken,
  keys: readonly CoreColorKey[],
  derive: () => string,
) {
  return keysMatchClassic(colors, keys) ? CLASSIC_SEMANTIC_COLORS[token] : derive();
}

export function resolveSemanticColors(colors: ThemeColorsV1): Record<SemanticColorToken, string> {
  const primaryFixed = mix(colors.primary, colors.onPrimary, 0.86);
  const primaryFixedDim = mix(colors.primary, colors.onPrimary, 0.7);
  const onPrimaryFixed = readableForeground(primaryFixed, [colors.textPrimary, colors.primary, colors.onPrimary]);
  const onPrimaryFixedVariant = mix(colors.primary, colors.textPrimary, 0.35);
  const secondaryContainer = mix(colors.secondary, colors.accent, 0.7);
  const onSecondaryContainer = readableForeground(secondaryContainer, [colors.secondary, colors.textPrimary, colors.onSecondary]);
  const onSecondaryFixed = readableForeground(colors.accent, [colors.textPrimary, colors.secondary, colors.onSecondary]);
  const tertiarySeed = rotateHue(mix(colors.primary, colors.secondary, 0.42), 118);
  const tertiary = mix(tertiarySeed, colors.textPrimary, 0.52);
  const tertiaryContainer = mix(tertiary, colors.surfaceMuted, 0.12);
  const tertiaryFixed = mix(tertiarySeed, colors.surface, 0.78);
  const tertiaryFixedDim = mix(tertiarySeed, colors.surface, 0.66);

  return {
    primary: classicOr(colors, "primary", ["primary"], () => colors.primary),
    "primary-container": classicOr(colors, "primary-container", ["primaryContainer"], () => colors.primaryContainer),
    "on-primary": classicOr(colors, "on-primary", ["onPrimary"], () => colors.onPrimary),
    "on-primary-container": classicOr(colors, "on-primary-container", ["primaryContainer", "onPrimary", "textPrimary"], () =>
      readableForeground(colors.primaryContainer, [colors.onPrimary, colors.textPrimary])),
    "primary-fixed": classicOr(colors, "primary-fixed", ["primary", "onPrimary"], () => primaryFixed),
    "primary-fixed-dim": classicOr(colors, "primary-fixed-dim", ["primary", "onPrimary"], () => primaryFixedDim),
    "on-primary-fixed": classicOr(colors, "on-primary-fixed", ["primary", "onPrimary", "textPrimary"], () => onPrimaryFixed),
    "on-primary-fixed-variant": classicOr(colors, "on-primary-fixed-variant", ["primary", "textPrimary"], () => onPrimaryFixedVariant),
    "inverse-primary": classicOr(colors, "inverse-primary", ["primary", "onPrimary"], () => primaryFixedDim),
    "surface-tint": classicOr(colors, "surface-tint", ["primary", "onPrimary"], () => mix(colors.primary, colors.onPrimary, 0.28)),
    secondary: classicOr(colors, "secondary", ["secondary"], () => colors.secondary),
    "on-secondary": classicOr(colors, "on-secondary", ["onSecondary"], () => colors.onSecondary),
    "secondary-container": classicOr(colors, "secondary-container", ["secondary", "accent"], () => secondaryContainer),
    "on-secondary-container": classicOr(colors, "on-secondary-container", ["secondary", "accent", "textPrimary", "onSecondary"], () => onSecondaryContainer),
    "secondary-fixed": classicOr(colors, "secondary-fixed", ["accent"], () => colors.accent),
    "secondary-fixed-dim": classicOr(colors, "secondary-fixed-dim", ["secondaryLight"], () => colors.secondaryLight),
    "on-secondary-fixed": classicOr(colors, "on-secondary-fixed", ["accent", "secondary", "textPrimary", "onSecondary"], () => onSecondaryFixed),
    "on-secondary-fixed-variant": classicOr(colors, "on-secondary-fixed-variant", ["secondary", "textPrimary"], () => mix(colors.secondary, colors.textPrimary, 0.25)),
    background: classicOr(colors, "background", ["background"], () => colors.background),
    "on-background": classicOr(colors, "on-background", ["textPrimary"], () => colors.textPrimary),
    surface: classicOr(colors, "surface", ["surface"], () => colors.surface),
    "on-surface": classicOr(colors, "on-surface", ["textPrimary"], () => colors.textPrimary),
    "surface-bright": classicOr(colors, "surface-bright", ["surface", "background"], () => mix(colors.surface, colors.background, 0.35)),
    "surface-dim": classicOr(colors, "surface-dim", ["surface", "surfaceElevated", "textPrimary"], () => mix(colors.surfaceElevated, colors.textPrimary, 0.08)),
    "surface-variant": classicOr(colors, "surface-variant", ["surfaceElevated", "surfaceMuted"], () => mix(colors.surfaceElevated, colors.surfaceMuted, 0.5)),
    "surface-container-lowest": classicOr(colors, "surface-container-lowest", ["surface"], () => mix(colors.surface, "#FFFFFF", 0.2)),
    "surface-container-low": classicOr(colors, "surface-container-low", ["surfaceMuted"], () => colors.surfaceMuted),
    "surface-container": classicOr(colors, "surface-container", ["surfaceMuted", "surfaceElevated"], () => mix(colors.surfaceMuted, colors.surfaceElevated, 0.5)),
    "surface-container-high": classicOr(colors, "surface-container-high", ["surfaceElevated"], () => colors.surfaceElevated),
    "surface-container-highest": classicOr(colors, "surface-container-highest", ["surfaceElevated", "textPrimary"], () => mix(colors.surfaceElevated, colors.textPrimary, 0.04)),
    "inverse-surface": classicOr(colors, "inverse-surface", ["textPrimary", "surface"], () => mix(colors.textPrimary, colors.surface, 0.12)),
    "inverse-on-surface": classicOr(colors, "inverse-on-surface", ["surface", "surfaceMuted"], () => mix(colors.surface, colors.surfaceMuted, 0.4)),
    "on-surface-variant": classicOr(colors, "on-surface-variant", ["textSecondary"], () => colors.textSecondary),
    outline: classicOr(colors, "outline", ["border", "textSecondary"], () => mix(colors.border, colors.textSecondary, 0.42)),
    "outline-variant": classicOr(colors, "outline-variant", ["border"], () => colors.border),
    tertiary: classicOr(colors, "tertiary", ["primary", "secondary", "textPrimary"], () => tertiary),
    "on-tertiary": classicOr(colors, "on-tertiary", ["primary", "secondary", "textPrimary", "onPrimary"], () => readableForeground(tertiary, [colors.onPrimary, colors.textPrimary])),
    "tertiary-container": classicOr(colors, "tertiary-container", ["primary", "secondary", "textPrimary", "surfaceMuted"], () => tertiaryContainer),
    "on-tertiary-container": classicOr(colors, "on-tertiary-container", ["primary", "secondary", "textPrimary", "surfaceMuted", "onPrimary"], () => readableForeground(tertiaryContainer, [colors.onPrimary, colors.textPrimary, tertiaryFixedDim])),
    "tertiary-fixed": classicOr(colors, "tertiary-fixed", ["primary", "secondary", "surface"], () => tertiaryFixed),
    "tertiary-fixed-dim": classicOr(colors, "tertiary-fixed-dim", ["primary", "secondary", "surface"], () => tertiaryFixedDim),
    "on-tertiary-fixed": classicOr(colors, "on-tertiary-fixed", ["primary", "secondary", "surface", "textPrimary"], () => readableForeground(tertiaryFixed, [colors.textPrimary, tertiary, colors.onPrimary])),
    "on-tertiary-fixed-variant": classicOr(colors, "on-tertiary-fixed-variant", ["primary", "secondary", "textPrimary"], () => mix(tertiary, colors.textPrimary, 0.28)),
    error: CLASSIC_SEMANTIC_COLORS.error,
    "on-error": CLASSIC_SEMANTIC_COLORS["on-error"],
    "error-container": CLASSIC_SEMANTIC_COLORS["error-container"],
    "on-error-container": CLASSIC_SEMANTIC_COLORS["on-error-container"],
  };
}
