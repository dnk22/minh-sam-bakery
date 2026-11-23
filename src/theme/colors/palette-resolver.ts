import type { ThemeColorsV1 } from "../contracts/theme.types.ts";
import { transformFromClassicBaseline } from "./baseline-transform.ts";
import { CLASSIC_SEMANTIC_COLORS } from "./classic-palette.ts";
import type { SemanticColorToken } from "./semantic-tokens.ts";

const derive = transformFromClassicBaseline;
const direct = (color: string) => color.toUpperCase();

export function resolveSemanticColors(colors: ThemeColorsV1): Record<SemanticColorToken, string> {
  return {
    // Direct mappings always reflect the selected core value exactly.
    primary: direct(colors.primary),
    "primary-container": direct(colors.primaryContainer),
    "on-primary": direct(colors.onPrimary),
    secondary: direct(colors.secondary),
    "on-secondary": direct(colors.onSecondary),
    "secondary-fixed": direct(colors.accent),
    "secondary-fixed-dim": direct(colors.secondaryLight),
    background: direct(colors.background),
    "on-background": direct(colors.textPrimary),
    surface: direct(colors.surface),
    "on-surface": direct(colors.textPrimary),
    "surface-container-low": direct(colors.surfaceMuted),
    "surface-container-high": direct(colors.surfaceElevated),
    "on-surface-variant": direct(colors.textSecondary),
    "outline-variant": direct(colors.border),

    // Derived mappings transfer weighted OKLab changes from their core inputs
    // onto the exact Classic semantic values.
    "on-primary-container": derive("on-primary-container", colors, [["primaryContainer", 0.7], ["onPrimary", 0.2], ["textPrimary", 0.1]]),
    "primary-fixed": derive("primary-fixed", colors, [["primary", 0.85], ["onPrimary", 0.15]]),
    "primary-fixed-dim": derive("primary-fixed-dim", colors, [["primary", 0.85], ["onPrimary", 0.15]]),
    "on-primary-fixed": derive("on-primary-fixed", colors, [["primary", 0.55], ["textPrimary", 0.35], ["onPrimary", 0.1]]),
    "on-primary-fixed-variant": derive("on-primary-fixed-variant", colors, [["primary", 0.7], ["textPrimary", 0.3]]),
    "inverse-primary": derive("inverse-primary", colors, [["primary", 0.85], ["onPrimary", 0.15]]),
    "surface-tint": derive("surface-tint", colors, [["primary", 0.9], ["onPrimary", 0.1]]),
    "secondary-container": derive("secondary-container", colors, [["secondary", 0.55], ["accent", 0.45]]),
    "on-secondary-container": derive("on-secondary-container", colors, [["secondary", 0.6], ["textPrimary", 0.25], ["accent", 0.15]]),
    "on-secondary-fixed": derive("on-secondary-fixed", colors, [["secondary", 0.35], ["textPrimary", 0.45], ["accent", 0.2]]),
    "on-secondary-fixed-variant": derive("on-secondary-fixed-variant", colors, [["secondary", 0.7], ["textPrimary", 0.3]]),
    "surface-bright": derive("surface-bright", colors, [["surface", 0.65], ["background", 0.35]]),
    "surface-dim": derive("surface-dim", colors, [["surface", 0.45], ["surfaceElevated", 0.4], ["textPrimary", 0.15]]),
    "surface-variant": derive("surface-variant", colors, [["surfaceElevated", 0.6], ["surfaceMuted", 0.4]]),
    "surface-container-lowest": derive("surface-container-lowest", colors, [["surface", 0.8], ["background", 0.2]]),
    "surface-container": derive("surface-container", colors, [["surfaceMuted", 0.55], ["surfaceElevated", 0.45]]),
    "surface-container-highest": derive("surface-container-highest", colors, [["surfaceElevated", 0.75], ["textPrimary", 0.25]]),
    "inverse-surface": derive("inverse-surface", colors, [["textPrimary", 0.8], ["surface", 0.2]]),
    "inverse-on-surface": derive("inverse-on-surface", colors, [["surface", 0.65], ["surfaceMuted", 0.35]]),
    outline: derive("outline", colors, [["border", 0.65], ["textSecondary", 0.35]]),
    tertiary: derive("tertiary", colors, [["primary", 0.45], ["secondary", 0.35], ["textPrimary", 0.2]]),
    "on-tertiary": derive("on-tertiary", colors, [["onPrimary", 0.55], ["primary", 0.25], ["secondary", 0.2]]),
    "tertiary-container": derive("tertiary-container", colors, [["primary", 0.35], ["secondary", 0.3], ["surfaceMuted", 0.2], ["textPrimary", 0.15]]),
    "on-tertiary-container": derive("on-tertiary-container", colors, [["primary", 0.3], ["secondary", 0.3], ["textSecondary", 0.25], ["surfaceMuted", 0.15]]),
    "tertiary-fixed": derive("tertiary-fixed", colors, [["primary", 0.35], ["secondary", 0.35], ["surface", 0.3]]),
    "tertiary-fixed-dim": derive("tertiary-fixed-dim", colors, [["primary", 0.4], ["secondary", 0.4], ["surface", 0.2]]),
    "on-tertiary-fixed": derive("on-tertiary-fixed", colors, [["primary", 0.3], ["secondary", 0.25], ["textPrimary", 0.45]]),
    "on-tertiary-fixed-variant": derive("on-tertiary-fixed-variant", colors, [["primary", 0.4], ["secondary", 0.35], ["textPrimary", 0.25]]),

    // The error family is intentionally protected from brand color changes.
    error: CLASSIC_SEMANTIC_COLORS.error,
    "on-error": CLASSIC_SEMANTIC_COLORS["on-error"],
    "error-container": CLASSIC_SEMANTIC_COLORS["error-container"],
    "on-error-container": CLASSIC_SEMANTIC_COLORS["on-error-container"],
  };
}
