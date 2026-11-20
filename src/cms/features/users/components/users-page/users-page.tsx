"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { useCmsSessionUser } from "@/cms/context/cms-session-user";

import { useUserFilters } from "../../hooks/use-user-filters";
import { useUsers } from "../../hooks/use-users";
import type { CmsUser, UserAction, UserModalState } from "../../types";
import { UserActionDialog, type UserActionTarget } from "../user-action-dialog/user-action-dialog";
import { UserModal } from "../user-modal/user-modal";
import { UsersCollection } from "../users-collection/users-collection";
import { UsersToolbar } from "../users-toolbar/users-toolbar";
import styles from "./users-page.module.css";

const PAGE_SIZE = 20;

export function UsersPage() {
  const currentUserId = useCmsSessionUser().id;
  const filters = useUserFilters();
  const [modal, setModal] = useState<UserModalState>(null);
  const [actionTarget, setActionTarget] = useState<UserActionTarget>(null);
  const listQuery = useUsers({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined, status: filters.status, roleId: filters.roleId });
  const openDetail = useCallback((user: CmsUser) => setModal({ mode: "detail", id: user.id }), []);
  const openAssignRole = useCallback((user: CmsUser) => setModal({ mode: "detail", id: user.id, section: "role" }), []);
  const openAction = useCallback((user: CmsUser, action: UserAction) => setActionTarget({ user, action }), []);
  const collectionActions = useMemo(() => ({ currentUserId, onDetail: openDetail, onAssignRole: openAssignRole, onAction: openAction }), [currentUserId, openAction, openAssignRole, openDetail]);

  return <CmsMain className={styles.main}>
    <header className={styles.heading}>
      <div><h1>Tài khoản</h1><p>Quản lý tài khoản CMS, vai trò và trạng thái truy cập.</p></div>
      <CmsButton type="button" onClick={() => setModal({ mode: "create" })}><Plus aria-hidden="true" size={17} /> Thêm tài khoản</CmsButton>
    </header>
    <UsersToolbar filters={filters} />
    <UsersCollection filters={filters} listQuery={listQuery} {...collectionActions} />
    <UserModal state={modal} currentUserId={currentUserId} onStateChange={setModal} onAction={openAction} />
    <UserActionDialog
      currentUserId={currentUserId}
      target={actionTarget}
      onClose={() => setActionTarget(null)}
      onCompleted={(action) => {
        setActionTarget(null);
        if (action === "delete") {
          setModal(null);
          if ((listQuery.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1);
        }
      }}
    />
  </CmsMain>;
}
