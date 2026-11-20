import type { CategoryStatus } from "../../types";
import styles from "./category-status-badge.module.css";

export function CategoryStatusBadge({ status }: { status: CategoryStatus }) {
  return (
    <span className={status === "VISIBLE" ? styles.visible : styles.hidden}>
      {status === "VISIBLE" ? "Hiển thị" : "Ẩn"}
    </span>
  );
}
