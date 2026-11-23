import type { SemanticColorToken } from "../colors/semantic-tokens.ts";
import type { SemanticFontAlias } from "../fonts/font-registry.ts";

export function createThemeCssVariables(
  colors: Record<SemanticColorToken, string>,
  fonts: Record<SemanticFontAlias, string>,
) {
  return Object.fromEntries([
    ...Object.entries(colors).map(([token, value]) => [`--color-${token}`, value]),
    ...Object.entries(fonts).map(([alias, value]) => [`--${alias}`, value]),
  ]);
}
