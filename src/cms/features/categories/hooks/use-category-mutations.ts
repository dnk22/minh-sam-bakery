"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCategory, deleteCategory, getCategory, updateCategory } from "../api/categories.client";
import { categoryQueryKeys } from "../lib/category-query-keys";
import type { CategoryWriteInput } from "../types";

export function useCategoryDetail(id?: string) {
  return useQuery({
    queryKey: categoryQueryKeys.detail(id ?? ""),
    queryFn: ({ signal }) => getCategory(id ?? "", signal),
    enabled: Boolean(id),
    staleTime: 10_000,
    retry: false,
  });
}

export function useCategoryMutations() {
  const client = useQueryClient();
  const invalidate = async (id?: string) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: categoryQueryKeys.lists() }),
      client.invalidateQueries({ queryKey: categoryQueryKeys.tree() }),
      id ? client.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) }) : Promise.resolve(),
    ]);
  };
  return {
    create: useMutation({ mutationFn: createCategory, onSuccess: (category) => invalidate(category.id) }),
    update: useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<CategoryWriteInput> }) => updateCategory(id, input), onSuccess: (category) => invalidate(category.id) }),
    remove: useMutation({ mutationFn: deleteCategory, onSuccess: (result) => invalidate(result.id) }),
  };
}
