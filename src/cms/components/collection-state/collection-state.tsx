import type { ReactNode } from "react";

import { CmsButton } from "@/cms/components/ui/button";

import styles from "./collection-state.module.css";

export type CollectionStateKind = "loading" | "empty" | "filtered-empty" | "error";

const DEFAULT_MESSAGES: Record<CollectionStateKind, string> = {
  loading: "Đang tải dữ liệu…",
  empty: "Chưa có dữ liệu.",
  "filtered-empty": "Không có kết quả phù hợp.",
  error: "Không thể tải dữ liệu.",
};

export function CollectionState({
  kind,
  children,
  onRetry,
}: {
  kind: CollectionStateKind;
  children?: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.root} role={kind === "error" ? "alert" : "status"} aria-live="polite">
      <div>{children ?? DEFAULT_MESSAGES[kind]}</div>
      {kind === "error" && onRetry ? (
        <CmsButton type="button" variant="outline" size="sm" onClick={onRetry}>Thử lại</CmsButton>
      ) : null}
    </div>
  );
}
