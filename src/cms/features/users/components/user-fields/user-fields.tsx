"use client";

import type { UseFormReturn } from "react-hook-form";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsFormCombobox } from "@/cms/components/ui/combobox/combobox";
import { useRoleSelector } from "@/cms/features/roles/hooks/use-roles";

import type { UserFormValues } from "../../types";
import styles from "./user-fields.module.css";

export function UserFields({ form, mode }: { form: UseFormReturn<UserFormValues>; mode: "create" | "edit" }) {
  const { register, formState: { errors } } = form;
  const roles = useRoleSelector(mode === "create");
  const roleOptions = [
    { value: "", label: roles.isLoading ? "Đang tải vai trò…" : roles.error ? "Không thể tải vai trò" : roles.data?.length ? "Chọn vai trò" : "Chưa có vai trò" },
    ...(roles.data ?? []).map((role) => ({ value: role.id, label: `${role.name} (${role.code})` })),
  ];
  return <div className={styles.fields}>
    <CmsFormField error={errors.email?.message} htmlFor="user-email" label="Email" required>
      <CmsInput autoComplete="email" id="user-email" required type="email" {...register("email")} />
    </CmsFormField>
    <CmsFormField error={errors.fullName?.message} htmlFor="user-full-name" label="Họ tên" required>
      <CmsInput autoComplete="name" id="user-full-name" required {...register("fullName")} />
    </CmsFormField>
    <CmsFormField
      description={mode === "edit" ? "Để trống nếu không thay đổi mật khẩu." : "Sử dụng mật khẩu đủ mạnh và khó đoán."}
      error={errors.password?.message}
      htmlFor="user-password"
      label={mode === "create" ? "Mật khẩu" : "Mật khẩu mới"}
      required={mode === "create"}
    >
      <CmsInput autoComplete="new-password" id="user-password" required={mode === "create"} type="password" {...register("password")} />
    </CmsFormField>
    {mode === "create" ? <CmsFormField
      description={roles.error ? <span>Không thể tải danh sách vai trò. <CmsButton type="button" size="sm" variant="ghost" onClick={() => roles.refetch()}>Thử lại</CmsButton></span> : undefined}
      error={errors.roleId?.message}
      htmlFor="user-role"
      label="Vai trò"
      required
    >
      <CmsFormCombobox disabled={roles.isLoading || Boolean(roles.error) || roles.data?.length === 0} id="user-role" options={roleOptions} required control={form.control} name="roleId" />
    </CmsFormField> : null}
  </div>;
}
