"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  categoryFormSchema,
  categoryToForm,
  vietnameseSlug,
} from "../schemas/category.schema";
import type { Category, CategoryFormValues, CategoryModalState } from "../types";

type FormSource = {
  sessionKey: string;
  version: string;
};

export function useCategoryForm({
  state,
  category,
}: {
  state: CategoryModalState;
  category?: Category;
}) {
  const mode = state?.mode ?? "detail";
  const slugManual = useRef(false);
  const source = useRef<FormSource | null>(null);
  const [uploadPending, setUploadPending] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: categoryToForm(undefined, state?.parentId),
  });
  // React Hook Form exposes intentionally mutable observation methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const name = form.watch("name");
  const sessionKey = useMemo(
    () =>
      state
        ? `${state.mode}:${state.id ?? ""}:${state.parentId ?? ""}`
        : "closed",
    [state],
  );
  const sourceVersion = category?.updatedAt ?? "new";

  useEffect(() => {
    if (!state) {
      source.current = null;
      return;
    }
    if (mode === "detail" || (mode === "edit" && !category)) return;

    const sessionChanged = source.current?.sessionKey !== sessionKey;
    const sourceChanged = source.current?.version !== sourceVersion;
    if (!sessionChanged && !sourceChanged) return;

    source.current = { sessionKey, version: sourceVersion };
    if (!sessionChanged && form.formState.isDirty) return;

    slugManual.current = mode === "edit";
    // A new form session must not inherit unfinished upload state.
    setUploadPending(false);
    form.reset(
      categoryToForm(mode === "edit" ? category : undefined, state.parentId),
    );
  }, [category, form, mode, sessionKey, sourceVersion, state]);

  useEffect(() => {
    if (mode === "create" && !slugManual.current) {
      form.setValue("slug", vietnameseSlug(name), { shouldValidate: false });
    }
  }, [form, mode, name]);

  return {
    form,
    uploadPending,
    setUploadPending,
    markSlugManual: () => {
      slugManual.current = true;
    },
  };
}
