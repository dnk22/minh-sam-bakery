import type { ProductImage, ProductVariant } from "../types";

export { formatVnd } from "../../../lib/format-vnd.ts";

export function sortProductImages(images: readonly ProductImage[]) {
  return [...images].toSorted((left, right) => Number(right.isCover) - Number(left.isCover) || left.sortOrder - right.sortOrder || left.id.localeCompare(right.id));
}

export function sortProductVariants(variants: readonly ProductVariant[]) {
  return [...variants].toSorted((left, right) => left.sortOrder - right.sortOrder || left.sku.localeCompare(right.sku));
}
