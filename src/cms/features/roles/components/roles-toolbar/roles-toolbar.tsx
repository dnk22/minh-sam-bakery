"use client";

import { Search, X } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";

import type { RoleFilters } from "../../hooks/use-role-filters";
import { useRoleSearch } from "../../hooks/use-role-search";
import styles from "./roles-toolbar.module.css";

export function RolesToolbar({ filters }: { filters: RoleFilters }) {
  const search = useRoleSearch({ value: filters.search, onCommit: filters.setSearch });
  return (
    <section className={styles.toolbar} aria-label="Bộ lọc vai trò">
      <CmsInput
        aria-label="Tìm kiếm vai trò"
        containerClassName={styles.search}
        controlSize="sm"
        leadingIcon={<Search aria-hidden="true" size={17} />}
        onBlur={search.onBlur}
        onChange={(event) => search.onChange(event.target.value)}
        onFocus={search.onFocus}
        placeholder="Tìm theo tên hoặc mã vai trò"
        type="search"
        value={search.draft}
      />
      {filters.isFiltered ? (
        <CmsButton type="button" size="sm" variant="ghost" onClick={filters.clearFilters}>
          <X aria-hidden="true" size={15} /> Xóa tìm kiếm
        </CmsButton>
      ) : null}
    </section>
  );
}
