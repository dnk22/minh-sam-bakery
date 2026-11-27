"use client";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";

import { Search } from "lucide-react";

import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { CmsToolbarField } from "@/cms/components/toolbar/cms-toolbar-field";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsCombobox } from "@/cms/components/ui/combobox/combobox";
import { useCategoryTree } from "@/cms/features/categories/hooks/use-categories";
import { flattenTreeOptions } from "@/cms/features/categories/lib/category-tree";

import { BOOLEAN_FILTER_OPTIONS, PRODUCT_STATUS_FILTER_OPTIONS } from "../../constants";
import type { ProductFilters } from "../../hooks/use-product-filters";
import { countProductAdvancedFilters } from "../../lib/product-data";
import type { ProductStatus } from "../../types";
import styles from "./products-toolbar.module.css";

const parseBoolean = (value: string) => value === "true" ? true : value === "false" ? false : undefined;

export function ProductsToolbar({ filters, fetching }: { filters: ProductFilters; fetching?: boolean }) {
  const draft = useToolbarDraft({ search: filters.search, status: filters.status, categoryId: filters.categoryId, isFeatured: filters.isFeatured, isBestSeller: filters.isBestSeller });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "", status: undefined, categoryId: undefined, isFeatured: undefined, isBestSeller: undefined }); filters.clearFilters(); };
  const clearAdvanced = () => { const next = { search: filters.search, status: undefined, categoryId: undefined, isFeatured: undefined, isBestSeller: undefined }; draft.reset(next); filters.applyFilters(next); };
  const categories = useCategoryTree();
  const tree = categories.data?.tree;
  const reason = categories.error instanceof Error ? categories.error.message : categories.data?.reason;
  const categoryOptions = [
    { value: "", label: categories.isLoading ? "Đang tải danh mục…" : reason ? "Không thể tải danh mục" : "Tất cả danh mục" },
    ...(tree ? flattenTreeOptions(tree.forest).map((item) => ({ value: item.id, label: item.label })) : []),
  ];
  const advancedCount = countProductAdvancedFilters(draft.values);

  return <CmsToolbar fetching={fetching}
    label="Bộ lọc sản phẩm"
    search={<CmsInput aria-label="Tìm kiếm sản phẩm" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />}  onChange={(event) => draft.set("search", event.target.value)}  placeholder="Tìm theo tên hoặc SKU" type="search" value={draft.values.search} />}
    filters={<CmsFilterGroup layout="toolbar" activeCount={advancedCount} label="Bộ lọc sản phẩm" onClear={clearAdvanced} onApply={apply}>
        <CmsToolbarField><CmsSelect aria-label="Lọc theo trạng thái" controlSize="sm" options={PRODUCT_STATUS_FILTER_OPTIONS} value={draft.values.status ?? ""} onChange={(event) => draft.set("status", (event.target.value || undefined) as ProductStatus | undefined)} /></CmsToolbarField>
        <CmsToolbarField size="wide"><CmsCombobox aria-label="Lọc theo danh mục" controlSize="sm" disabled={categories.isLoading || Boolean(reason)} options={categoryOptions} value={draft.values.categoryId ?? ""} onValueChange={(value) => draft.set("categoryId", value || undefined)} /></CmsToolbarField>
        <CmsToolbarField size="compact"><CmsSelect aria-label="Lọc sản phẩm nổi bật" controlSize="sm" options={BOOLEAN_FILTER_OPTIONS.map((option) => ({ ...option, label: option.value === "" ? "Nổi bật: Tất cả" : `Nổi bật: ${option.label}` }))} value={draft.values.isFeatured === undefined ? "" : String(draft.values.isFeatured)} onChange={(event) => draft.set("isFeatured", parseBoolean(event.target.value))} /></CmsToolbarField>
        <CmsToolbarField size="compact"><CmsSelect aria-label="Lọc sản phẩm bán chạy" controlSize="sm" options={BOOLEAN_FILTER_OPTIONS.map((option) => ({ ...option, label: option.value === "" ? "Bán chạy: Tất cả" : `Bán chạy: ${option.label}` }))} value={draft.values.isBestSeller === undefined ? "" : String(draft.values.isBestSeller)} onChange={(event) => draft.set("isBestSeller", parseBoolean(event.target.value))} /></CmsToolbarField>
      </CmsFilterGroup>}
    onSearch={apply}
    onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    feedback={reason ? <p className={styles.error} role="alert">Không thể tải đầy đủ danh mục để lọc. <button type="button" onClick={() => categories.refetch()}>Thử lại</button></p> : null}
  />;
}
