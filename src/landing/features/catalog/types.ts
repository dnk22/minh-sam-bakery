import type { PaginationMetaDto } from "@/lib/api/types";
import type { PriceBreakdown } from "./pricing";

export type CatalogCategory = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeClassName: string;
  number: string;
  label: string;
};

export type CatalogVariant = PriceBreakdown & {
  id: string;
  label: string;
  amount: number;
  currency: "VND";
  isSynthetic: boolean;
};

export type CatalogPricing = PriceBreakdown & {
  amount: number;
  price: string;
  unit: string;
  isFrom: boolean;
  available: boolean;
  variants: CatalogVariant[];
};

export type CatalogProduct = {
  id: string;
  slug: string;
  status: "published" | "draft";
  categorySlug: string;
  categorySlugs: string[];
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  sku?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  badgeClassName?: string;
  pricing: CatalogPricing;
};

export type CatalogPage = {
  search: string | null;
  products: CatalogProduct[];
  pagination: PaginationMetaDto;
};
