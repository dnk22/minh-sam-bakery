import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isCategory, isCategoryList, isDeletedCategory } from "../lib/category-data";
import type { Category, CategoryList, CategoryListParams, CategoryWriteInput } from "../types";

export async function backendCategoryList(accessToken: string, params: CategoryListParams, signal?: AbortSignal): Promise<CategoryList> {
  return (await backendRequest({
    path: "/api/v1/categories",
    query: params,
    accessToken,
    cache: "no-store",
    signal,
    validate: isCategoryList,
  })).data;
}

export async function backendCategoryDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<Category> {
  return (await backendRequest({ path: `/api/v1/categories/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isCategory })).data;
}

export async function backendCreateCategory(accessToken: string, input: CategoryWriteInput): Promise<Category> {
  return (await backendRequest({ path: "/api/v1/categories", method: "POST", body: input, accessToken, cache: "no-store", validate: isCategory })).data;
}

export async function backendUpdateCategory(accessToken: string, id: string, input: Partial<CategoryWriteInput>): Promise<Category> {
  return (await backendRequest({ path: `/api/v1/categories/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isCategory })).data;
}

export async function backendDeleteCategory(accessToken: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({ path: `/api/v1/categories/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedCategory })).data;
}
