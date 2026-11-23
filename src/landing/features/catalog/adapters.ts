import type { CategoryResponseDto, ProductResponseDto, ProductVariantResponseDto } from "@/lib/api/types";
import { backendAssetUrl } from "@/lib/api/client";

import { breakDownPrice, formatVnd } from "./pricing";
import type { CatalogCategory, CatalogProduct, CatalogVariant } from "./types";

export { effectivePrice, formatVnd, parseBackendPrice } from "./pricing";

const FALLBACK_IMAGE = "/images/catalog/product-placeholder.svg";

export function adaptCategory(dto: CategoryResponseDto): CatalogCategory {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    description: dto.description ?? "",
    seoTitle: dto.seoTitle ?? undefined,
    seoDescription: dto.seoDescription ?? undefined,
    image: backendAssetUrl(dto.imageUrl) ?? FALLBACK_IMAGE,
    imageAlt: dto.name,
    badge: "Minh Sâm Bakery",
    badgeClassName: "left-2.5 bg-primary text-on-primary",
    number: String(dto.sortOrder).padStart(2, "0"),
    label: "Danh mục sản phẩm",
  };
}

export function adaptProduct(dto: ProductResponseDto): CatalogProduct {
  const images = [...dto.images].sort((a, b) => Number(b.isCover) - Number(a.isCover) || a.sortOrder - b.sortOrder);
  const cover = images[0];
  const basePrice = breakDownPrice(dto.price, dto.salePrice, "product price");
  const activeVariants = dto.variants
    .filter((variant) => variant.status === "ACTIVE")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const variants: CatalogVariant[] = activeVariants.length
    ? activeVariants.map(adaptVariant)
    : dto.variants.length === 0
      ? [baseVariant(dto, basePrice)]
      : [];
  // Do not invent a purchasable default for products with only INACTIVE variants.
  const cheapest = variants.length
    ? variants.reduce((current, variant) => variant.effectivePrice < current.effectivePrice ? variant : current)
    : basePrice;
  const isFrom = variants.length > 1 && new Set(variants.map((variant) => variant.effectivePrice)).size > 1;

  return {
    id: dto.id,
    slug: dto.slug,
    status: "published",
    categorySlug: dto.categorySlug,
    categorySlugs: [dto.categorySlug],
    name: dto.name,
    description: dto.shortDescription ?? dto.description ?? "",
    image: backendAssetUrl(cover?.url) ?? FALLBACK_IMAGE,
    imageAlt: cover?.alt ?? dto.name,
    sku: dto.sku,
    isFeatured: dto.isFeatured,
    isBestSeller: dto.isBestSeller,
    badge: dto.isBestSeller ? "Bán chạy" : dto.isFeatured ? "Nổi bật" : undefined,
    badgeClassName: "bg-secondary text-on-secondary",
    pricing: {
      originalPrice: cheapest.originalPrice,
      salePrice: cheapest.salePrice,
      effectivePrice: cheapest.effectivePrice,
      hasDiscount: cheapest.hasDiscount,
      discountPercent: cheapest.discountPercent,
      amount: cheapest.effectivePrice,
      price: formatVnd(cheapest.effectivePrice),
      unit: isFrom ? "Giá từ" : "Giá bán",
      isFrom,
      available: variants.length > 0,
      variants,
    },
  };
}

function baseVariant(
  dto: ProductResponseDto,
  prices: ReturnType<typeof breakDownPrice>,
): CatalogVariant {
  return {
    id: `base-${dto.id}`,
    label: "Tiêu chuẩn",
    amount: prices.effectivePrice,
    ...prices,
    currency: "VND",
    isSynthetic: true,
  };
}

export function adaptVariant(variant: ProductVariantResponseDto): CatalogVariant {
  const parts = [variant.size, variant.style].filter(Boolean);
  const prices = breakDownPrice(variant.price, variant.salePrice, `variant ${variant.id}`);
  return {
    id: variant.id,
    label: parts.join(" • ") || "Tiêu chuẩn",
    amount: prices.effectivePrice,
    ...prices,
    currency: "VND",
    isSynthetic: false,
  };
}
