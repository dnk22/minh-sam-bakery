"use client";

import { Search, X } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsCombobox } from "@/cms/components/ui/combobox/combobox";
import { useRoleSelector } from "@/cms/features/roles/hooks/use-roles";

import { USER_STATUS_FILTER_OPTIONS } from "../../constants";
import type { UserFilters } from "../../hooks/use-user-filters";
import { useUserSearch } from "../../hooks/use-user-search";
import { countUserAdvancedFilters } from "../../lib/user-filter-data";
import styles from "./users-toolbar.module.css";

export function UsersToolbar({ filters }: { filters: UserFilters }) {
  const search = useUserSearch({ value: filters.search, onCommit: filters.setSearch });
  const roles = useRoleSelector();
  const roleOptions = [
    { value: "", label: roles.isLoading ? "Đang tải vai trò…" : roles.error ? "Không thể tải vai trò" : "Tất cả vai trò" },
    ...(roles.data ?? []).map((role) => ({ value: role.id, label: `${role.name} (${role.code})` })),
  ];
  const advancedCount = countUserAdvancedFilters(filters.status, filters.roleId);

  return <section className={styles.toolbar} aria-label="Bộ lọc tài khoản">
    <div className={styles.controls}>
      <CmsInput aria-label="Tìm kiếm tài khoản" containerClassName={styles.search} controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} onBlur={search.onBlur} onChange={(event) => search.onChange(event.target.value)} onFocus={search.onFocus} placeholder="Tìm theo tên hoặc email" type="search" value={search.draft} />
      <CmsFilterGroup activeCount={advancedCount} label="Bộ lọc tài khoản" onClear={filters.clearAdvancedFilters}>
        <CmsSelect aria-label="Lọc theo trạng thái" containerClassName={styles.select} controlSize="sm" options={USER_STATUS_FILTER_OPTIONS} value={filters.status ?? ""} onChange={(event) => filters.setStatus(event.target.value === "ACTIVE" || event.target.value === "LOCKED" ? event.target.value : undefined)} />
        <CmsCombobox aria-label="Lọc theo vai trò" containerClassName={styles.roleSelect} controlSize="sm" disabled={roles.isLoading || Boolean(roles.error)} options={roleOptions} value={filters.roleId ?? ""} onValueChange={(value) => filters.setRoleId(value || undefined)} />
      </CmsFilterGroup>
      {filters.isFiltered ? <CmsButton className={styles.clearAll} type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tất cả</CmsButton> : null}
    </div>
    {roles.error ? <p className={styles.error} role="alert">Không thể tải danh sách vai trò để lọc. <button type="button" onClick={() => roles.refetch()}>Thử lại</button></p> : null}
  </section>;
}
