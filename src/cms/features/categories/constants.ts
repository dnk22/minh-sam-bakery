import type { CmsBadgeVariant } from "@/cms/components/ui/badge/badge";
import type { CmsSelectOption } from "@/cms/components/ui/select/select";

import type { CategoryStatus } from "./types";

export const CATEGORY_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "VISIBLE", label: "Hiển thị" },
  { value: "HIDDEN", label: "Ẩn" },
] as const satisfies readonly CmsSelectOption[];

export const CATEGORY_STATUS_OPTIONS = [
  { value: "VISIBLE", label: "Hiển thị" },
  { value: "HIDDEN", label: "Ẩn" },
] as const satisfies readonly CmsSelectOption[];

export function getCategoryStatusPresentation(status: CategoryStatus): {
  label: string;
  variant: CmsBadgeVariant;
} {
  return status === "VISIBLE"
    ? { label: "Hiển thị", variant: "success" }
    : { label: "Ẩn", variant: "secondary" };
}
