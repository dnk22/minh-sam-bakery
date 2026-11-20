"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import { createUserFormSchema, userFormSchema, userToForm } from "../schemas/user.schema";
import type { CmsUser, UserFormValues, UserModalState } from "../types";

export function useUserForm({ state, user }: { state: UserModalState; user?: CmsUser }) {
  const source = useRef<string | null>(null);
  const mode = state?.mode ?? "detail";
  const form = useForm<UserFormValues>({ resolver: zodResolver(mode === "create" ? createUserFormSchema : userFormSchema), defaultValues: userToForm() });
  const sessionKey = useMemo(() => state ? `${mode}:${state.id ?? "new"}` : "closed", [mode, state]);
  const sourceVersion = user?.updatedAt ?? "new";

  useEffect(() => {
    if (!state) { source.current = null; return; }
    if (mode === "detail" || (mode === "edit" && !user)) return;
    const nextSource = `${sessionKey}:${sourceVersion}`;
    if (source.current === nextSource) return;
    const sameSession = source.current?.startsWith(`${sessionKey}:`) ?? false;
    source.current = nextSource;
    if (sameSession && form.formState.isDirty) return;
    form.reset(userToForm(mode === "edit" ? user : undefined));
  }, [form, mode, sessionKey, sourceVersion, state, user]);

  return form;
}
