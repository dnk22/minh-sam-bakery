import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Email không được để trống.")
    .max(254, "Email không đúng định dạng.")
    .email("Email không đúng định dạng."),
  password: z.string()
    .min(1, "Mật khẩu không được để trống.")
    .max(512, "Mật khẩu không hợp lệ."),
});

export type LoginFormValues = z.input<typeof loginSchema>;
export type LoginCredentials = z.output<typeof loginSchema>;

export const defaultLoginValues: LoginFormValues = {
  email: "",
  password: "",
};

export function parseLoginInput(value: unknown):
  | { ok: true; data: LoginCredentials }
  | { ok: false; fields: { email?: string; password?: string } } {
  const result = loginSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };

  const fields: { email?: string; password?: string } = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0];
    if ((field === "email" || field === "password") && !fields[field]) fields[field] = issue.message;
  });
  if (!fields.email && !fields.password) {
    return { ok: false, fields: { email: "Email không được để trống.", password: "Mật khẩu không được để trống." } };
  }
  return { ok: false, fields };
}
