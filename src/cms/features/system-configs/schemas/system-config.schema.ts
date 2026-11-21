import { z } from "zod";

import type { CreateSystemConfigInput, SystemConfig, SystemConfigFormValues, UpdateSystemConfigInput } from "../types";

const key = z.string().trim().min(1, "Khóa cấu hình không được để trống.");
const value = z.string().trim().min(1, "Giá trị cấu hình không được để trống.");

export const systemConfigCreateSchema = z.object({
  key,
  value,
  description: z.string().trim().optional(),
}).strict();

export const systemConfigPatchSchema = z.object({
  value: value.optional(),
  description: z.string().trim().optional(),
}).strict().refine((input) => Object.keys(input).length > 0, "Không có thay đổi để lưu.");

export const systemConfigFormSchema = z.object({ key, value, description: z.string() });

export function systemConfigToForm(config?: SystemConfig): SystemConfigFormValues {
  return { key: config?.key ?? "", value: config?.value ?? "", description: config?.description ?? "" };
}

export function formToSystemConfigCreate(values: SystemConfigFormValues): CreateSystemConfigInput {
  const description = values.description.trim();
  return { key: values.key.trim(), value: values.value.trim(), ...(description ? { description } : {}) };
}

export function formToSystemConfigPatch(values: SystemConfigFormValues, original: SystemConfig): UpdateSystemConfigInput {
  const patch: UpdateSystemConfigInput = {};
  const nextValue = values.value.trim();
  const nextDescription = values.description.trim();
  if (nextValue !== original.value) patch.value = nextValue;
  if (nextDescription !== (original.description ?? "")) patch.description = nextDescription;
  return patch;
}
