import { cmsApiClient } from "@/cms/lib/api/client";

import type { Category, CategoryList, CategoryListParams, CategoryWriteInput } from "../types";

export function getCategories(params: CategoryListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  return cmsApiClient.get<CategoryList>(`/categories?${query}`, { signal });
}

export const getCategory = (id: string, signal?: AbortSignal) => cmsApiClient.get<Category>(`/categories/${encodeURIComponent(id)}`, { signal });
export const createCategory = (input: CategoryWriteInput) => cmsApiClient.post<Category>("/categories", input);
export const updateCategory = (id: string, input: Partial<CategoryWriteInput>) => cmsApiClient.patch<Category>(`/categories/${encodeURIComponent(id)}`, input);
export const deleteCategory = (id: string) => cmsApiClient.delete<{ id: string }>(`/categories/${encodeURIComponent(id)}`);
