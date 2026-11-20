import { z } from "zod";

import type { Product, ProductFormValues, ProductWriteInput } from "../types";

const money = z.string().trim().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, "Nhập số tiền hợp lệ, tối đa 2 chữ số thập phân.");
const optionalText = z.string().trim().max(5000);

const imageSchema = z.object({
  url: z.string().trim().min(1), alt: z.string().trim().max(500).optional(), sortOrder: z.number().int().nonnegative(), isCover: z.boolean(),
}).strict();
const variantSchema = z.object({
  sku: z.string().trim().min(1, "SKU biến thể không được để trống."), size: z.string().trim().min(1, "Kích thước không được để trống."),
  style: z.string().trim().min(1, "Kiểu không được để trống."), price: money, salePrice: z.union([money, z.literal("")]),
  status: z.enum(["ACTIVE", "INACTIVE"]), sortOrder: z.number().int().nonnegative(),
}).strict();

const imageWriteSchema = z.object({ url: z.string().trim().min(1), alt: z.string().trim().max(500).optional(), sortOrder: z.number().int().nonnegative(), isCover: z.boolean() }).strict();
const variantWriteSchema = z.object({
  sku: z.string().trim().min(1), size: z.string().trim().min(1), style: z.string().trim().min(1), price: money,
  salePrice: z.union([money, z.null()]).optional(), status: z.enum(["ACTIVE", "INACTIVE"]), sortOrder: z.number().int().nonnegative(),
}).strict();
const productWriteBaseSchema = z.object({
  categoryId: z.string().trim().min(1), sku: z.string().trim().min(1), name: z.string().trim().min(1), slug: z.string().trim().optional(),
  shortDescription: optionalText.optional(), description: optionalText.optional(), price: money, salePrice: z.union([money, z.null()]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).optional(), isFeatured: z.boolean().optional(), isBestSeller: z.boolean().optional(),
  seoTitle: optionalText.optional(), seoDescription: optionalText.optional(), images: z.array(imageWriteSchema).max(20).optional(), variants: z.array(variantWriteSchema).max(100).optional(),
}).strict();
export const productWriteSchema = productWriteBaseSchema.superRefine((value, context) => {
  if (value.images?.length && value.images.filter((image) => image.isCover).length !== 1) context.addIssue({ code: "custom", path: ["images"], message: "Phải chọn đúng một ảnh bìa." });
});
export const productPatchSchema = productWriteBaseSchema.omit({ images: true, variants: true }).partial().refine((value) => Object.keys(value).length > 0, "Không có thay đổi để lưu.");

export const productFormSchema = z.object({
  categoryId: z.string().trim().min(1, "Hãy chọn danh mục."), sku: z.string().trim().min(1, "SKU không được để trống."),
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống."), slug: z.string().trim(),
  shortDescription: optionalText, description: optionalText, price: money, salePrice: z.union([money, z.literal("")]),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]), isFeatured: z.boolean(), isBestSeller: z.boolean(),
  seoTitle: optionalText, seoDescription: optionalText, images: z.array(imageSchema).max(20), variants: z.array(variantSchema).max(100),
}).superRefine((value, context) => {
  if (value.images.length && value.images.filter((image) => image.isCover).length !== 1) context.addIssue({ code: "custom", path: ["images"], message: "Phải chọn đúng một ảnh bìa." });
});

const nullable = (value: string) => value.trim() || undefined;
export function productToForm(product?: Product): ProductFormValues {
  return {
    categoryId: product?.categoryId ?? "", sku: product?.sku ?? "", name: product?.name ?? "", slug: product?.slug ?? "",
    shortDescription: product?.shortDescription ?? "", description: product?.description ?? "", price: product?.price ?? "", salePrice: product?.salePrice ?? "",
    status: product?.status ?? "DRAFT", isFeatured: product?.isFeatured ?? false, isBestSeller: product?.isBestSeller ?? false,
    seoTitle: product?.seoTitle ?? "", seoDescription: product?.seoDescription ?? "",
    images: product?.images.map(({ url, alt, sortOrder, isCover }) => ({ url, alt: alt ?? "", sortOrder, isCover })) ?? [],
    variants: product?.variants.map(({ sku, size, style, price, salePrice, status, sortOrder }) => ({ sku, size, style, price, salePrice: salePrice ?? "", status, sortOrder })) ?? [],
  };
}

export function formToCreate(values: ProductFormValues): ProductWriteInput {
  return {
    categoryId: values.categoryId, sku: values.sku.trim(), name: values.name.trim(), ...(nullable(values.slug) ? { slug: values.slug.trim() } : {}),
    ...(nullable(values.shortDescription) ? { shortDescription: values.shortDescription.trim() } : {}), ...(nullable(values.description) ? { description: values.description.trim() } : {}),
    price: values.price.trim(), salePrice: values.salePrice.trim() || null, status: values.status, isFeatured: values.isFeatured, isBestSeller: values.isBestSeller,
    ...(nullable(values.seoTitle) ? { seoTitle: values.seoTitle.trim() } : {}), ...(nullable(values.seoDescription) ? { seoDescription: values.seoDescription.trim() } : {}),
    ...(values.images.length ? { images: values.images.map((image, index) => ({ ...image, alt: image.alt?.trim() || undefined, sortOrder: index })) } : {}),
    ...(values.variants.length ? { variants: values.variants.map((variant, index) => ({ ...variant, sku: variant.sku.trim(), size: variant.size.trim(), style: variant.style.trim(), price: variant.price.trim(), salePrice: variant.salePrice.trim() || null, sortOrder: index })) } : {}),
  };
}

export function formToPatch(values: ProductFormValues, original: Product): Partial<ProductWriteInput> {
  const patch: Partial<ProductWriteInput> = {};
  const requiredText = { categoryId: values.categoryId.trim(), sku: values.sku.trim(), name: values.name.trim(), price: values.price.trim() };
  for (const key of Object.keys(requiredText) as Array<keyof typeof requiredText>) {
    if (requiredText[key] !== original[key]) Object.assign(patch, { [key]: requiredText[key] });
  }
  if (values.slug.trim() && values.slug.trim() !== original.slug) patch.slug = values.slug.trim();
  const optionalText = { shortDescription: values.shortDescription.trim(), description: values.description.trim(), seoTitle: values.seoTitle.trim(), seoDescription: values.seoDescription.trim() };
  for (const key of Object.keys(optionalText) as Array<keyof typeof optionalText>) {
    if (optionalText[key] !== (original[key] ?? "")) Object.assign(patch, { [key]: optionalText[key] });
  }
  const salePrice = values.salePrice.trim() || null;
  if (salePrice !== (original.salePrice ?? null)) patch.salePrice = salePrice;
  if (values.status !== original.status) patch.status = values.status;
  if (values.isFeatured !== original.isFeatured) patch.isFeatured = values.isFeatured;
  if (values.isBestSeller !== original.isBestSeller) patch.isBestSeller = values.isBestSeller;
  return patch;
}

export function vietnameseProductSlug(value: string) {
  return value.trim().toLocaleLowerCase("vi").replace(/đ/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
