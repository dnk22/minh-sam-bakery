"use client";

import { Search, X } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { useRoleSelector } from "@/cms/features/roles/hooks/use-roles";

import { USER_STATUS_FILTER_OPTIONS } from "../../constants";
import type { UserFilters } from "../../hooks/use-user-filters";
import { useUserSearch } from "../../hooks/use-user-search";
import styles from "./users-toolbar.module.css";

export function UsersToolbar({ filters }: { filters: UserFilters }) {
  const search = useUserSearch({ value: filters.search, onCommit: filters.setSearch });
  const roles = useRoleSelector();
  const roleOptions = [
    { value: "", label: roles.isLoading ? "Đang tải vai trò…" : roles.error ? "Không thể tải vai trò" : "Tất cả vai trò" },
    ...(roles.data ?? []).map((role) => ({ value: role.id, label: `${role.name} (${role.code})` })),
  ];
  return (
    <section className={styles.toolbar} aria-label="Bộ lọc tài khoản">
      <div className={styles.filters}>
        <CmsInput
          aria-label="Tìm kiếm tài khoản"
          containerClassName={styles.search}
          controlSize="sm"
          leadingIcon={<Search aria-hidden="true" size={17} />}
          onBlur={search.onBlur}
          onChange={(event) => search.onChange(event.target.value)}
          onFocus={search.onFocus}
          placeholder="Tìm theo tên hoặc email"
          type="search"
          value={search.draft}
        />
        <CmsSelect
          aria-label="Lọc theo trạng thái"
          containerClassName={styles.select}
          controlSize="sm"
          options={USER_STATUS_FILTER_OPTIONS}
          value={filters.status ?? ""}
          onChange={(event) => filters.setStatus(event.target.value === "ACTIVE" || event.target.value === "LOCKED" ? event.target.value : undefined)}
        />
        <CmsSelect
          aria-label="Lọc theo vai trò"
          containerClassName={styles.roleSelect}
          controlSize="sm"
          disabled={roles.isLoading || Boolean(roles.error)}
          options={roleOptions}
          value={filters.roleId ?? ""}
          onChange={(event) => filters.setRoleId(event.target.value || undefined)}
        />
        {filters.isFiltered ? <CmsButton type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa bộ lọc</CmsButton> : null}
      </div>
      {roles.error ? <p className={styles.error} role="alert">Không thể tải danh sách vai trò để lọc. <button type="button" onClick={() => roles.refetch()}>Thử lại</button></p> : null}
    </section>
  );
}
