"use client";

import { List, Search, TreePine, X } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSegmentedControl } from "@/cms/components/ui/segmented-control/segmented-control";
import { CmsSelect } from "@/cms/components/ui/select/select";

import { CATEGORY_STATUS_FILTER_OPTIONS } from "../../constants";
import type { CategoryFilters, CategoryView } from "../../hooks/use-category-filters";
import { useCategorySearch } from "../../hooks/use-category-search";
import { countCategoryAdvancedFilters } from "../../lib/category-data";
import styles from "./categories-toolbar.module.css";

const CATEGORY_VIEW_OPTIONS = [
  { value: "flat", label: "Dạng phẳng", icon: <List aria-hidden="true" size={16} /> },
  { value: "tree", label: "Dạng cây", icon: <TreePine aria-hidden="true" size={16} /> },
] as const;

export function CategoriesToolbar({ filters }: { filters: CategoryFilters }) {
  const search = useCategorySearch({ value: filters.search, onCommit: filters.setSearch });
  const advancedCount = countCategoryAdvancedFilters(filters.status);

  return <section className={styles.toolbar} aria-label="Bộ lọc danh mục">
    <div className={styles.filters}>
      <CmsInput aria-label="Tìm kiếm danh mục" containerClassName={styles.search} controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)} onFocus={search.onFocus} placeholder="Tìm theo tên hoặc slug" type="search" value={search.draft} />
      <CmsFilterGroup activeCount={advancedCount} label="Bộ lọc danh mục" onClear={filters.clearAdvancedFilters}>
        <div className={styles.filter}>
          <label htmlFor="category-status-filter">Trạng thái</label>
          <CmsSelect containerClassName={styles.statusSelect} controlSize="sm" id="category-status-filter" options={CATEGORY_STATUS_FILTER_OPTIONS} value={filters.status ?? ""} onChange={(event) => { const value = event.target.value; filters.setStatus(value === "VISIBLE" || value === "HIDDEN" ? value : undefined); }} />
        </div>
      </CmsFilterGroup>
      {filters.isFiltered ? <CmsButton className={styles.clearAll} type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tất cả</CmsButton> : null}
    </div>
    <div className={styles.viewArea}><CmsSegmentedControl<CategoryView> ariaLabel="Kiểu hiển thị" onChange={filters.setView} options={CATEGORY_VIEW_OPTIONS} value={filters.view} /></div>
  </section>;
}
