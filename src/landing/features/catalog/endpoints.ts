export type CategoryProductsParameters = {
  page?: number;
  limit?: number;
  search?: string;
};

export function categoryProductsEndpoint(
  categorySlug: string,
  parameters: CategoryProductsParameters = {},
) {
  const query = new URLSearchParams();
  query.set("page", String(parameters.page ?? 1));
  query.set("limit", String(parameters.limit ?? 9));
  if (parameters.search) query.set("search", parameters.search);
  return `/api/v1/public/categories/${encodeURIComponent(categorySlug)}/products?${query}`;
}

export function relatedOtherEndpoint(categorySlug: string) {
  return `/api/v1/public/products/${encodeURIComponent(categorySlug)}/related-other`;
}
