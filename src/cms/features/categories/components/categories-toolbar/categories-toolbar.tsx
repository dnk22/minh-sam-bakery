"use client";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";

import { List, Search, TreePine } from "lucide-react";

import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { CmsToolbarField } from "@/cms/components/toolbar/cms-toolbar-field";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSegmentedControl } from "@/cms/components/ui/segmented-control/segmented-control";
import { CmsSelect } from "@/cms/components/ui/select/select";

import { CATEGORY_STATUS_FILTER_OPTIONS } from "../../constants";
import type { CategoryFilters, CategoryView } from "../../hooks/use-category-filters";
import { countCategoryAdvancedFilters } from "../../lib/category-data";

const CATEGORY_VIEW_OPTIONS = [
  { value: "flat", label: "Dạng phẳng", icon: <List aria-hidden="true" size={16} /> },
  { value: "tree", label: "Dạng cây", icon: <TreePine aria-hidden="true" size={16} /> },
] as const;

export function CategoriesToolbar({ filters }: { filters: CategoryFilters }) {
  const draft = useToolbarDraft({ search: filters.search, status: filters.status });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "", status: undefined }); filters.clearFilters(); };
  const clearAdvanced = () => { const next = { search: filters.search, status: undefined }; draft.reset(next); filters.applyFilters(next); };
  const advancedCount = countCategoryAdvancedFilters(draft.values.status);

  return <CmsToolbar
    label="Bộ lọc danh mục"
    search={<CmsInput aria-label="Tìm kiếm danh mục" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />}  onChange={(event) => draft.set("search", event.target.value)}  placeholder="Tìm theo tên hoặc slug" type="search" value={draft.values.search} />}
    filters={<CmsFilterGroup layout="toolbar" activeCount={advancedCount} label="Bộ lọc danh mục" onClear={clearAdvanced}>
        <CmsToolbarField>
          <CmsSelect aria-label="Lọc theo trạng thái" controlSize="sm" id="category-status-filter" options={CATEGORY_STATUS_FILTER_OPTIONS} value={draft.values.status ?? ""} onChange={(event) => { const value = event.target.value; draft.set("status", value === "VISIBLE" || value === "HIDDEN" ? value : undefined); }} />
        </CmsToolbarField>
      </CmsFilterGroup>}
    onSearch={apply}
    onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    trailing={<CmsSegmentedControl<CategoryView> ariaLabel="Kiểu hiển thị" onChange={filters.setView} options={CATEGORY_VIEW_OPTIONS} value={filters.view} />}
  />;
}
