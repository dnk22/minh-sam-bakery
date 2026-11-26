"use client";

import { useMemo } from "react";
import { DataTable } from "@/cms/components/data-table/data-table";
import type { SystemConfig } from "@/cms/features/system-configs/types";
import { createQrPaymentColumns } from "../qr-payment-columns/qr-payment-columns";

export function QrPaymentCollection({ items, loading, error, onRetry, onEdit }: {
  items: SystemConfig[]; loading: boolean; error?: string; onRetry: () => void; onEdit: (config: SystemConfig) => void;
}) {
  const columns = useMemo(() => createQrPaymentColumns(onEdit), [onEdit]);
  return <DataTable<SystemConfig> data={items} columns={columns} getRowId={item => item.id}
    loading={loading} error={error} onRetry={onRetry} emptyState="Chưa có thông tin QR thanh toán." />;
}
