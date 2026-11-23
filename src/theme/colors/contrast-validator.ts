import { converter, formatHex, wcagContrast } from "culori";

import type { ThemeConfigV1, ThemeContrastDiagnostic } from "../contracts/theme.types.ts";
import { CONTRAST_PAIRS, validateContrastPairRegistry } from "./contrast-pairs.ts";
import { resolveSemanticColors } from "./palette-resolver.ts";

const registryErrors = validateContrastPairRegistry(CONTRAST_PAIRS);
if (registryErrors.length > 0) throw new Error(registryErrors.join("\n"));

const toRgb = converter("rgb");

function compositeForeground(foreground: string, background: string, opacity: number) {
  if (opacity === 1) return foreground;
  const foregroundRgb = toRgb(foreground);
  const backgroundRgb = toRgb(background);
  if (!foregroundRgb || !backgroundRgb) throw new Error("Không thể composite màu contrast hợp lệ.");
  return formatHex({
    mode: "rgb",
    r: foregroundRgb.r * opacity + backgroundRgb.r * (1 - opacity),
    g: foregroundRgb.g * opacity + backgroundRgb.g * (1 - opacity),
    b: foregroundRgb.b * opacity + backgroundRgb.b * (1 - opacity),
  }).toUpperCase();
}

export function calculateContrastRatio(foreground: string, background: string) {
  return wcagContrast(foreground, background);
}

export function validateThemeContrast(config: ThemeConfigV1): ThemeContrastDiagnostic[] {
  const colors = resolveSemanticColors(config.colors);
  return CONTRAST_PAIRS.map((pair) => {
    const foregroundOpacity = "foregroundOpacity" in pair ? pair.foregroundOpacity : 1;
    const effectiveBackground = colors[pair.background];
    const effectiveForeground = compositeForeground(
      colors[pair.foreground],
      effectiveBackground,
      foregroundOpacity,
    );
    const ratio = calculateContrastRatio(effectiveForeground, effectiveBackground);
    const passed = ratio >= pair.requiredRatio;
    return {
      kind: "contrast",
      id: pair.id,
      foreground: pair.foreground,
      background: pair.background,
      effectiveForeground,
      effectiveBackground,
      foregroundOpacity,
      ratio,
      requiredRatio: pair.requiredRatio,
      passed,
      context: pair.context,
      textCategory: pair.textCategory,
      message: passed
        ? `${pair.context} Đạt ${ratio.toFixed(2)}:1.`
        : `${pair.context} Chỉ đạt ${ratio.toFixed(2)}:1; cần tối thiểu ${pair.requiredRatio}:1.`,
    };
  });
}
