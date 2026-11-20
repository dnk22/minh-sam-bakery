import type { CmsBadgeVariant } from "@/cms/components/ui/badge/badge";

import type { ProductStatus } from "./types";

export const PRODUCT_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
  { value: "HIDDEN", label: "Đã ẩn" },
] as const;

export const BOOLEAN_FILTER_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "true", label: "Có" },
  { value: "false", label: "Không" },
] as const;

export function getProductStatusPresentation(status: ProductStatus): { label: string; variant: CmsBadgeVariant } {
  if (status === "PUBLISHED") return { label: "Đã xuất bản", variant: "success" };
  if (status === "HIDDEN") return { label: "Đã ẩn", variant: "secondary" };
  return { label: "Bản nháp", variant: "warning" };
}
