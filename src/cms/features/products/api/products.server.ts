import "server-only";

import { backendRequest } from "@/lib/api/backend-client";

import { isProduct, isProductList } from "../lib/product-data";
import type { Product, ProductList, ProductListParams } from "../types";

export async function backendProductList(accessToken: string, params: ProductListParams, signal?: AbortSignal): Promise<ProductList> {
  return (await backendRequest({ path: "/api/v1/products", query: params, accessToken, cache: "no-store", signal, validate: isProductList })).data;
}

export async function backendProductDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<Product> {
  return (await backendRequest({ path: `/api/v1/products/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isProduct })).data;
}
