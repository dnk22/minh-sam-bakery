export type ProductCategoryGuardInput = {
  mode: "create" | "edit";
  selectedCategoryId: string;
  originalCategoryId?: string;
  completeCategoryIds?: ReadonlySet<string>;
};

export function productCategoryGuard(input: ProductCategoryGuardInput) {
  const selected = input.selectedCategoryId.trim();
  if (input.mode === "edit" && selected && selected === input.originalCategoryId) {
    return { allowed: true, reason: null } as const;
  }
  if (!input.completeCategoryIds) {
    return { allowed: false, reason: "Cần tải đầy đủ danh mục trước khi chọn hoặc thay đổi danh mục." } as const;
  }
  if (!selected || !input.completeCategoryIds.has(selected)) {
    return { allowed: false, reason: "Danh mục đã chọn không tồn tại trong danh sách đã xác minh." } as const;
  }
  return { allowed: true, reason: null } as const;
}
