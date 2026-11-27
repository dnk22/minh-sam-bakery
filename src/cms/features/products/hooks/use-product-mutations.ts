"use client";

import { blockingMutationOptions } from "@/cms/lib/blocking-mutation-options";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/cms/lib/notifications";

import { createProduct, deleteProduct, updateProduct } from "../api/products.client";
import { productQueryKeys } from "../lib/product-query-keys";
import type { ProductWriteInput } from "../types";

export function useProductMutations() {
  const client = useQueryClient();
  const invalidate = async (id?: string) => Promise.all([
    client.invalidateQueries({ queryKey: productQueryKeys.lists() }),
    id ? client.invalidateQueries({ queryKey: productQueryKeys.detail(id) }) : Promise.resolve(),
  ]);
  return {
    create: useMutation({ ...blockingMutationOptions, mutationFn: createProduct, onSuccess: async (product) => { client.setQueryData(productQueryKeys.detail(product.id), product); await invalidate(product.id); notify.success("Đã thêm sản phẩm."); }, onError: () => notify.error("Không thể thêm sản phẩm. Vui lòng thử lại.") }),
    update: useMutation({ ...blockingMutationOptions, mutationFn: ({ id, input }: { id: string; input: Partial<ProductWriteInput> }) => updateProduct(id, input), onSuccess: async (product) => { await invalidate(product.id); notify.success("Đã cập nhật sản phẩm."); }, onError: () => notify.error("Không thể cập nhật sản phẩm. Vui lòng thử lại.") }),
    remove: useMutation({ ...blockingMutationOptions, mutationFn: deleteProduct, onSuccess: async (result) => { await invalidate(result.id); notify.success("Đã xóa sản phẩm."); }, onError: () => notify.error("Không thể xóa sản phẩm. Vui lòng thử lại.") }),
  };
}
