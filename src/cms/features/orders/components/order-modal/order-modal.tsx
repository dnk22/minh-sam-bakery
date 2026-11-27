"use client";
import { useCmsConfirm } from "@/cms/context/cms-confirm";


import { Check, CircleCheck, LoaderCircle, Ban } from "lucide-react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsButton } from "@/cms/components/ui/button";

import { getOrderStatusPresentation } from "../../constants";
import { useOrderMutations } from "../../hooks/use-order-mutations";
import { useOrderDetail } from "../../hooks/use-orders";
import { canPerformOrderAction, targetOrderStatus, ORDER_ACTION_CONFIG } from "../../lib/order-views";
import { shortOrderId } from "../../lib/order-format";
import type { OrderAction, OrderModalState, OrderView } from "../../types";
import { OrderDetail } from "../order-detail/order-detail";
import styles from "./order-modal.module.css";

export function OrderModal({ view, state, onStateChange }: {
  view: OrderView;
  state: OrderModalState;
  onStateChange: (state: OrderModalState) => void;
}) {
  const askConfirm = useCmsConfirm();
  const id = state?.id;
  const action = state?.section ?? "detail";
  const detail = useOrderDetail(id);
  const order = detail.data;
  const mutations = useOrderMutations();
  const availableActions = (["confirm", "complete", "reject"] as const).filter(next => order && canPerformOrderAction(view, order.status, next));
  const actionConfig = action === "detail" ? null : ORDER_ACTION_CONFIG[action];
  const allowed = action === "detail" || Boolean(order && canPerformOrderAction(view, order.status, action));
  const close = () => onStateChange(null);

  const updateStatus = async (nextAction: Exclude<OrderAction, "detail">) => {
    if (!order || !canPerformOrderAction(view, order.status, nextAction) || mutations.updateStatus.isPending) return;
    const next = targetOrderStatus(nextAction);
    const config = ORDER_ACTION_CONFIG[nextAction];
    if (!await askConfirm({ title: config.title, message: `Bạn chắc chắn muốn ${config.verb} đơn ${shortOrderId(order.id)} của ${order.fullName || order.phone}?`, confirmLabel: config.confirmLabel, destructive: config.destructive })) return;
    try {
      await mutations.updateStatus.mutateAsync({ id: order.id, status: next });
      onStateChange(null);
    } catch {
      await detail.refetch();
    }
  };

  const actionFooter = order && allowed && action !== "detail" ? <>
    <CmsButton type="button" variant="outline" disabled={mutations.updateStatus.isPending}
      onClick={() => onStateChange({ id: order.id, section: "detail" })}>Quay lại</CmsButton>
    <CmsButton type="button" variant={action === "reject" ? "destructive" : "default"}
      disabled={mutations.updateStatus.isPending} onClick={() => updateStatus(action)}>
      {mutations.updateStatus.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> :
        <OrderActionIcon action={action} />}
      {actionConfig?.confirmLabel}
    </CmsButton>
  </> : order && action === "detail" && availableActions.length > 0 ? <>
    {availableActions.map(next => <CmsButton key={next} type="button" variant={ORDER_ACTION_CONFIG[next].destructive ? "destructive" : "default"}
      disabled={mutations.updateStatus.isPending} onClick={() => onStateChange({ id: order.id, section: next })}>
      <OrderActionIcon action={next} /> {ORDER_ACTION_CONFIG[next].label}
    </CmsButton>)}
  </> : null;

  return <ResponsiveModal
    size="lg"
    description={action === "detail" ? "Thông tin mới nhất của đơn hàng." : "Xác nhận thay đổi trạng thái đơn hàng."}
    footer={actionFooter}
    onOpenChange={(open) => { if (!open && !mutations.updateStatus.isPending) close(); }}
    open={Boolean(state)}
    title={actionConfig?.title ?? "Chi tiết đơn hàng"}
  >
    {!state ? null
      : detail.isLoading ? <p className={styles.state}>Đang tải đơn hàng…</p>
      : detail.error ? <div className={styles.state} role="alert"><p>{detail.error instanceof Error ? detail.error.message : "Không thể tải đơn hàng."}</p><CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton></div>
      : !order ? <p className={styles.state}>Không tìm thấy đơn hàng.</p>
      : action !== "detail" && !allowed ? <div className={styles.state} role="alert">
        <p>Trạng thái đơn đã thay đổi, không thể thực hiện thao tác này.</p>
        <CmsButton type="button" variant="outline" onClick={() => { void detail.refetch(); onStateChange({ id: order.id, section: "detail" }); }}>Xem trạng thái mới</CmsButton>
      </div>
      : action !== "detail" ? <section className={styles.statusSection}>
        <div className={styles.current}><span>Trạng thái hiện tại</span><CmsBadge variant={getOrderStatusPresentation(order.status).variant}>{getOrderStatusPresentation(order.status).label}</CmsBadge></div>
        <p>Đơn sẽ chuyển sang <strong>{getOrderStatusPresentation(targetOrderStatus(action)).label}</strong>.</p>
        <p className={styles.note}>Hãy xác minh thông tin trước khi xác nhận. Backend sẽ kiểm tra tính hợp lệ của việc chuyển trạng thái.</p>
        {mutations.updateStatus.error ? <p className={styles.alert} role="alert">{mutations.updateStatus.error instanceof Error ? mutations.updateStatus.error.message : "Không thể cập nhật trạng thái."}</p> : null}
      </section> : <OrderDetail order={order} />}
  </ResponsiveModal>;
}

function OrderActionIcon({ action }: { action: Exclude<OrderAction, "detail"> }) {
  const Icon = action === "reject" ? Ban : action === "complete" ? CircleCheck : Check;
  return <Icon aria-hidden="true" size={16} />;
}
