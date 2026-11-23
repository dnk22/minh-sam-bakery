import { z } from "zod";

import { themeConfigV1Schema } from "../../../../theme/contracts/theme-config.schema.ts";
import { createClassicThemeConfig } from "../../../../theme/presets/classic.ts";
import { parseThemeConfig } from "../../../../theme/contracts/theme-config.schema.ts";
import { themeCodeFromName } from "../lib/theme-format.ts";
import type { CmsTheme, ThemeCreateInput, ThemeFormValues, ThemePatchInput } from "../types.ts";

const name = z.string().trim().min(1, "Tên theme không được để trống.").max(120, "Tên theme tối đa 120 ký tự.");
const code = z.string().trim().min(1, "Mã theme không được để trống.").max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Mã chỉ dùng chữ thường, số và dấu gạch ngang.");
const description = z.string().trim().max(1000, "Mô tả tối đa 1.000 ký tự.");

export const themeFormSchema = z.object({
  name,
  code,
  description,
  config: themeConfigV1Schema,
}).strict();

export const themeCreateSchema = z.object({
  name,
  code,
  description: description.optional(),
  config: themeConfigV1Schema,
  isActive: z.literal(false).optional(),
}).strict();

export const themePatchSchema = z.object({
  name: name.optional(),
  code: code.optional(),
  description: description.optional(),
  config: themeConfigV1Schema.optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: "Không có thay đổi để lưu.",
});

export function themeToForm(theme?: CmsTheme, duplicate = false): ThemeFormValues {
  const parsed = theme ? parseThemeConfig(theme.config) : null;
  const sourceConfig = parsed?.success ? parsed.data : createClassicThemeConfig();
  return {
    name: theme ? duplicate ? theme.name + " - Bản sao" : theme.name : "",
    code: theme ? duplicate ? theme.code + "-copy" : theme.code : "",
    description: typeof theme?.description === "string" ? theme.description : "",
    config: structuredClone(sourceConfig),
  };
}

export function formToThemeCreate(form: ThemeFormValues): ThemeCreateInput {
  return {
    name: form.name.trim(),
    code: form.code.trim(),
    description: form.description.trim(),
    config: themeConfigV1Schema.parse(form.config),
    isActive: false,
  };
}

export function formToThemePatch(form: ThemeFormValues, previous: CmsTheme): ThemePatchInput {
  const normalized = themeFormSchema.parse(form);
  const patch: ThemePatchInput = {};
  if (normalized.name !== previous.name) patch.name = normalized.name;
  if (normalized.code !== previous.code) patch.code = normalized.code;
  if (normalized.description !== (previous.description ?? "")) patch.description = normalized.description;
  const originalConfig = parseThemeConfig(previous.config);
  if (!originalConfig.success) throw new Error("Theme cũ không thuộc V1; không thể cập nhật an toàn.");
  if (JSON.stringify(normalized.config) !== JSON.stringify(originalConfig.data)) patch.config = normalized.config;
  return patch;
}

// New themes always start inactive; active-state mutations belong to Phase 4.
export function isSafeThemeCreate(value: unknown) {
  return themeCreateSchema.safeParse(value).success;
}
