import { cmsApiClient } from "@/cms/lib/api/client";

import type { Product, ProductList, ProductListParams } from "../types";

export function getProducts(params: ProductListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.isFeatured !== undefined) query.set("isFeatured", String(params.isFeatured));
  if (params.isBestSeller !== undefined) query.set("isBestSeller", String(params.isBestSeller));
  return cmsApiClient.get<ProductList>(`/products?${query}`, { signal });
}

export const getProduct = (id: string, signal?: AbortSignal) =>
  cmsApiClient.get<Product>(`/products/${encodeURIComponent(id)}`, { signal });
