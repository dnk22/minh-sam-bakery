"use client";

import { useEffect, useRef, useState } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { uploadCmsImages } from "@/cms/lib/api/uploads.client";
import { validateImageUploadBatch } from "@/cms/lib/api/upload-validation";
import { MAX_PRODUCT_IMAGES, normalizeImageOrder } from "../lib/product-collection-utils";
import type { ProductFormValues } from "../types";

export function useProductImages(form: UseFormReturn<ProductFormValues>, onPendingChange?: (pending: boolean) => void) {
  const images = useWatch({ control: form.control, name: "images" });
  const [pending, setPending] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  const commit = (next: ProductFormValues["images"]) => form.setValue("images", normalizeImageOrder(next), { shouldDirty: true, shouldValidate: true });
  const select = (files: File[]) => {
    if (request.current) return;
    const issue = validateImageUploadBatch(files) ?? (form.getValues("images").length + files.length > MAX_PRODUCT_IMAGES ? "Tối đa 20 ảnh cho mỗi sản phẩm." : null);
    setError(issue);
    if (issue) return;
    setPending(files);
    onPendingChange?.(files.length > 0);
  };
  const cancel = () => {
    if (request.current) return;
    setPending([]); setError(null); onPendingChange?.(false);
  };
  const upload = async () => {
    if (!pending.length || request.current) return;
    if (form.getValues("images").length + pending.length > MAX_PRODUCT_IMAGES) { setError("Tối đa 20 ảnh cho mỗi sản phẩm."); return; }
    const controller = new AbortController();
    request.current = controller;
    setUploading(true); setError(null);
    try {
      const urls = await uploadCmsImages(pending, "products", controller.signal);
      if (controller.signal.aborted) return;
      const current = form.getValues("images");
      if (current.length + urls.length > MAX_PRODUCT_IMAGES) throw new Error("Tối đa 20 ảnh cho mỗi sản phẩm.");
      commit([...current, ...urls.map(url => ({ url, alt: "", isCover: false, sortOrder: 0 }))]);
      setPending([]); onPendingChange?.(false);
    } catch (caught) {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Không thể tải ảnh lên.");
    } finally {
      if (request.current === controller) { request.current = null; setUploading(false); }
    }
  };
  const update = (index: number, patch: Partial<ProductFormValues["images"][number]>) => {
    if (!request.current) commit(form.getValues("images").map((item, i) => i === index ? { ...item, ...patch } : item));
  };
  const cover = (index: number) => {
    if (!request.current) commit(form.getValues("images").map((item, i) => ({ ...item, isCover: i === index })));
  };
  const move = (index: number, direction: -1 | 1) => {
    if (request.current) return;
    const next = [...form.getValues("images")];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };
  const remove = (index: number) => {
    if (!request.current) commit(form.getValues("images").filter((_, i) => i !== index));
  };
  return { images, pending, uploading, error, select, cancel, upload, update, cover, move, remove };
}
