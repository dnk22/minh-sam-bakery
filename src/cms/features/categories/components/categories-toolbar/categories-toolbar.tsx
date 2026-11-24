"use client";

import { List, Search, TreePine, X } from "lucide-react";

import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { CmsToolbarField } from "@/cms/components/toolbar/cms-toolbar-field";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSegmentedControl } from "@/cms/components/ui/segmented-control/segmented-control";
import { CmsSelect } from "@/cms/components/ui/select/select";

import { CATEGORY_STATUS_FILTER_OPTIONS } from "../../constants";
import type { CategoryFilters, CategoryView } from "../../hooks/use-category-filters";
import { useCategorySearch } from "../../hooks/use-category-search";
import { countCategoryAdvancedFilters } from "../../lib/category-data";

const CATEGORY_VIEW_OPTIONS = [
  { value: "flat", label: "Dạng phẳng", icon: <List aria-hidden="true" size={16} /> },
  { value: "tree", label: "Dạng cây", icon: <TreePine aria-hidden="true" size={16} /> },
] as const;

export function CategoriesToolbar({ filters }: { filters: CategoryFilters }) {
  const search = useCategorySearch({ value: filters.search, onCommit: filters.setSearch });
  const advancedCount = countCategoryAdvancedFilters(filters.status);

  return <CmsToolbar
    label="Bộ lọc danh mục"
    search={<CmsInput aria-label="Tìm kiếm danh mục" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)} onFocus={search.onFocus} placeholder="Tìm theo tên hoặc slug" type="search" value={search.draft} />}
    filters={<CmsFilterGroup activeCount={advancedCount} label="Bộ lọc danh mục" onClear={filters.clearAdvancedFilters}>
        <CmsToolbarField>
          <CmsSelect aria-label="Lọc theo trạng thái" controlSize="sm" id="category-status-filter" options={CATEGORY_STATUS_FILTER_OPTIONS} value={filters.status ?? ""} onChange={(event) => { const value = event.target.value; filters.setStatus(value === "VISIBLE" || value === "HIDDEN" ? value : undefined); }} />
        </CmsToolbarField>
      </CmsFilterGroup>}
    actions={filters.isFiltered ? <CmsButton type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tất cả</CmsButton> : null}
    trailing={<CmsSegmentedControl<CategoryView> ariaLabel="Kiểu hiển thị" onChange={filters.setView} options={CATEGORY_VIEW_OPTIONS} value={filters.view} />}
  />;
}
