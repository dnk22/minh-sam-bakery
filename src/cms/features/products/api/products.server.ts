import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isDeletedProduct, isProduct, isProductList } from "../lib/product-data";
import type { Product, ProductList, ProductListParams, ProductWriteInput } from "../types";

export async function backendProductList(accessToken: string, params: ProductListParams, signal?: AbortSignal): Promise<ProductList> {
  return (await backendRequest({ path: "/api/v1/products", query: params, accessToken, cache: "no-store", signal, validate: isProductList })).data;
}

export async function backendProductDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<Product> {
  return (await backendRequest({ path: `/api/v1/products/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isProduct })).data;
}
export async function backendCreateProduct(accessToken: string, input: ProductWriteInput): Promise<Product> {
  return (await backendRequest({ path: "/api/v1/products", method: "POST", body: input, accessToken, cache: "no-store", validate: isProduct })).data;
}
export async function backendUpdateProduct(accessToken: string, id: string, input: Partial<ProductWriteInput>): Promise<Product> {
  return (await backendRequest({ path: `/api/v1/products/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isProduct })).data;
}
export async function backendDeleteProduct(accessToken: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({ path: `/api/v1/products/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedProduct })).data;
}
