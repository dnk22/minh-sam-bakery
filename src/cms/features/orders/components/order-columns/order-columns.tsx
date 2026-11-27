import type { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, CircleCheck } from "lucide-react";

import { CmsRowActions, type CmsRowAction } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import { getOrderPaymentLabel, getOrderStatusPresentation } from "../../constants";
import { canPerformOrderAction, ORDER_ACTION_CONFIG } from "../../lib/order-views";
import { formatCalendarDate, formatOrderDateTime, formatVnd, shortOrderId } from "../../lib/order-format";
import type { Order, OrderAction, OrderView } from "../../types";
import styles from "./order-columns.module.css";

export function createOrderColumns(
  view: OrderView,
  onDetail: (order: Order) => void,
  onAction: (order: Order, action: Exclude<OrderAction, "detail">) => void,
): ColumnDef<Order, unknown>[] {
  return [
    {
      accessorKey: "id", header: "Mã đơn", size: 130,
      cell: ({ row }) => <code className={styles.id} title={row.original.id}>{shortOrderId(row.original.id)}</code>,
    },
    {
      id: "customer", header: "Khách hàng", size: 190,
      cell: ({ row }) => <div className={styles.customer}><strong>{row.original.fullName || "Chưa cung cấp"}</strong><span>{row.original.phone}</span></div>,
    },
    {
      accessorKey: "status", header: "Trạng thái", size: 130,
      cell: ({ row }) => { const status = getOrderStatusPresentation(row.original.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; },
    },
    {
      id: "delivery", header: "Nhận hàng", size: 145,
      cell: ({ row }) => <div className={styles.stack}><span>{row.original.fulfillmentMethod === "PICKUP" ? "Tại cửa hàng" : "Giao tận nơi"}</span><span>{formatCalendarDate(row.original.deliveryDate)}</span><small>{row.original.deliveryTime || "Chưa có khung giờ"}</small></div>,
    },
    {
      accessorKey: "paymentMethod", header: "Thanh toán", size: 140,
      cell: ({ row }) => getOrderPaymentLabel(row.original.paymentMethod),
    },
    {
      accessorKey: "totalAmount", header: "Tổng tiền", size: 140,
      cell: ({ row }) => <strong className={styles.money}>{formatVnd(row.original.totalAmount)}</strong>,
    },
    {
      accessorKey: "createdAt", header: "Ngày tạo", size: 165,
      cell: ({ row }) => <time dateTime={row.original.createdAt}>{formatOrderDateTime(row.original.createdAt)}</time>,
    },
    {
      id: "actions", header: "Thao tác", size: 82,
      cell: ({ row }) => {
        const order = row.original;
        const actions: CmsRowAction[] = [];
        if (canPerformOrderAction(view, order.status, "confirm")) {
          actions.push({ key: "confirm", label: ORDER_ACTION_CONFIG.confirm.label, icon: <Check aria-hidden="true" size={15} />,
            onSelect: () => onAction(order, "confirm") });
        }
        if (canPerformOrderAction(view, order.status, "complete")) {
          actions.push({ key: "complete", label: ORDER_ACTION_CONFIG.complete.label, icon: <CircleCheck aria-hidden="true" size={15} />,
            onSelect: () => onAction(order, "complete") });
        }
        if (canPerformOrderAction(view, order.status, "reject")) {
          actions.push({ key: "reject", label: ORDER_ACTION_CONFIG.reject.label, destructive: true, separatorBefore: actions.length > 0,
            icon: <Ban aria-hidden="true" size={15} />, onSelect: () => onAction(order, "reject") });
        }
        return <CmsRowActions actions={actions} moreLabel={`Thao tác đơn ${order.id}`}
          onView={() => onDetail(order)} viewLabel={`Xem chi tiết đơn ${order.id}`} />;
      },
    },
  ];
}
