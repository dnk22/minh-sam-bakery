"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import { productFormSchema, productToForm, vietnameseProductSlug } from "../schemas/product.schema";
import type { Product, ProductFormValues, ProductModalState } from "../types";

export function useProductForm({ state, product }: { state: ProductModalState; product?: Product }) {
  const mode = state?.mode ?? "detail";
  const source = useRef<{ session: string; version: string } | null>(null);
  const slugManual = useRef(false);
  const form = useForm<ProductFormValues>({ resolver: zodResolver(productFormSchema), defaultValues: productToForm() });
  // React Hook Form exposes intentionally mutable observation methods.
  // eslint-disable-next-line react-hooks/incompatible-library
  const name = form.watch("name");
  const session = useMemo(() => state ? `${state.mode}:${"id" in state ? state.id : "new"}` : "closed", [state]);
  const version = product?.updatedAt ?? "new";
  useEffect(() => {
    if (!state) { source.current = null; return; }
    if (mode === "detail" || (mode === "edit" && !product)) return;
    const sessionChanged = source.current?.session !== session;
    const versionChanged = source.current?.version !== version;
    if (!sessionChanged && !versionChanged) return;
    source.current = { session, version };
    if (!sessionChanged && form.formState.isDirty) return;
    slugManual.current = mode === "edit";
    form.reset(productToForm(mode === "edit" ? product : undefined));
  }, [form, mode, product, session, state, version]);
  useEffect(() => { if (mode === "create" && !slugManual.current) form.setValue("slug", vietnameseProductSlug(name), { shouldValidate: false }); }, [form, mode, name]);
  return { form, markSlugManual: () => { slugManual.current = true; } };
}
