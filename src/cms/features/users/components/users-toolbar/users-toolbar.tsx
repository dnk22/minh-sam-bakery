"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";

import { Search } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { CmsCombobox } from "@/cms/components/ui/combobox/combobox";
import { useRoleSelector } from "@/cms/features/roles/hooks/use-roles";

import { USER_STATUS_FILTER_OPTIONS } from "../../constants";
import type { UserFilters } from "../../hooks/use-user-filters";
import { countUserAdvancedFilters } from "../../lib/user-filter-data";
import styles from "./users-toolbar.module.css";

export function UsersToolbar({ filters, fetching }: { filters: UserFilters; fetching?: boolean }) {
  const draft = useToolbarDraft({ search: filters.search, status: filters.status, roleId: filters.roleId });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "", status: undefined, roleId: undefined }); filters.clearFilters(); };
  const clearAdvanced = () => { const next = { search: filters.search, status: undefined, roleId: undefined }; draft.reset(next); filters.applyFilters(next); };
  const roles = useRoleSelector();
  const roleOptions = [
    { value: "", label: roles.isLoading ? "Đang tải vai trò…" : roles.error ? "Không thể tải vai trò" : "Tất cả vai trò" },
    ...(roles.data ?? []).map((role) => ({ value: role.id, label: `${role.name} (${role.code})` })),
  ];
  const advancedCount = countUserAdvancedFilters(draft.values.status, draft.values.roleId);

  return <CmsToolbar fetching={fetching} label="Bộ lọc tài khoản" onSearch={apply} onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput aria-label="Tìm kiếm tài khoản" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} placeholder="Tìm theo tên hoặc email" type="search" value={draft.values.search} onChange={event => draft.set("search", event.target.value)} />}
    filters={<CmsFilterGroup layout="toolbar" activeCount={advancedCount} label="Bộ lọc tài khoản" onClear={clearAdvanced} onApply={apply}>
        <CmsSelect aria-label="Lọc theo trạng thái" containerClassName={styles.select} controlSize="sm" options={USER_STATUS_FILTER_OPTIONS} value={draft.values.status ?? ""} onChange={(event) => draft.set("status", event.target.value === "ACTIVE" || event.target.value === "LOCKED" ? event.target.value : undefined)} />
        <CmsCombobox aria-label="Lọc theo vai trò" containerClassName={styles.roleSelect} controlSize="sm" disabled={roles.isLoading || Boolean(roles.error)} options={roleOptions} value={draft.values.roleId ?? ""} onValueChange={(value) => draft.set("roleId", value || undefined)} />
      </CmsFilterGroup>}
    feedback={roles.error ? <p className={styles.error} role="alert">Không thể tải danh sách vai trò để lọc. <button type="button" onClick={() => roles.refetch()}>Thử lại</button></p> : null}
  />;
}
