"use client";

import { Check, LoaderCircle, Ban } from "lucide-react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsButton } from "@/cms/components/ui/button";

import { getOrderStatusPresentation } from "../../constants";
import { useOrderMutations } from "../../hooks/use-order-mutations";
import { useOrderDetail } from "../../hooks/use-orders";
import { canPerformOrderAction, targetOrderStatus } from "../../lib/order-views";
import { shortOrderId } from "../../lib/order-format";
import type { OrderModalState, OrderView } from "../../types";
import { OrderDetail } from "../order-detail/order-detail";
import styles from "./order-modal.module.css";

export function OrderModal({ view, state, onStateChange }: {
  view: OrderView;
  state: OrderModalState;
  onStateChange: (state: OrderModalState) => void;
}) {
  const id = state?.id;
  const action = state?.section ?? "detail";
  const detail = useOrderDetail(id);
  const order = detail.data;
  const mutations = useOrderMutations();
  const canConfirm = Boolean(order && canPerformOrderAction(view, order.status, "confirm"));
  const canReject = Boolean(order && canPerformOrderAction(view, order.status, "reject"));
  const allowed = action === "detail" || Boolean(order && canPerformOrderAction(view, order.status, action));
  const close = () => onStateChange(null);

  const updateStatus = async (nextAction: "confirm" | "reject") => {
    if (!order || !canPerformOrderAction(view, order.status, nextAction) || mutations.updateStatus.isPending) return;
    const next = targetOrderStatus(nextAction);
    const label = nextAction === "confirm" ? "xác nhận" : "từ chối";
    if (!window.confirm(`Bạn chắc chắn muốn ${label} đơn ${shortOrderId(order.id)} của ${order.fullName || order.phone}?`)) return;
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
        action === "confirm" ? <Check aria-hidden="true" size={16} /> : <Ban aria-hidden="true" size={16} />}
      {action === "confirm" ? "Xác nhận đơn" : "Từ chối đơn"}
    </CmsButton>
  </> : order && action === "detail" && (canConfirm || canReject) ? <>
    {canConfirm ? <CmsButton type="button" onClick={() => onStateChange({ id: order.id, section: "confirm" })}>
      <Check aria-hidden="true" size={16} /> Xác nhận
    </CmsButton> : null}
    {canReject ? <CmsButton type="button" variant="destructive"
      onClick={() => onStateChange({ id: order.id, section: "reject" })}>
      <Ban aria-hidden="true" size={16} /> Từ chối
    </CmsButton> : null}
  </> : null;

  return <ResponsiveModal
    className={styles.modal}
    description={action === "detail" ? "Thông tin mới nhất của đơn hàng." : "Xác nhận thay đổi trạng thái đơn hàng."}
    footer={actionFooter}
    onOpenChange={(open) => { if (!open && !mutations.updateStatus.isPending) close(); }}
    open={Boolean(state)}
    title={action === "detail" ? "Chi tiết đơn hàng" : action === "confirm" ? "Xác nhận đơn hàng" : "Từ chối đơn hàng"}
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
