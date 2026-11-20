"use client";

import { useMemo } from "react";

import { CmsButton } from "@/cms/components/ui/button";

import { groupPermissions } from "../../lib/role-data";
import type { Permission } from "../../types";
import styles from "./role-permissions-editor.module.css";

export function RolePermissionsEditor({
  catalog,
  selectedIds,
  onChange,
  disabled = false,
  loading = false,
  error,
  readOnly = false,
  onRetry,
}: {
  catalog?: Permission[];
  selectedIds: readonly string[];
  onChange?: (ids: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  readOnly?: boolean;
  onRetry?: () => void;
}) {
  const groups = useMemo(() => groupPermissions(catalog ?? []), [catalog]);
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  if (loading) return <div className={styles.state}>Đang tải danh mục quyền…</div>;
  if (error) return <div className={styles.state} role="alert"><p>{error}</p>{onRetry ? <CmsButton type="button" variant="outline" size="sm" onClick={onRetry}>Thử lại</CmsButton> : null}</div>;
  if (!groups.length) return <div className={styles.state}>{readOnly ? "Vai trò chưa được gán quyền nào." : "Danh mục quyền hiện đang trống."}</div>;

  const update = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id); else next.delete(id);
    onChange?.([...next]);
  };
  const updateGroup = (ids: string[], checked: boolean) => {
    const next = new Set(selected);
    ids.forEach((id) => checked ? next.add(id) : next.delete(id));
    onChange?.([...next]);
  };

  return (
    <div className={styles.editor}>
      {!readOnly ? <p className={styles.summary}>Đã chọn <strong>{selected.size}</strong> / {catalog?.length ?? 0} quyền.</p> : null}
      <div className={styles.groups}>
        {groups.map((group) => {
          const ids = group.permissions.map((permission) => permission.id);
          const selectedCount = ids.filter((id) => selected.has(id)).length;
          return (
            <section className={styles.group} key={group.module}>
              <header className={styles.groupHeader}>
                <div><h3>{group.module}</h3><span>{selectedCount}/{ids.length} quyền</span></div>
                {!readOnly ? (
                  <label className={styles.selectAll}>
                    <input
                      checked={selectedCount === ids.length && ids.length > 0}
                      disabled={disabled}
                      onChange={(event) => updateGroup(ids, event.target.checked)}
                      type="checkbox"
                    />
                    Chọn cả nhóm
                  </label>
                ) : null}
              </header>
              <div className={styles.permissions}>
                {group.permissions.map((permission) => {
                  const checked = selected.has(permission.id);
                  if (readOnly && !checked) return null;
                  return (
                    <label className={styles.permission} data-read-only={readOnly || undefined} key={permission.id}>
                      {!readOnly ? <input checked={checked} disabled={disabled} onChange={(event) => update(permission.id, event.target.checked)} type="checkbox" /> : null}
                      <span>
                        <strong>{permission.action}</strong>
                        <code>{permission.code}</code>
                        {permission.description ? <small>{permission.description}</small> : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
