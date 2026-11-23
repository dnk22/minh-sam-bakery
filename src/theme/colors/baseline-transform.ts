import { converter, formatHex, toGamut } from "culori";

import type { ThemeColorsV1 } from "../contracts/theme.types.ts";
import { CLASSIC_THEME } from "../presets/classic.ts";
import { CLASSIC_SEMANTIC_COLORS } from "./classic-palette.ts";
import type { SemanticColorToken } from "./semantic-tokens.ts";

export type CoreColorKey = keyof ThemeColorsV1;
export type CoreColorInfluence = readonly [key: CoreColorKey, weight: number];

const toOklab = converter("oklab");
const mapToSrgb = toGamut("rgb", "oklch");

function asOklab(color: string) {
  const converted = toOklab(color);
  if (!converted) throw new Error(`Không thể chuyển đổi màu HEX hợp lệ: ${color}`);
  return converted;
}

function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Transfers weighted OKLab deltas from core colors to a Classic semantic
 * baseline. A zero delta returns the exact baseline; nearby inputs therefore
 * stay on the same continuous transformation instead of switching formulas.
 */
export function transformFromClassicBaseline(
  token: SemanticColorToken,
  colors: ThemeColorsV1,
  influences: readonly CoreColorInfluence[],
) {
  const baseline = CLASSIC_SEMANTIC_COLORS[token];
  let deltaL = 0;
  let deltaA = 0;
  let deltaB = 0;

  for (const [key, weight] of influences) {
    const current = asOklab(colors[key]);
    const classic = asOklab(CLASSIC_THEME.colors[key]);
    deltaL += (current.l - classic.l) * weight;
    deltaA += (current.a - classic.a) * weight;
    deltaB += (current.b - classic.b) * weight;
  }

  if (deltaL === 0 && deltaA === 0 && deltaB === 0) return baseline;

  const anchor = asOklab(baseline);
  const mapped = mapToSrgb({
    mode: "oklab",
    l: clampUnit(anchor.l + deltaL),
    a: anchor.a + deltaA,
    b: anchor.b + deltaB,
  });
  return formatHex(mapped).toUpperCase();
}
