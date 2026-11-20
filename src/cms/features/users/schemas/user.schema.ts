import { z } from "zod";

import type { CmsUser, CreateUserInput, UpdateUserInput, UserFormValues } from "../types";

const email = z.string().trim().min(1, "Email không được để trống.").email("Email không đúng định dạng.");
const requiredText = (label: string) => z.string().trim().min(1, `${label} không được để trống.`);

export const createUserSchema = z.object({
  email,
  password: z.string().min(1, "Mật khẩu không được để trống."),
  fullName: requiredText("Họ tên"),
  roleId: requiredText("Vai trò"),
}).strict();

export const updateUserSchema = z.object({
  email: email.optional(),
  password: z.string().min(1, "Mật khẩu mới không được để trống.").optional(),
  fullName: requiredText("Họ tên").optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: "Không có thay đổi để lưu." });

export const assignUserRoleSchema = z.object({ roleId: requiredText("Vai trò") }).strict();

export const userFormSchema = z.object({
  email,
  fullName: requiredText("Họ tên"),
  password: z.string(),
  roleId: z.string(),
});

export const createUserFormSchema = userFormSchema.extend({
  password: z.string().min(1, "Mật khẩu không được để trống."),
  roleId: requiredText("Vai trò"),
});

export function userToForm(user?: CmsUser): UserFormValues {
  return { email: user?.email ?? "", fullName: user?.fullName ?? "", password: "", roleId: user?.role.id ?? "" };
}

export function formToCreate(values: UserFormValues): CreateUserInput {
  return { email: values.email.trim(), fullName: values.fullName.trim(), password: values.password, roleId: values.roleId };
}

export function formToPatch(values: UserFormValues, original: CmsUser): UpdateUserInput {
  const patch: UpdateUserInput = {};
  const nextEmail = values.email.trim();
  const nextName = values.fullName.trim();
  if (nextEmail !== original.email) patch.email = nextEmail;
  if (nextName !== original.fullName) patch.fullName = nextName;
  if (values.password.length > 0) patch.password = values.password;
  return patch;
}
