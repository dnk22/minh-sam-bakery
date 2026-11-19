"use client";

import { List, TreePine, X } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";

import type { CategoryFilters } from "../../hooks/use-category-filters";
import type { CategoryStatus } from "../../types";
import { CategorySearch } from "../category-search";
import styles from "./categories-toolbar.module.css";

export function CategoriesToolbar({ filters }: { filters: CategoryFilters }) {
  return (
    <section className={styles.toolbar} aria-label="Bộ lọc danh mục">
      <div className={styles.filters}>
        <CategorySearch
          key={filters.search}
          value={filters.search}
          onCommit={filters.setSearch}
        />
        <label className={styles.filter}>
          <span>Trạng thái</span>
          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              filters.setStatus(
                (event.target.value || undefined) as CategoryStatus | undefined,
              )
            }
          >
            <option value="">Tất cả</option>
            <option value="VISIBLE">Hiển thị</option>
            <option value="HIDDEN">Ẩn</option>
          </select>
        </label>
        {filters.isFiltered ? (
          <CmsButton
            type="button"
            size="sm"
            variant="ghost"
            onClick={filters.clearFilters}
          >
            <X aria-hidden="true" size={15} /> Xóa bộ lọc
          </CmsButton>
        ) : null}
      </div>
      <div className={styles.viewArea}>
        <div className={styles.viewSwitch} aria-label="Kiểu hiển thị" role="group">
          <CmsButton
            aria-pressed={filters.view === "flat"}
            data-active={filters.view === "flat" || undefined}
            type="button"
            size="sm"
            variant={filters.view === "flat" ? "secondary" : "ghost"}
            onClick={() => filters.setView("flat")}
          >
            <List aria-hidden="true" size={16} /> Dạng phẳng
          </CmsButton>
          <CmsButton
            aria-pressed={filters.view === "tree"}
            data-active={filters.view === "tree" || undefined}
            type="button"
            size="sm"
            variant={filters.view === "tree" ? "secondary" : "ghost"}
            onClick={() => filters.setView("tree")}
          >
            <TreePine aria-hidden="true" size={16} /> Dạng cây
          </CmsButton>
        </div>
      </div>
    </section>
  );
}
