"use client";

import { RefreshCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useOrderFilters } from "../../hooks/use-order-filters";
import { useOrders } from "../../hooks/use-orders";
import { ORDER_VIEW_CONFIG } from "../../lib/order-views";
import { clearLinkedOrderId, getLinkedOrderId } from "../../lib/order-data";
import type { Order, OrderAction, OrderModalState, OrderView } from "../../types";
import { OrderModal } from "../order-modal/order-modal";
import { OrdersCollection } from "../orders-collection/orders-collection";
import { OrdersToolbar } from "../orders-toolbar/orders-toolbar";
import styles from "./orders-page.module.css";

const PAGE_SIZE = 20;
type ModalSession = { key: string; value: OrderModalState };

export function OrdersPage({ view }: { view: OrderView }) {
  const config = ORDER_VIEW_CONFIG[view];
  const filters = useOrderFilters();
  const pathname = usePathname();
  const router = useRouter();
  const serializedParams = useSearchParams().toString();
  const linkedOrderId = getLinkedOrderId(new URLSearchParams(serializedParams));
  const sessionKey = linkedOrderId ? `link:${linkedOrderId}` : "default";
  const [modalSession, setModalSession] = useState<ModalSession>({ key: "default", value: null });

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

  const listQuery = useOrders(view, {
    page: filters.page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    deliveryDate: filters.deliveryDate,
    deliveryTime: filters.deliveryTime || undefined,
  });
  const openDetail = useCallback((order: Order) => changeModal({ id: order.id, section: "detail" }), [changeModal]);
  const openAction = useCallback((order: Order, action: Exclude<OrderAction, "detail">) =>
    changeModal({ id: order.id, section: action }), [changeModal]);
  const currentPage = filters.page;
  const setPage = filters.setPage;

  useEffect(() => {
    const totalPages = listQuery.data?.pagination.totalPages;
    if (!listQuery.isPlaceholderData && !listQuery.isError &&
      totalPages !== undefined && currentPage > Math.max(1, totalPages)) {
      setPage(Math.max(1, totalPages));
    }
  }, [currentPage, listQuery.data?.pagination.totalPages, listQuery.isPlaceholderData, listQuery.isError, setPage]);

  return <CmsMain className={styles.main}>
    <header className={styles.heading}>
      <div><h1>{config.title}</h1><p>{config.description}</p></div>
      <CmsButton className="cms-page-header-action" type="button" variant="outline" disabled={listQuery.isFetching} onClick={() => listQuery.refetch()}>
        <RefreshCw aria-hidden="true" size={17} /> {listQuery.isFetching ? "Đang tải…" : "Làm mới"}
      </CmsButton>
    </header>
    <OrdersToolbar filters={filters} fetching={listQuery.isFetching} />
    <OrdersCollection view={view} filters={filters} listQuery={listQuery} onDetail={openDetail} onAction={openAction} />
    <OrderModal key={modal?.id ?? "closed"} view={view} state={modal} onStateChange={changeModal} />
  </CmsMain>;
}
