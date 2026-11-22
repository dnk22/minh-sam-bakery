"use client";

import { Search, X } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsCombobox } from "@/cms/components/ui/combobox/combobox";
import { useCategoryTree } from "@/cms/features/categories/hooks/use-categories";
import { flattenTreeOptions } from "@/cms/features/categories/lib/category-tree";

import { BOOLEAN_FILTER_OPTIONS, PRODUCT_STATUS_FILTER_OPTIONS } from "../../constants";
import type { ProductFilters } from "../../hooks/use-product-filters";
import { useProductSearch } from "../../hooks/use-product-search";
import { countProductAdvancedFilters } from "../../lib/product-data";
import type { ProductStatus } from "../../types";
import styles from "./products-toolbar.module.css";

const parseBoolean = (value: string) => value === "true" ? true : value === "false" ? false : undefined;

export function ProductsToolbar({ filters }: { filters: ProductFilters }) {
  const search = useProductSearch({ value: filters.search, onCommit: filters.setSearch });
  const categories = useCategoryTree();
  const tree = categories.data?.tree;
  const reason = categories.error instanceof Error ? categories.error.message : categories.data?.reason;
  const categoryOptions = [
    { value: "", label: categories.isLoading ? "Đang tải danh mục…" : reason ? "Không thể tải danh mục" : "Tất cả danh mục" },
    ...(tree ? flattenTreeOptions(tree.forest).map((item) => ({ value: item.id, label: item.label })) : []),
  ];
  const advancedCount = countProductAdvancedFilters(filters);

  return <section className={styles.toolbar} aria-label="Bộ lọc sản phẩm">
    <div className={styles.controls}>
      <CmsInput aria-label="Tìm kiếm sản phẩm" containerClassName={styles.search} controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)} onFocus={search.onFocus} placeholder="Tìm theo tên hoặc SKU" type="search" value={search.draft} />
      <CmsFilterGroup activeCount={advancedCount} label="Bộ lọc sản phẩm" onClear={filters.clearAdvancedFilters}>
        <CmsSelect aria-label="Lọc theo trạng thái" containerClassName={styles.select} controlSize="sm" options={PRODUCT_STATUS_FILTER_OPTIONS} value={filters.status ?? ""} onChange={(event) => filters.setStatus((event.target.value || undefined) as ProductStatus | undefined)} />
        <CmsCombobox aria-label="Lọc theo danh mục" containerClassName={styles.category} controlSize="sm" disabled={categories.isLoading || Boolean(reason)} options={categoryOptions} value={filters.categoryId ?? ""} onValueChange={(value) => filters.setCategoryId(value || undefined)} />
        <CmsSelect aria-label="Lọc sản phẩm nổi bật" containerClassName={styles.boolean} controlSize="sm" options={BOOLEAN_FILTER_OPTIONS.map((option) => ({ ...option, label: option.value === "" ? "Nổi bật: Tất cả" : `Nổi bật: ${option.label}` }))} value={filters.isFeatured === undefined ? "" : String(filters.isFeatured)} onChange={(event) => filters.setFeatured(parseBoolean(event.target.value))} />
        <CmsSelect aria-label="Lọc sản phẩm bán chạy" containerClassName={styles.boolean} controlSize="sm" options={BOOLEAN_FILTER_OPTIONS.map((option) => ({ ...option, label: option.value === "" ? "Bán chạy: Tất cả" : `Bán chạy: ${option.label}` }))} value={filters.isBestSeller === undefined ? "" : String(filters.isBestSeller)} onChange={(event) => filters.setBestSeller(parseBoolean(event.target.value))} />
      </CmsFilterGroup>
      {filters.isFiltered ? <CmsButton className={styles.clearAll} type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tất cả</CmsButton> : null}
    </div>
    {reason ? <p className={styles.error} role="alert">Không thể tải đầy đủ danh mục để lọc. <button type="button" onClick={() => categories.refetch()}>Thử lại</button></p> : null}
  </section>;
}
