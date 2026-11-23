import { z } from "zod";

import type { ThemeConfigParseResult } from "./theme.types.ts";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Màu phải có định dạng HEX #RRGGBB.")
  .transform((value) => value.toUpperCase());

export const themeFontIdSchema = z.enum(["noto-serif", "be-vietnam-pro"]);

export const themeColorsV1Schema = z
  .object({
    primary: hexColorSchema,
    primaryContainer: hexColorSchema,
    onPrimary: hexColorSchema,
    secondary: hexColorSchema,
    secondaryLight: hexColorSchema,
    onSecondary: hexColorSchema,
    background: hexColorSchema,
    surface: hexColorSchema,
    surfaceMuted: hexColorSchema,
    surfaceElevated: hexColorSchema,
    textPrimary: hexColorSchema,
    textSecondary: hexColorSchema,
    border: hexColorSchema,
    accent: hexColorSchema,
  })
  .strict();

export const themeTypographyV1Schema = z
  .object({
    heading: themeFontIdSchema,
    body: themeFontIdSchema,
  })
  .strict();

export const themeConfigV1Schema = z
  .object({
    schemaVersion: z.literal(1),
    colors: themeColorsV1Schema,
    typography: themeTypographyV1Schema,
  })
  .strict();

export function parseThemeConfig(input: unknown): ThemeConfigParseResult {
  const result = themeConfigV1Schema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  return {
    success: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.map(String).join(".") || "config",
      message: issue.message,
    })),
  };
}
