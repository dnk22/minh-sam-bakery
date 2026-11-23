import type { PaginationMetaDto } from "@/lib/api/types";

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
  pricing: {
    amount: number;
    price: string;
    unit: string;
    variants: Array<{ id: string; label: string; amount: number; currency: "VND" }>;
  };
};

export type CatalogPage = {
  search: string | null;
  products: CatalogProduct[];
  pagination: PaginationMetaDto;
};
