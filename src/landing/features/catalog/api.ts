import "server-only";

import { apiGet } from "@/lib/api/client";
import { backendRequest } from "@/lib/api/backend-client";
import type {
  CategoryResponseDto,
  PaginatedResponse,
  ProductResponseDto,
} from "@/lib/api/types";
import type { PublicFilterRequest } from "./types";
import { isCategory, isPaginated, isProduct, isPublicFilterResponse, normalizePublicFilterRequest } from "./public-filter-data";

const PAGE_LIMIT = 100;
const MAX_PAGES = 20;

export async function fetchCategories() {
  const categories = await fetchAllPages<CategoryResponseDto>(
    "/api/v1/public/categories",
    isCategory,
    "catalog-categories",
  );
  return categories.filter((category) => category.status === "VISIBLE");
}

export async function fetchCategoryById(id: string) {
  const response = await apiGet(
    `/api/v1/public/categories/${encodeURIComponent(id)}`,
    isCategory,
    {
      tags: ["catalog-categories", `catalog-category-${id}`],
    },
  );
  return response.data;
}

export async function fetchProductPage(
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
  } = {},
) {
  const query = new URLSearchParams();
  if (filters.search) query.set("search", filters.search);
  if (filters.categorySlug) query.set("categorySlug", filters.categorySlug);
  if (filters.isFeatured !== undefined)
    query.set("isFeatured", String(filters.isFeatured));
  if (filters.isBestSeller !== undefined)
    query.set("isBestSeller", String(filters.isBestSeller));
  query.set("page", String(filters.page ?? 1));
  query.set("limit", String(filters.limit ?? 9));
  const response = await apiGet(
    `/api/v1/public/products?${query}`,
    (value): value is PaginatedResponse<ProductResponseDto> => isPaginated(value, isProduct),
    { tags: ["catalog-products"] },
  );
  return response.data;
}

export async function fetchPublicFilter(input: PublicFilterRequest) {
  const response = await backendRequest({
    method: "POST",
    path: "/api/v1/public/filter",
    body: normalizePublicFilterRequest(input),
    cache: "no-store",
    validate: isPublicFilterResponse,
  });
  return response.data;
}

export async function fetchProduct(categorySlug: string, productSlug: string) {
  const response = await apiGet(
    `/api/v1/public/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}`,
    isProduct,
    { tags: ["catalog-products", `catalog-product-${productSlug}`] },
  );
  return response.data;
}

export async function fetchRelatedProducts(
  categorySlug: string,
  productSlug: string,
) {
  const response = await apiGet(
    `/api/v1/public/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(productSlug)}/related?limit=4`,
    (value): value is PaginatedResponse<ProductResponseDto> =>
      isPaginated(value, isProduct),
    { tags: ["catalog-products", `catalog-related-${productSlug}`] },
  );
  return response.data.items;
}

async function fetchAllPages<T>(
  path: string,
  itemGuard: (value: unknown) => value is T,
  tag: string,
) {
  const separator = path.includes("?") ? "&" : "?";
  const first = await apiGet(
    `${path}${separator}page=1&limit=${PAGE_LIMIT}`,
    (value): value is PaginatedResponse<T> => isPaginated(value, itemGuard),
    { tags: [tag] },
  );
  if (first.data.pagination.totalPages > MAX_PAGES) {
    throw new Error(
      `Catalog exceeds the safe aggregation limit of ${MAX_PAGES * PAGE_LIMIT} records`,
    );
  }
  if (first.data.pagination.totalPages <= 1) {
    if (first.data.items.length !== first.data.pagination.total)
      throw new Error("Backend pagination item count is inconsistent");
    return first.data.items;
  }
  const pages = await Promise.all(
    Array.from(
      { length: first.data.pagination.totalPages - 1 },
      (_, index) => index + 2,
    ).map((page) =>
      apiGet(
        `${path}${separator}page=${page}&limit=${PAGE_LIMIT}`,
        (value): value is PaginatedResponse<T> => isPaginated(value, itemGuard),
        { tags: [tag] },
      ),
    ),
  );
  pages.forEach((response, index) => {
    const pagination = response.data.pagination;
    if (
      pagination.page !== index + 2 ||
      pagination.total !== first.data.pagination.total ||
      pagination.totalPages !== first.data.pagination.totalPages
    ) {
      throw new Error(
        "Backend pagination changed or is inconsistent while aggregating the catalog",
      );
    }
  });
  const items = [first, ...pages].flatMap((response) => response.data.items);
  if (items.length !== first.data.pagination.total) {
    throw new Error(
      `Backend pagination returned ${items.length} items but declared ${first.data.pagination.total}`,
    );
  }
  return items;
}
