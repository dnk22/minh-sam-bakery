import { z } from "zod";

import type { CreateRoleInput, Role, RoleFormValues, UpdateRoleInput } from "../types";

const requiredText = (label: string) => z.string().trim().min(1, `${label} không được để trống.`);

export const roleCreateSchema = z.object({
  code: requiredText("Mã vai trò"),
  name: requiredText("Tên vai trò"),
  description: z.string().trim().optional(),
  permissionIds: z.array(z.string().trim().min(1)).optional(),
}).strict();

export const rolePatchSchema = z.object({
  code: requiredText("Mã vai trò").optional(),
  name: requiredText("Tên vai trò").optional(),
  description: z.string().trim().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: "Không có thay đổi để lưu." });

export const assignPermissionsSchema = z.object({ permissionIds: z.array(z.string().trim().min(1)) }).strict();

export const roleFormSchema = z.object({
  code: requiredText("Mã vai trò"),
  name: requiredText("Tên vai trò"),
  description: z.string(),
});

export function roleToForm(role?: Role): RoleFormValues {
  return { code: role?.code ?? "", name: role?.name ?? "", description: role?.description ?? "" };
}

export function formToCreate(values: RoleFormValues, permissionIds: readonly string[]): CreateRoleInput {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    ...(values.description.trim() ? { description: values.description.trim() } : {}),
    ...(permissionIds.length ? { permissionIds: [...permissionIds] } : {}),
  };
}

export function formToPatch(values: RoleFormValues, original: Role): UpdateRoleInput {
  const next = { code: values.code.trim(), name: values.name.trim(), description: values.description.trim() };
  const patch: UpdateRoleInput = {};
  if (next.code !== original.code) patch.code = next.code;
  if (next.name !== original.name) patch.name = next.name;
  if (next.description !== (original.description ?? "")) patch.description = next.description;
  return patch;
}
