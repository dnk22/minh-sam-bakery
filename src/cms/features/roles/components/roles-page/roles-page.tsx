"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useRoleFilters } from "../../hooks/use-role-filters";
import { useRoles } from "../../hooks/use-roles";
import type { Role, RoleModalState } from "../../types";
import { RoleDeleteDialog } from "../role-delete-dialog/role-delete-dialog";
import { RoleModal } from "../role-modal/role-modal";
import { RolesCollection } from "../roles-collection/roles-collection";
import { RolesToolbar } from "../roles-toolbar/roles-toolbar";
import styles from "./roles-page.module.css";

const PAGE_SIZE = 20;

export function RolesPage() {
  const filters = useRoleFilters();
  const [modal, setModal] = useState<RoleModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const listQuery = useRoles({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined });
  const openDetail = useCallback((role: Role) => setModal({ mode: "detail", id: role.id }), []);

  return (
    <CmsMain className={styles.main}>
      <header className={styles.heading}>
        <div><h1>Vai trò &amp; phân quyền</h1><p>Quản lý vai trò CMS và tập quyền được Backend cung cấp.</p></div>
        <CmsButton type="button" onClick={() => setModal({ mode: "create" })}><Plus aria-hidden="true" size={17} /> Thêm vai trò</CmsButton>
      </header>
      <RolesToolbar filters={filters} />
      <RolesCollection filters={filters} listQuery={listQuery} onDetail={openDetail} onDelete={setDeleteTarget} />
      <RoleModal state={modal} onStateChange={setModal} onDelete={setDeleteTarget} />
      <RoleDeleteDialog
        role={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          setDeleteTarget(null);
          setModal(null);
          if ((listQuery.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1);
        }}
      />
    </CmsMain>
  );
}
