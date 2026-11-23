import type { ThemeFontId, ThemeTypographyV1 } from "../contracts/theme.types.ts";

export const THEME_FONT_REGISTRY = {
  "noto-serif": { cssVariable: "var(--font-noto-serif)", label: "Noto Serif" },
  "be-vietnam-pro": { cssVariable: "var(--font-be-vietnam-pro)", label: "Be Vietnam Pro" },
} as const satisfies Record<ThemeFontId, { cssVariable: string; label: string }>;

export const HEADING_FONT_ALIASES = [
  "font-display-hero",
  "font-display-hero-mobile",
  "font-headline-lg",
  "font-headline-lg-mobile",
  "font-headline-md",
  "font-headline-sm",
  "font-subheading",
  "font-price-serif",
] as const;

export const BODY_FONT_ALIASES = [
  "font-body-lg",
  "font-body-md",
  "font-body-sm",
  "font-label-ui",
  "font-label-eyebrow",
] as const;

export const SEMANTIC_FONT_ALIASES = [...HEADING_FONT_ALIASES, ...BODY_FONT_ALIASES] as const;
export type SemanticFontAlias = (typeof SEMANTIC_FONT_ALIASES)[number];

export function resolveSemanticFonts(
  typography: ThemeTypographyV1,
): Record<SemanticFontAlias, string> {
  const heading = THEME_FONT_REGISTRY[typography.heading].cssVariable;
  const body = THEME_FONT_REGISTRY[typography.body].cssVariable;
  return Object.fromEntries([
    ...HEADING_FONT_ALIASES.map((alias) => [alias, heading]),
    ...BODY_FONT_ALIASES.map((alias) => [alias, body]),
  ]) as Record<SemanticFontAlias, string>;
}
