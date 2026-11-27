"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/cms/lib/notifications";

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
    create: useMutation({ meta: { pageLoading: true }, mutationFn: createCategory, onSuccess: async (category) => { client.setQueryData(categoryQueryKeys.detail(category.id), category); await invalidate(category.id); notify.success("Đã thêm danh mục."); }, onError: () => notify.error("Không thể thêm danh mục. Vui lòng thử lại.") }),
    update: useMutation({ meta: { pageLoading: true }, mutationFn: ({ id, input }: { id: string; input: Partial<CategoryWriteInput> }) => updateCategory(id, input), onSuccess: async (category) => { client.setQueryData(categoryQueryKeys.detail(category.id), category); await invalidate(category.id); notify.success("Đã cập nhật danh mục."); }, onError: () => notify.error("Không thể cập nhật danh mục. Vui lòng thử lại.") }),
    remove: useMutation({ meta: { pageLoading: true }, mutationFn: deleteCategory, onSuccess: async (result) => { await invalidate(result.id); notify.success("Đã xóa danh mục."); }, onError: () => notify.error("Không thể xóa danh mục. Vui lòng thử lại.") }),
  };
}
