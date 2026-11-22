"use client";

import { RefreshCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useOrderFilters } from "../../hooks/use-order-filters";
import { useOrders } from "../../hooks/use-orders";
import { clearLinkedOrderId, getLinkedOrderId } from "../../lib/order-data";
import type { Order, OrderModalState } from "../../types";
import { OrderModal } from "../order-modal/order-modal";
import { OrdersCollection } from "../orders-collection/orders-collection";
import { OrdersToolbar } from "../orders-toolbar/orders-toolbar";
import styles from "./orders-page.module.css";

const PAGE_SIZE = 20;

type ModalSession = { key: string; value: OrderModalState };

export function OrdersPage() {
  const filters = useOrderFilters();
  const pathname = usePathname();
  const router = useRouter();
  const serializedParams = useSearchParams().toString();
  const linkedOrderId = getLinkedOrderId(new URLSearchParams(serializedParams));
  const sessionKey = linkedOrderId ? `link:${linkedOrderId}` : "default";
  const [modalSession, setModalSession] = useState<ModalSession>({ key: "default", value: null });

  // The URL can open an order directly, even when it is not on the current list page.
  const modal: OrderModalState = modalSession.key === sessionKey
    ? modalSession.value
    : linkedOrderId ? { id: linkedOrderId, section: "detail" } : null;

  const changeModal = useCallback((next: OrderModalState) => {
    const leavingDeepLink = Boolean(linkedOrderId && (!next || next.id !== linkedOrderId));
    setModalSession({ key: leavingDeepLink ? "default" : sessionKey, value: next });

    if (leavingDeepLink) {
      const nextQuery = clearLinkedOrderId(new URLSearchParams(serializedParams)).toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [linkedOrderId, pathname, router, serializedParams, sessionKey]);

  const listQuery = useOrders({
    page: filters.page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    statuses: filters.statuses,
    deliveryDate: filters.deliveryDate,
    deliveryTime: filters.deliveryTime || undefined,
    sortCreated: filters.sortCreated,
  });
  const openDetail = useCallback((order: Order) => changeModal({ id: order.id, section: "detail" }), [changeModal]);
  const openStatus = useCallback((order: Order) => changeModal({ id: order.id, section: "status" }), [changeModal]);
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
      <div><h1>Đơn hàng</h1><p>Rà soát thông tin và cập nhật trạng thái đơn hàng.</p></div>
      <CmsButton type="button" variant="outline" disabled={listQuery.isFetching} onClick={() => listQuery.refetch()}>
        <RefreshCw aria-hidden="true" size={17} /> {listQuery.isFetching ? "Đang tải…" : "Làm mới"}
      </CmsButton>
    </header>
    <OrdersToolbar filters={filters} />
    <OrdersCollection filters={filters} listQuery={listQuery} onDetail={openDetail} onStatus={openStatus} />
    <OrderModal key={modal?.id ?? "closed"} state={modal} onStateChange={changeModal} />
  </CmsMain>;
}
