"use client";

import { Search, X } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { THEME_STATUS_OPTIONS } from "../../constants";
import type { ThemeFilters } from "../../hooks/use-theme-filters";
import { useThemeSearch } from "../../hooks/use-theme-search";
import styles from "./themes-toolbar.module.css";

export function ThemesToolbar({ filters }: { filters: ThemeFilters }) {
  const search = useThemeSearch({ value: filters.search, onCommit: filters.setSearch });
  return (
    <section className={styles.toolbar} aria-label="Bộ lọc giao diện website">
      <CmsInput
        aria-label="Tìm theo tên hoặc mã theme"
        containerClassName={styles.search}
        controlSize="sm"
        leadingIcon={<Search aria-hidden="true" size={17} />}
        type="search" placeholder="Tìm tên hoặc mã theme..."
        value={search.draft} onChange={(e) => search.onChange(e.target.value)}
        onBlur={search.onBlur} onFocus={search.onFocus}
      />
      <CmsFilterGroup
        activeCount={Number(filters.isActive !== undefined)}
        label="Bộ lọc giao diện website"
        onClear={() => filters.setActive(undefined)}
      >
        <CmsSelect
          aria-label="Lọc theo trạng thái theme"
          containerClassName={styles.status}
          controlSize="sm"
          options={THEME_STATUS_OPTIONS}
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onValueChange={(value) => filters.setActive(value === "" ? undefined : value === "true")}
        />
      </CmsFilterGroup>
      {filters.isFiltered ? <CmsButton className={styles.clearAll} size="sm" variant="ghost" type="button" onClick={filters.clear}><X size={15} aria-hidden="true" /> Xóa tất cả</CmsButton> : null}
    </section>
  );
}
