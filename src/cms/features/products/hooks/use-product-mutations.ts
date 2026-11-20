"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    create: useMutation({ mutationFn: createProduct, onSuccess: (product) => invalidate(product.id) }),
    update: useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<ProductWriteInput> }) => updateProduct(id, input), onSuccess: (product) => invalidate(product.id) }),
    remove: useMutation({ mutationFn: deleteProduct, onSuccess: (result) => invalidate(result.id) }),
  };
}
