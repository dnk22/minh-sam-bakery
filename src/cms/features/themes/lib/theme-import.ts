import { z } from "zod";

import { parseThemeConfig, themeConfigV1Schema } from "../../../../theme/contracts/theme-config.schema.ts";
import type { ThemeConfigV1 } from "../../../../theme/contracts/theme.types.ts";

// Support both the standalone ThemeConfigV1 and the CMS create payload.
// Unknown keys are rejected rather than silently importing an unrelated export.
const themeImportPayloadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  code: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(1000).optional(),
  config: themeConfigV1Schema,
  isActive: z.literal(false).optional(),
}).strict();

export type ImportedThemeJson = {
  config: ThemeConfigV1;
  metadata?: { name: string; code: string; description?: string };
};

export type ThemeImportResult =
  | { success: true; data: ImportedThemeJson }
  | { success: false; message: string };

export function parseThemeImportJson(source: string): ThemeImportResult {
  let input: unknown;
  try {
    input = JSON.parse(source);
  } catch {
    return { success: false, message: "File JSON không hợp lệ. Hãy kiểm tra cú pháp của file." };
  }

  // The format without CMS metadata must be a strict ThemeConfigV1.
  if (!input || typeof input !== "object" || Array.isArray(input) || !("config" in input)) {
    const result = parseThemeConfig(input);
    return result.success
      ? { success: true, data: { config: result.data } }
      : { success: false, message: "ThemeConfigV1 không hợp lệ: " + result.issues.slice(0, 3).map((issue) => `${issue.path}: ${issue.message}`).join("; ") };
  }

  const result = themeImportPayloadSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Payload theme không hợp lệ: " + result.error.issues.slice(0, 3)
        .map((issue) => `${issue.path.map(String).join(".") || "config"}: ${issue.message}`).join("; "),
    };
  }

  const { name, code, description, config } = result.data;
  return { success: true, data: { config, metadata: { name, code, description } } };
}
