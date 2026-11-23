import type { CatalogProduct, CatalogVariant } from "../catalog/types.ts";
import type { CartLine } from "./types.ts";

export function cartLineKey(productId: string, variantId: string | null): string {
  return JSON.stringify([productId, variantId]);
}

export function createCartLine(
  product: CatalogProduct,
  variant: CatalogVariant,
  quantity: number,
): CartLine {
  if (!product.pricing.available) throw new Error("Product has no purchasable variant");
  if (!product.pricing.variants.some((candidate) => candidate.id === variant.id)) throw new Error("Variant is not available on this product");
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("Invalid quantity");
  // Synthetic base-* IDs are FE-only and must never be submitted to the order API.
  const variantId = variant.isSynthetic ? null : variant.id;
  return {
    key: cartLineKey(product.id, variantId),
    productId: product.id,
    categorySlug: product.categorySlug,
    productSlug: product.slug,
    productName: product.name,
    productImage: product.image,
    productImageAlt: product.imageAlt,
    variantId,
    variantLabel: variant.label,
    availableVariants: product.pricing.variants.map((option) => ({
      id: option.isSynthetic ? null : option.id,
      label: option.label,
      originalPrice: option.originalPrice,
      effectivePrice: option.effectivePrice,
    })),
    originalPrice: variant.originalPrice,
    effectivePrice: variant.effectivePrice,
    quantity,
    selected: true,
  };
}
