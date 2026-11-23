import type { CategoryResponseDto, ProductResponseDto, ProductVariantResponseDto } from "@/lib/api/types";
import { backendAssetUrl } from "@/lib/api/client";

import type { CatalogCategory, CatalogProduct } from "./types";

const FALLBACK_IMAGE = "/images/catalog/product-placeholder.svg";

export function parseBackendPrice(value: string, field = "price") {
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) throw new Error(`Invalid ${field}: ${value}`);
  const [whole, fraction = ""] = value.split(".");
  const hundred = BigInt(100);
  const cents = BigInt(whole) * hundred + BigInt(fraction.padEnd(2, "0"));
  if (cents < BigInt(0) || cents > BigInt(Number.MAX_SAFE_INTEGER) * hundred) throw new Error(`${field} is outside the supported range`);
  return Number(cents) / 100;
}

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
  const basePrice = effectivePrice(dto.price, dto.salePrice, "product price");
  const activeVariants = dto.variants.filter((variant) => variant.status === "ACTIVE").sort((a, b) => a.sortOrder - b.sortOrder);
  const variants = activeVariants.length ? activeVariants.map(adaptVariant) : [baseVariant(dto, basePrice)];
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
      amount: basePrice,
      price: formatVnd(basePrice),
      unit: variants.length > 1 ? `Từ ${formatVnd(Math.min(...variants.map((variant) => variant.amount)))}` : "Giá niêm yết",
      variants,
    },
  };
}

export function effectivePrice(price: string, salePrice: string | null | undefined, field: string) {
  const regular = parseBackendPrice(price, field);
  if (salePrice == null) return regular;
  return parseBackendPrice(salePrice, `${field} salePrice`);
}

function baseVariant(dto: ProductResponseDto, amount: number) {
  return { id: `base-${dto.id}`, label: "Tiêu chuẩn", amount, currency: "VND" as const };
}

export function adaptVariant(variant: ProductVariantResponseDto) {
  const parts = [variant.size, variant.style].filter(Boolean);
  return {
    id: variant.id,
    label: parts.join(" • ") || "Tiêu chuẩn",
    amount: effectivePrice(variant.price, variant.salePrice, `variant ${variant.id}`),
    currency: "VND" as const,
  };
}

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);
}
