"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProduct, getProducts } from "../api/products.client";
import { productQueryKeys } from "../lib/product-query-keys";
import type { ProductListParams } from "../types";

export function useProducts(params: ProductListParams) {
  return useQuery({ queryKey: productQueryKeys.list(params), queryFn: ({ signal }) => getProducts(params, signal), placeholderData: keepPreviousData, staleTime: 20_000 });
}

export function useProductDetail(id?: string) {
  return useQuery({ queryKey: productQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getProduct(id ?? "", signal), enabled: Boolean(id), staleTime: 10_000, retry: false });
}
