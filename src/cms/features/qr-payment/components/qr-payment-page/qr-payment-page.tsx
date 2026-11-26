"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import type { SystemConfig } from "@/cms/features/system-configs/types";
import { useQrPayment } from "../../hooks/use-qr-payment";
import { QrPaymentCollection } from "../qr-payment-collection/qr-payment-collection";
import { QrPaymentModal } from "../qr-payment-modal/qr-payment-modal";
import styles from "./qr-payment-page.module.css";

type ModalState = { mode: "create" } | { mode: "edit"; config: SystemConfig };

export function QrPaymentPage() {
  const query = useQrPayment();
  const [modal, setModal] = useState<ModalState | null>(null);
  const items = query.data ?? [];
  const duplicate = items.length > 1;
  const canCreate = query.isSuccess && !query.isFetching && items.length === 0;
  const error = query.error?.message ?? (duplicate ? "Có nhiều cấu hình QR_PAYMENT. Hãy xử lý bản ghi trùng trong Cấu hình hệ thống." : undefined);
  const edit = useCallback((config: SystemConfig) => setModal({ mode: "edit", config }), []);
  return <CmsMain className={styles.main}>
    <header className={styles.heading}>
      <div><h1>QR thanh toán</h1><p>Quản lý thông tin chuyển khoản và mã QR thanh toán.</p></div>
      {canCreate ? <CmsButton className="cms-page-header-action" type="button" onClick={() => setModal({ mode: "create" })}><Plus aria-hidden="true" size={17} /> Thêm QR</CmsButton> : null}
    </header>
    <QrPaymentCollection items={items} loading={query.isLoading} error={error} onRetry={() => { void query.refetch(); }} onEdit={edit} />
    {modal ? <QrPaymentModal key={modal.mode === "edit" ? modal.config.id : "create"} config={modal.mode === "edit" ? modal.config : undefined}
      onClose={() => setModal(null)} onSaved={() => { setModal(null); void query.refetch(); }} onConflict={() => { void query.refetch(); }} /> : null}
  </CmsMain>;
}
