"use client";

import { Search, X } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";

import type { SystemConfigFilters } from "../../hooks/use-system-config-filters";
import { useSystemConfigSearch } from "../../hooks/use-system-config-search";
import styles from "./system-configs-toolbar.module.css";

export function SystemConfigsToolbar({ filters }: { filters: SystemConfigFilters }) {
  const search = useSystemConfigSearch({ value: filters.search, onCommit: filters.setSearch });
  return <section className={styles.toolbar} aria-label="Bộ lọc cấu hình hệ thống">
    <CmsInput aria-label="Tìm kiếm cấu hình" containerClassName={styles.search} controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />}
      onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)} onFocus={search.onFocus}
      placeholder="Tìm theo khóa hoặc mô tả" type="search" value={search.draft} />
    {filters.isFiltered ? <CmsButton type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tìm kiếm</CmsButton> : null}
  </section>;
}
