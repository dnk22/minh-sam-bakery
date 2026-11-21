"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";

import { getOrderStatusPresentation } from "../../constants";
import type { OrderFilters } from "../../hooks/use-order-filters";
import { formatCalendarDate, formatVnd, shortOrderId } from "../../lib/order-format";
import type { Order, OrderList } from "../../types";
import { createOrderColumns } from "../order-columns/order-columns";
import styles from "./orders-collection.module.css";

export function OrdersCollection({ filters, listQuery, onDetail, onStatus }: {
  filters: OrderFilters;
  listQuery: UseQueryResult<OrderList, Error>;
  onDetail: (order: Order) => void;
  onStatus: (order: Order) => void;
}) {
  const columns = useMemo(() => createOrderColumns(onDetail, onStatus), [onDetail, onStatus]);
  const list = listQuery.data;
  return <ResponsiveCollection<Order>
    className={styles.table}
    columns={columns}
    data={list?.items ?? []}
    emptyState="Chưa có đơn hàng nào."
    error={listQuery.error instanceof Error ? listQuery.error.message : undefined}
    filteredEmptyState="Không có đơn hàng phù hợp với bộ lọc."
    getItemKey={(item) => item.id}
    getItemLabel={(item) => `Xem đơn hàng ${item.id}`}
    getRowId={(item) => item.id}
    isFiltered={filters.isFiltered}
    loading={listQuery.isLoading}
    onItemClick={onDetail}
    onRetry={() => listQuery.refetch()}
    pagination={list ? { meta: list.pagination, onPageChange: filters.setPage } : undefined}
    renderAccessory={(item) => { const status = getOrderStatusPresentation(item.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; }}
    renderItem={(item) => <OrderListItem order={item} />}
  />;
}

function OrderListItem({ order }: { order: Order }) {
  return <div className={styles.item}>
    <div className={styles.itemHeading}><strong>{order.fullName || "Chưa cung cấp tên"}</strong><code title={order.id}>{shortOrderId(order.id)}</code></div>
    <span>{order.phone} · {formatCalendarDate(order.deliveryDate)}{order.deliveryTime ? ` · ${order.deliveryTime}` : ""}</span>
    <b>{formatVnd(order.totalAmount)}</b>
  </div>;
}
