"use client";

import { Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";

import {
  CmsDropdown,
  CmsDropdownContent,
  CmsDropdownItem,
  CmsDropdownSeparator,
  CmsDropdownTrigger,
} from "@/cms/components/ui/dropdown-menu";

import type { Category } from "../../types";
import styles from "./category-row-actions.module.css";

export type CategoryActionHandlers = {
  onDetail: (category: Category) => void;
  onAddChild: (category: Category) => void;
  onDelete: (category: Category) => void;
};

type CategoryRowActionsProps = CategoryActionHandlers & {
  category: Category;
};

export function CategoryRowActions({
  category,
  onDetail,
  onAddChild,
  onDelete,
}: CategoryRowActionsProps) {
  const stopAndRun =
    (callback: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      callback();
    };

  return (
    <div className={styles.actions}>
      <button
        className={styles.view}
        type="button"
        aria-label={`Xem chi tiết ${category.name}`}
        title="Xem chi tiết"
        onClick={stopAndRun(() => onDetail(category))}
      >
        <Eye aria-hidden="true" />
      </button>
      <CmsDropdown>
        <CmsDropdownTrigger asChild>
          <button
            className={styles.more}
            type="button"
            aria-label={`Mở thao tác cho ${category.name}`}
            title="Thao tác khác"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal aria-hidden="true" />
          </button>
        </CmsDropdownTrigger>
        <CmsDropdownContent align="end" className={styles.menu}>
          <CmsDropdownItem onSelect={() => onAddChild(category)}>
            <Plus aria-hidden="true" size={15} /> Thêm danh mục con
          </CmsDropdownItem>
          <CmsDropdownSeparator />
          <CmsDropdownItem
            className={styles.deleteItem}
            onSelect={() => onDelete(category)}
          >
            <Trash2 aria-hidden="true" size={15} /> Xóa danh mục
          </CmsDropdownItem>
        </CmsDropdownContent>
      </CmsDropdown>
    </div>
  );
}
