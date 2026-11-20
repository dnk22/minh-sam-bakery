import type { CmsBadgeVariant } from "@/cms/components/ui/badge/badge";

import type { UserAction, UserStatus } from "./types";

export const USER_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "LOCKED", label: "Đã khóa" },
] as const;

export function getUserStatusPresentation(status: UserStatus): { label: string; variant: CmsBadgeVariant } {
  return status === "ACTIVE"
    ? { label: "Đang hoạt động", variant: "success" }
    : { label: "Đã khóa", variant: "warning" };
}

export function statusAction(status: UserStatus): Exclude<UserAction, "delete"> {
  return status === "ACTIVE" ? "lock" : "unlock";
}
