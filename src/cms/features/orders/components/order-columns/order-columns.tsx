import type { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import { getOrderPaymentLabel, getOrderStatusPresentation } from "../../constants";
import { formatCalendarDate, formatOrderDateTime, formatVnd, shortOrderId } from "../../lib/order-format";
import type { Order } from "../../types";
import styles from "./order-columns.module.css";

export function createOrderColumns(onDetail: (order: Order) => void, onStatus: (order: Order) => void): ColumnDef<Order, unknown>[] {
  return [
    {
      accessorKey: "id",
      header: "Mã đơn",
      size: 130,
      cell: ({ row }) => <code className={styles.id} title={row.original.id}>{shortOrderId(row.original.id)}</code>,
    },
    {
      id: "customer",
      header: "Khách hàng",
      size: 190,
      cell: ({ row }) => <div className={styles.customer}><strong>{row.original.fullName || "Chưa cung cấp"}</strong><span>{row.original.phone}</span></div>,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      size: 130,
      cell: ({ row }) => { const status = getOrderStatusPresentation(row.original.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; },
    },
    {
      id: "delivery",
      header: "Giao hàng",
      size: 145,
      cell: ({ row }) => <div className={styles.stack}><span>{formatCalendarDate(row.original.deliveryDate)}</span><small>{row.original.deliveryTime || "Chưa có khung giờ"}</small></div>,
    },
    {
      accessorKey: "paymentMethod",
      header: "Thanh toán",
      size: 140,
      cell: ({ row }) => getOrderPaymentLabel(row.original.paymentMethod),
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      size: 140,
      cell: ({ row }) => <strong className={styles.money}>{formatVnd(row.original.totalAmount)}</strong>,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      size: 165,
      cell: ({ row }) => <time dateTime={row.original.createdAt}>{formatOrderDateTime(row.original.createdAt)}</time>,
    },
    {
      id: "actions",
      header: "Thao tác",
      size: 82,
      cell: ({ row }) => <CmsRowActions
        actions={[{ key: "status", label: "Cập nhật trạng thái", icon: <RefreshCw aria-hidden="true" size={15} />, onSelect: () => onStatus(row.original) }]}
        moreLabel={`Mở thao tác cho đơn ${row.original.id}`}
        onView={() => onDetail(row.original)}
        viewLabel={`Xem chi tiết đơn ${row.original.id}`}
      />,
    },
  ];
}
