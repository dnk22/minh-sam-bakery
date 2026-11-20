import { FolderPlus } from "lucide-react";

import type { Category } from "../../types";
import styles from "./category-list-item.module.css";

export function CategoryListItem({
  category,
  parentName,
}: {
  category: Category;
  parentName?: string;
}) {
  return (
    <div className={styles.item}>
      <div className={styles.icon}>
        <FolderPlus aria-hidden="true" />
      </div>
      <div className={styles.content}>
        <strong>{category.name}</strong>
        <span>
          {parentName ??
            (category.parentId ? "Không xác định" : "Danh mục gốc")} {" "}
          · Thứ tự {category.sortOrder}
        </span>
      </div>
    </div>
  );
}
