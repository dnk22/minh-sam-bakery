import type { ProductFormValues, ProductImageInput, ProductVariantInput } from "../types";

export const MAX_PRODUCT_IMAGES = 20;
export const MAX_PRODUCT_VARIANTS = 100;

export function serializeImages(images: ProductFormValues["images"]): ProductImageInput[] {
  return images.map((image, index) => ({ url: image.url.trim(), alt: image.alt?.trim() || "", isCover: image.isCover, sortOrder: index }));
}

export function serializeVariants(variants: ProductFormValues["variants"]): ProductVariantInput[] {
  return variants.map((variant, index) => ({ sku: variant.sku.trim(), size: variant.size.trim(), style: variant.style.trim(), price: variant.price.trim(), salePrice: variant.salePrice.trim() || null, status: variant.status, sortOrder: index }));
}

export function normalizeImageOrder(images: ProductFormValues["images"]) {
  const hasCover = images.some(image => image.isCover);
  return images.map((image, index) => ({ ...image, sortOrder: index, isCover: hasCover ? image.isCover : index === 0 }));
}
