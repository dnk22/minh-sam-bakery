"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { systemConfigFormSchema, systemConfigToForm } from "../schemas/system-config.schema";
import type { SystemConfig, SystemConfigFormValues, SystemConfigModalState } from "../types";

export function useSystemConfigForm({ state, config }: { state: SystemConfigModalState; config?: SystemConfig }) {
  const source = useRef<string | null>(null);
  const form = useForm<SystemConfigFormValues>({ resolver: zodResolver(systemConfigFormSchema), defaultValues: systemConfigToForm() });
  const mode = state?.mode ?? "detail";
  const id = state && "id" in state ? state.id : "";
  const key = state ? `${mode}:${id}:${config?.updatedAt ?? "new"}` : "closed";
  useEffect(() => {
    if (!state) { source.current = null; return; }
    if (mode === "detail" || (mode === "edit" && !config)) return;
    if (source.current === key) return;
    const sameSession = source.current?.startsWith(`${mode}:${id}:`) ?? false;
    source.current = key;
    if (sameSession && form.formState.isDirty) return;
    form.reset(systemConfigToForm(mode === "edit" ? config : undefined));
  }, [config, form, id, key, mode, state]);
  return form;
}
