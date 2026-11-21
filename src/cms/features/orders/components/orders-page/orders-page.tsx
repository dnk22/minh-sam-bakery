"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useOrderFilters } from "../../hooks/use-order-filters";
import { useOrders } from "../../hooks/use-orders";
import type { Order, OrderModalState } from "../../types";
import { OrderModal } from "../order-modal/order-modal";
import { OrdersCollection } from "../orders-collection/orders-collection";
import { OrdersToolbar } from "../orders-toolbar/orders-toolbar";
import styles from "./orders-page.module.css";

const PAGE_SIZE = 20;

export function OrdersPage() {
  const filters = useOrderFilters();
  const [modal, setModal] = useState<OrderModalState>(null);
  const listQuery = useOrders({
    page: filters.page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    statuses: filters.statuses,
    deliveryDate: filters.deliveryDate,
    deliveryTime: filters.deliveryTime || undefined,
    sortCreated: filters.sortCreated,
  });
  const openDetail = useCallback((order: Order) => setModal({ id: order.id, section: "detail" }), []);
  const openStatus = useCallback((order: Order) => setModal({ id: order.id, section: "status" }), []);
  const currentPage = filters.page;
  const setPage = filters.setPage;

  useEffect(() => {
    const totalPages = listQuery.data?.pagination.totalPages;
    if (!listQuery.isPlaceholderData && totalPages !== undefined && currentPage > Math.max(1, totalPages)) {
      setPage(Math.max(1, totalPages));
    }
  }, [currentPage, listQuery.data?.pagination.totalPages, listQuery.isPlaceholderData, setPage]);

  return <CmsMain className={styles.main}>
    <header className={styles.heading}>
      <div><h1>Đơn hàng</h1><p>Rà soát thông tin và xử lý trạng thái đơn hàng từ Backend.</p></div>
      <CmsButton type="button" variant="outline" disabled={listQuery.isFetching} onClick={() => listQuery.refetch()}>
        <RefreshCw aria-hidden="true" size={17} /> {listQuery.isFetching ? "Đang tải…" : "Làm mới"}
      </CmsButton>
    </header>
    <OrdersToolbar filters={filters} />
    <OrdersCollection filters={filters} listQuery={listQuery} onDetail={openDetail} onStatus={openStatus} />
    <OrderModal key={modal?.id ?? "closed"} state={modal} onStateChange={setModal} />
  </CmsMain>;
}
