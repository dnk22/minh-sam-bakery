import "server-only";

import { apiGet } from "@/lib/api/client";
import type {
  CategoryResponseDto,
  PaginatedResponse,
  ProductResponseDto,
} from "@/lib/api/types";
import { isCategory, isPaginated, isProduct } from "./response-data";

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

export async function fetchCategoryProducts(
  categorySlug: string,
  filters: { page?: number; limit?: number; search?: string } = {},
) {
  const query = new URLSearchParams();
  if (filters.search) query.set("search", filters.search);
  query.set("page", String(filters.page ?? 1));
  query.set("limit", String(filters.limit ?? 9));
  const response = await apiGet(
    `/api/v1/public/categories/${encodeURIComponent(categorySlug)}/products?${query}`,
    (value): value is PaginatedResponse<ProductResponseDto> => isPaginated(value, isProduct),
    { tags: ["catalog-products", `catalog-category-products-${categorySlug}`] },
  );
  return response.data;
}

export async function fetchRelatedOtherCategoryProducts(categorySlug: string) {
  const response = await apiGet(
    `/api/v1/public/products/${encodeURIComponent(categorySlug)}/related-other`,
    (value): value is PaginatedResponse<ProductResponseDto> => isPaginated(value, isProduct),
    { tags: ["catalog-products", `catalog-related-other-${categorySlug}`] },
  );
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
