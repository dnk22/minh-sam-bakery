import { z } from "zod";

import type { Category, CategoryFormValues, CategoryWriteInput } from "../types";

const nullableText = z.string().trim().nullable().optional();
const imageUrl = z.string().trim().refine(value => {
  if (/[\x00-\x1f\x7f]/.test(value) || value.includes("\\")) return false;
  if (value.startsWith("/uploads/")) {
    try {
      const decoded = decodeURIComponent(value);
      return !decoded.includes("\\") && !decoded.split(/[/?#]/).includes("..") && !/[\x00-\x1f\x7f]/.test(decoded);
    } catch { return false; }
  }
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch { return false; }
}, "URL ảnh không hợp lệ.").nullable();

export const categoryWriteSchema = z.object({
  name: z.string().trim().min(1, "Tên danh mục không được để trống."),
  slug: z.string().trim().optional(),
  parentId: z.string().trim().nullable().optional(),
  description: nullableText,
  imageUrl: imageUrl.optional(),
  status: z.enum(["VISIBLE", "HIDDEN"]).optional(),
  sortOrder: z.number().finite().int().nonnegative().optional(),
  seoTitle: nullableText,
  seoDescription: nullableText,
}).strict();

export const categoryPatchSchema = categoryWriteSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "Không có thay đổi để lưu.",
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Tên danh mục không được để trống."),
  slug: z.string().trim(),
  parentId: z.string(),
  description: z.string(),
  imageUrl,
  status: z.enum(["VISIBLE", "HIDDEN"]),
  sortOrder: z.number().finite("Thứ tự phải là số.").int("Thứ tự phải là số nguyên.").nonnegative("Thứ tự không được âm."),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export function categoryToForm(category?: Category, parentId?: string | null): CategoryFormValues {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    parentId: category?.parentId ?? parentId ?? "",
    description: category?.description ?? "",
    imageUrl: category?.imageUrl?.trim() || null,
    status: category?.status ?? "VISIBLE",
    sortOrder: category?.sortOrder ?? 0,
    seoTitle: category?.seoTitle ?? "",
    seoDescription: category?.seoDescription ?? "",
  };
}

const nullable = (value: string) => value.trim() || null;

export function formToCreate(values: CategoryFormValues): CategoryWriteInput {
  return {
    name: values.name.trim(),
    ...(values.slug.trim() ? { slug: values.slug.trim() } : {}),
    parentId: values.parentId || null,
    description: nullable(values.description),
    imageUrl: values.imageUrl,
    status: values.status,
    sortOrder: values.sortOrder,
    seoTitle: nullable(values.seoTitle),
    seoDescription: nullable(values.seoDescription),
  };
}

export function formToPatch(values: CategoryFormValues, original: Category): Partial<CategoryWriteInput> {
  const next = formToCreate(values);
  const patch: Partial<CategoryWriteInput> = {};
  for (const key of Object.keys(next) as Array<keyof CategoryWriteInput>) {
    if (next[key] !== (key === "imageUrl" ? original[key] ?? null : original[key])) Object.assign(patch, { [key]: next[key] });
  }
  return patch;
}

export function vietnameseSlug(value: string) {
  return value.trim().toLocaleLowerCase("vi").replace(/đ/g, "d").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
