import { validateThemeContrast } from "../colors/contrast-validator.ts";
import { resolveSemanticColors } from "../colors/palette-resolver.ts";
import { parseThemeConfig } from "../contracts/theme-config.schema.ts";
import type {
  ThemeConfigResolutionResult,
  ThemeResolutionResult,
  ThemeSchemaDiagnostic,
} from "../contracts/theme.types.ts";
import { resolveSemanticFonts } from "../fonts/font-registry.ts";
import { CLASSIC_THEME } from "../presets/classic.ts";
import { createThemeCssVariables } from "./theme-style.ts";

function isUnsupportedVersion(input: unknown) {
  return typeof input === "object"
    && input !== null
    && "schemaVersion" in input
    && (input as { schemaVersion?: unknown }).schemaVersion !== 1;
}

export function resolveThemeConfig(input: unknown): ThemeConfigResolutionResult {
  const parsed = parseThemeConfig(input);
  if (parsed.success) return { config: parsed.data, fallbackUsed: false, diagnostics: [] };

  const diagnostic: ThemeSchemaDiagnostic = {
    kind: "schema",
    code: isUnsupportedVersion(input) ? "unsupported-version" : "invalid-config",
    message: isUnsupportedVersion(input)
      ? "Phiên bản cấu hình theme chưa được hỗ trợ; đang dùng Classic."
      : "Cấu hình theme không hợp lệ; đang dùng Classic.",
    issues: parsed.issues,
  };
  return { config: CLASSIC_THEME, fallbackUsed: true, diagnostics: [diagnostic] };
}

export function resolveTheme(configInput: unknown): ThemeResolutionResult {
  const resolvedConfig = resolveThemeConfig(configInput);
  const colors = resolveSemanticColors(resolvedConfig.config.colors);
  const fonts = resolveSemanticFonts(resolvedConfig.config.typography);
  const contrastDiagnostics = validateThemeContrast(resolvedConfig.config);

  return {
    config: resolvedConfig.config,
    colors,
    fonts,
    cssVariables: createThemeCssVariables(colors, fonts),
    fallbackUsed: resolvedConfig.fallbackUsed,
    diagnostics: [...resolvedConfig.diagnostics, ...contrastDiagnostics],
  };
}
