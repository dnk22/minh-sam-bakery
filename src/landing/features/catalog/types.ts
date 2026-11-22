export type CatalogCategory = {
  id?: string;
  slug: string;
  name: string;
  description: string;
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
  pricing:
    | {
        mode: "fixed";
        amount: number;
        price: string;
        unit: string;
        variants: Array<{ id: string; label: string; amount: number; currency: "VND" }>;
      }
    | {
        mode: "quote";
        detail: string;
        icon: "calendar" | "palette" | "cake";
        quotationProfile: "corporate-gift" | "custom-event";
      };
};
import type {
  CategoryResponseDto,
  PaginationMetaDto,
  ProductResponseDto,
  PublicPostResponseDto,
} from "@/lib/api/types";


export type PublicFilterSortBy =
  | "name"
  | "sku"
  | "slug"
  | "price"
  | "salePrice"
  | "createdAt"
  | "updatedAt"
  | "isFeatured"
  | "isBestSeller";

export type PublicFilterRequest = {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: PublicFilterSortBy;
  sort?: "asc" | "desc";
};

export type PublicFilterSuggestionDto = {
  type: string;
  id: string;
  label: string;
  slug?: string | null;
};

export type PublicFilterResponseDto = {
  search?: string | null;
  products: ProductResponseDto[];
  pagination: PaginationMetaDto;
  categories: CategoryResponseDto[];
  posts: PublicPostResponseDto[];
  suggestions: PublicFilterSuggestionDto[];
};

export type CatalogPage = {
  search: string | null;
  products: CatalogProduct[];
  pagination: PaginationMetaDto;
};

export type StorefrontCategoryPage = {
  categories: CatalogCategory[];
  pagination: PaginationMetaDto;
};
