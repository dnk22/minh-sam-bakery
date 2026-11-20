"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { roleFormSchema, roleToForm } from "../schemas/role.schema";
import type { Role, RoleFormValues, RoleModalState } from "../types";

export function useRoleForm({ state, role }: { state: RoleModalState; role?: Role }) {
  const source = useRef<string | null>(null);
  const form = useForm<RoleFormValues>({ resolver: zodResolver(roleFormSchema), defaultValues: roleToForm() });
  const mode = state?.mode ?? "detail";
  const key = state ? `${mode}:${state.id ?? ""}:${role?.updatedAt ?? "new"}` : "closed";

  useEffect(() => {
    if (!state) { source.current = null; return; }
    if (mode === "detail" || (mode === "edit" && !role)) return;
    if (source.current === key) return;
    const sameSession = source.current?.startsWith(`${mode}:${state.id ?? ""}:`) ?? false;
    source.current = key;
    if (sameSession && form.formState.isDirty) return;
    form.reset(roleToForm(mode === "edit" ? role : undefined));
  }, [form, key, mode, role, state]);

  return form;
}
