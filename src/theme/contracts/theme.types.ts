import type { z } from "zod";

import type {
  themeColorsV1Schema,
  themeConfigV1Schema,
  themeFontIdSchema,
  themeTypographyV1Schema,
} from "./theme-config.schema.ts";
import type { SemanticColorToken } from "../colors/semantic-tokens.ts";
import type { SemanticFontAlias } from "../fonts/font-registry.ts";

export type ThemeFontId = z.infer<typeof themeFontIdSchema>;
export type ThemeColorsV1 = z.infer<typeof themeColorsV1Schema>;
export type ThemeTypographyV1 = z.infer<typeof themeTypographyV1Schema>;
export type ThemeConfigV1 = z.infer<typeof themeConfigV1Schema>;

export type ThemeValidationIssue = {
  path: string;
  message: string;
};

export type ThemeConfigParseResult =
  | { success: true; data: ThemeConfigV1 }
  | { success: false; issues: ThemeValidationIssue[] };

export type ThemeSchemaDiagnostic = {
  kind: "schema";
  code: "invalid-config" | "unsupported-version";
  message: string;
  issues: ThemeValidationIssue[];
};

export type ThemeContrastDiagnostic = {
  kind: "contrast";
  id: string;
  foreground: SemanticColorToken;
  background: SemanticColorToken;
  effectiveForeground: string;
  effectiveBackground: string;
  foregroundOpacity: number;
  ratio: number;
  requiredRatio: number;
  passed: boolean;
  context: string;
  textCategory: "normal" | "large" | "ui";
  message: string;
};

export type ThemeDiagnostic = ThemeSchemaDiagnostic | ThemeContrastDiagnostic;

export type ThemeResolutionResult = {
  config: ThemeConfigV1;
  colors: Record<SemanticColorToken, string>;
  fonts: Record<SemanticFontAlias, string>;
  cssVariables: Record<string, string>;
  fallbackUsed: boolean;
  diagnostics: ThemeDiagnostic[];
};

export type ThemeConfigResolutionResult = {
  config: ThemeConfigV1;
  fallbackUsed: boolean;
  diagnostics: ThemeSchemaDiagnostic[];
};
