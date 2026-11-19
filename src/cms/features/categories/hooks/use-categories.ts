"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCategories } from "../api/categories.client";
import { CATEGORY_TREE_MAX_ITEMS, CATEGORY_TREE_PAGE_SIZE, buildCategoryForest, evaluateTreeLoad } from "../lib/category-tree";
import { categoryQueryKeys } from "../lib/category-query-keys";
import type { Category, CategoryListParams } from "../types";

export function useCategories(params: CategoryListParams) {
  return useQuery({
    queryKey: categoryQueryKeys.list(params),
    queryFn: ({ signal }) => getCategories(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
  });
}

export async function loadCompleteCategoryTree(signal?: AbortSignal) {
  const first = await getCategories({ page: 1, limit: CATEGORY_TREE_PAGE_SIZE }, signal);
  const decision = evaluateTreeLoad(first.pagination.total, first.items.length);
  if (!decision.complete && first.pagination.total > CATEGORY_TREE_MAX_ITEMS) return { tree: null, reason: decision.reason };
  const items: Category[] = [...first.items];
  for (let page = 2; page <= first.pagination.totalPages; page += 1) {
    const next = await getCategories({ page, limit: CATEGORY_TREE_PAGE_SIZE }, signal);
    if (next.pagination.page !== page || next.pagination.total !== first.pagination.total || next.pagination.totalPages !== first.pagination.totalPages) {
      return { tree: null, reason: "Dữ liệu danh mục đã thay đổi trong lúc tải cây. Vui lòng thử lại." };
    }
    items.push(...next.items);
    if (items.length > CATEGORY_TREE_MAX_ITEMS) return { tree: null, reason: `Dữ liệu cây vượt giới hạn ${CATEGORY_TREE_MAX_ITEMS} danh mục.` };
  }
  const completeness = evaluateTreeLoad(first.pagination.total, items.length);
  if (!completeness.complete) return { tree: null, reason: completeness.reason };
  const tree = buildCategoryForest(items);
  return tree.complete ? { tree, reason: null } : { tree: null, reason: tree.issues.join(" ") };
}

export function useCategoryTree(enabled = true) {
  return useQuery({
    queryKey: categoryQueryKeys.tree(),
    queryFn: ({ signal }) => loadCompleteCategoryTree(signal),
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}
