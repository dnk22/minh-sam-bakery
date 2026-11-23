import { wcagContrast } from "culori";

import type { ThemeConfigV1, ThemeContrastDiagnostic } from "../contracts/theme.types.ts";
import { resolveSemanticColors } from "./palette-resolver.ts";
import type { SemanticColorToken } from "./semantic-tokens.ts";

type ContrastPair = {
  foreground: SemanticColorToken;
  background: SemanticColorToken;
  requiredRatio: number;
};

const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { foreground: "on-primary", background: "primary", requiredRatio: 4.5 },
  { foreground: "on-secondary", background: "secondary", requiredRatio: 4.5 },
  { foreground: "on-background", background: "background", requiredRatio: 4.5 },
  { foreground: "on-surface", background: "surface", requiredRatio: 4.5 },
  { foreground: "on-surface-variant", background: "surface", requiredRatio: 4.5 },
  { foreground: "on-primary-container", background: "primary-container", requiredRatio: 4.5 },
  { foreground: "on-secondary-container", background: "secondary-container", requiredRatio: 4.5 },
  { foreground: "on-tertiary", background: "tertiary", requiredRatio: 4.5 },
  { foreground: "on-error", background: "error", requiredRatio: 4.5 },
];

export function calculateContrastRatio(foreground: string, background: string) {
  return wcagContrast(foreground, background);
}

export function validateThemeContrast(config: ThemeConfigV1): ThemeContrastDiagnostic[] {
  const colors = resolveSemanticColors(config.colors);
  return CONTRAST_PAIRS.map(({ foreground, background, requiredRatio }) => {
    const ratio = calculateContrastRatio(colors[foreground], colors[background]);
    const passed = ratio >= requiredRatio;
    return {
      kind: "contrast",
      foreground,
      background,
      ratio,
      requiredRatio,
      passed,
      message: passed
        ? `${foreground} đạt tương phản ${ratio.toFixed(2)}:1 trên ${background}.`
        : `${foreground} chỉ đạt ${ratio.toFixed(2)}:1 trên ${background}; cần tối thiểu ${requiredRatio}:1.`,
    };
  });
}
