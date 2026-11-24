import type { Product, ProductFormValues, ProductWriteInput } from "../types";
import { serializeImages, serializeVariants } from "./product-collection-utils";

const nullable = (value: string) => value.trim() || undefined;
export function productToForm(product?: Product): ProductFormValues {
  return {
    categoryId: product?.categoryId ?? "", sku: product?.sku ?? "", name: product?.name ?? "", slug: product?.slug ?? "",
    shortDescription: product?.shortDescription ?? "", description: product?.description ?? "", price: product?.price ?? "", salePrice: product?.salePrice ?? "",
    status: product?.status ?? "DRAFT", isFeatured: product?.isFeatured ?? false, isBestSeller: product?.isBestSeller ?? false,
    seoTitle: product?.seoTitle ?? "", seoDescription: product?.seoDescription ?? "",
    images: product?.images.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(({ url, alt, sortOrder, isCover }) => ({ url, alt: alt ?? "", sortOrder, isCover })) ?? [],
    variants: product?.variants.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(({ sku, size, style, price, salePrice, status, sortOrder }) => ({ sku, size, style, price, salePrice: salePrice ?? "", status, sortOrder })) ?? [],
  };
}

export function formToCreate(values: ProductFormValues): ProductWriteInput {
  return {
    categoryId: values.categoryId, sku: values.sku.trim(), name: values.name.trim(), ...(nullable(values.slug) ? { slug: values.slug.trim() } : {}),
    ...(nullable(values.shortDescription) ? { shortDescription: values.shortDescription.trim() } : {}), ...(nullable(values.description) ? { description: values.description.trim() } : {}),
    price: values.price.trim(), salePrice: values.salePrice.trim() || null, status: values.status, isFeatured: values.isFeatured, isBestSeller: values.isBestSeller,
    ...(nullable(values.seoTitle) ? { seoTitle: values.seoTitle.trim() } : {}), ...(nullable(values.seoDescription) ? { seoDescription: values.seoDescription.trim() } : {}),
    ...(values.images.length ? { images: serializeImages(values.images) } : {}),
    ...(values.variants.length ? { variants: serializeVariants(values.variants) } : {}),
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
  const before = productToForm(original);
  const images = serializeImages(values.images);
  const variants = serializeVariants(values.variants);
  if (JSON.stringify(images) !== JSON.stringify(serializeImages(before.images))) patch.images = images;
  if (JSON.stringify(variants) !== JSON.stringify(serializeVariants(before.variants))) patch.variants = variants;
  return patch;
}

export function vietnameseProductSlug(value: string) {
  return value.trim().toLocaleLowerCase("vi").replace(/đ/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
