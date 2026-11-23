"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { themeCodeFromName } from "../lib/theme-format";
import { themeFormSchema, themeToForm } from "../schemas/theme.schema";
import type { CmsTheme, ThemeFormValues, ThemeModalState } from "../types";

export function useThemeForm({ state, theme }: { state: ThemeModalState; theme?: CmsTheme }) {
  const session = useRef<{ key: string; version: string } | null>(null);
  const codeManual = useRef(false);
  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: themeToForm(),
  });
  const mode = state?.mode;
  const key = state ? mode + ":" + ("id" in state ? state.id : "") : "closed";
  const version = theme?.updatedAt ?? "new";

  // React Hook Form's watch is intentionally mutable for form observation.
  // eslint-disable-next-line react-hooks/incompatible-library
  const name = form.watch("name");

  useEffect(() => {
    if (!state) { session.current = null; return; }
    if (mode === "detail" || (mode !== "create" && !theme)) return;
    const changed = session.current?.key !== key;
    const sourceChanged = session.current?.version !== version;
    if (!changed && !sourceChanged) return;
    session.current = { key, version };
    if (!changed && form.formState.isDirty) return;
    codeManual.current = mode !== "create";
    form.reset(themeToForm(mode === "create" ? undefined : theme, mode === "duplicate"));
  }, [form, key, mode, state, theme, version]);

  useEffect(() => {
    if (mode === "create" && !codeManual.current) {
      form.setValue("code", themeCodeFromName(name), { shouldValidate: false });
    }
  }, [form, mode, name]);

  return { form, markCodeManual: () => { codeManual.current = true; } };
}
