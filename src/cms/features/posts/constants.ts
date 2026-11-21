import type { CmsBadgeVariant } from "@/cms/components/ui/badge/badge";
import type { PostStatus } from "./types";

export const POST_STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
] as const;

export const POST_LANDING_OPTIONS = [
  { value: "", label: "Trang chủ: Tất cả" },
  { value: "true", label: "Trang chủ: Có" },
  { value: "false", label: "Trang chủ: Không" },
] as const;

export function getPostStatusPresentation(status: PostStatus): { label: string; variant: CmsBadgeVariant } {
  return status === "PUBLISHED" ? { label: "Đã xuất bản", variant: "success" } : { label: "Bản nháp", variant: "secondary" };
}
