"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useSystemConfigFilters } from "../../hooks/use-system-config-filters";
import { useSystemConfigs } from "../../hooks/use-system-configs";
import type { SystemConfig, SystemConfigModalState } from "../../types";
import { SystemConfigDeleteDialog } from "../system-config-delete-dialog/system-config-delete-dialog";
import { SystemConfigModal } from "../system-config-modal/system-config-modal";
import { SystemConfigsCollection } from "../system-configs-collection/system-configs-collection";
import { SystemConfigsToolbar } from "../system-configs-toolbar/system-configs-toolbar";
import styles from "./system-configs-page.module.css";

const PAGE_SIZE = 20;

export function SystemConfigsPage() {
  const filters = useSystemConfigFilters();
  const [modal, setModal] = useState<SystemConfigModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<SystemConfig | null>(null);
  const listQuery = useSystemConfigs({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined });
  const openDetail = useCallback((config: SystemConfig) => setModal({ mode: "detail", id: config.id }), []);
  return (
    <CmsMain className={styles.main}>
      <header className={styles.heading}>
        <div><h1>Cấu hình hệ thống</h1><p>Quản lý các giá trị cấu hình dùng chung của hệ thống.</p></div>
        <CmsButton className="cms-page-header-action" type="button" onClick={() => setModal({ mode: "create" })}><Plus aria-hidden="true" size={17} /> Thêm cấu hình</CmsButton>
      </header>
      <SystemConfigsToolbar filters={filters} />
      <SystemConfigsCollection filters={filters} listQuery={listQuery} onDetail={openDetail} onDelete={setDeleteTarget} />
      <SystemConfigModal state={modal} onStateChange={setModal} onDelete={setDeleteTarget} />
      <SystemConfigDeleteDialog config={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={() => {
        setDeleteTarget(null); setModal(null);
        if ((listQuery.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1);
      }} />
    </CmsMain>
  );
}
