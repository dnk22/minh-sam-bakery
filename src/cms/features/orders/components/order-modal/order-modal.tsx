"use client";

import { LoaderCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";

import { getOrderStatusPresentation, ORDER_STATUS_OPTIONS } from "../../constants";
import { useOrderMutations } from "../../hooks/use-order-mutations";
import { useOrderDetail } from "../../hooks/use-orders";
import { canUpdateOrderStatus } from "../../lib/order-data";
import { shortOrderId } from "../../lib/order-format";
import type { OrderModalState, OrderStatus } from "../../types";
import { OrderDetail } from "../order-detail/order-detail";
import styles from "./order-modal.module.css";

export function OrderModal({ state, onStateChange }: {
  state: OrderModalState;
  onStateChange: (state: OrderModalState) => void;
}) {
  const id = state?.id;
  const section = state?.section ?? "detail";
  const detail = useOrderDetail(id);
  const order = detail.data;
  const mutations = useOrderMutations();
  const selectionSession = state && section === "status" ? `${state.id}:${order ? "ready" : "pending"}` : "closed";
  const [selection, setSelection] = useState<{ session: string; value: OrderStatus }>({ session: "closed", value: "PENDING_CONFIRMATION" });
  if (selection.session !== selectionSession) setSelection({ session: selectionSession, value: order?.status ?? "PENDING_CONFIRMATION" });
  const selectedStatus = selection.session === selectionSession ? selection.value : order?.status ?? "PENDING_CONFIRMATION";
  const dirty = Boolean(order && section === "status" && canUpdateOrderStatus(order.status, selectedStatus));
  useUnsavedChangesWarning(dirty, "Bỏ lựa chọn trạng thái chưa lưu?");

  const confirmDiscard = () => !dirty || window.confirm("Bỏ lựa chọn trạng thái chưa lưu?");
  const close = () => onStateChange(null);
  const showDetail = () => { if (confirmDiscard() && id) onStateChange({ id, section: "detail" }); };
  const submitStatus = async () => {
    if (!order || !dirty || mutations.updateStatus.isPending) return;
    const current = getOrderStatusPresentation(order.status).label;
    const next = getOrderStatusPresentation(selectedStatus).label;
    const customer = order.fullName || order.phone;
    const highImpact = selectedStatus === "REJECTED" || selectedStatus === "COMPLETED"
      ? "\nĐây là thay đổi quan trọng. Hãy kiểm tra kỹ trước khi tiếp tục."
      : "";
    if (!window.confirm(`Cập nhật đơn ${shortOrderId(order.id)} của ${customer}: ${current} → ${next}?${highImpact}`)) return;
    try {
      await mutations.updateStatus.mutateAsync({ id: order.id, status: selectedStatus });
      onStateChange({ id: order.id, section: "detail" });
    } catch {
      await detail.refetch();
    }
  };

  const footer = !state || !order ? null : section === "status" ? <>
    <CmsButton type="button" variant="outline" disabled={mutations.updateStatus.isPending} onClick={showDetail}>Quay lại</CmsButton>
    <CmsButton type="button" disabled={!dirty || mutations.updateStatus.isPending} onClick={submitStatus}>
      {mutations.updateStatus.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}
      Xác nhận trạng thái
    </CmsButton>
  </> : <CmsButton type="button" onClick={() => { mutations.updateStatus.reset(); onStateChange({ id: order.id, section: "status" }); }}>
    <RefreshCw aria-hidden="true" size={16} /> Cập nhật trạng thái
  </CmsButton>;

  return <ResponsiveModal
    className={styles.modal}
    description={section === "status" ? "Chỉ trạng thái được cập nhật; Backend quyết định chuyển đổi có hợp lệ hay không." : "Thông tin mới nhất được tải từ Backend khi mở đơn hàng."}
    footer={footer}
    onBeforeClose={confirmDiscard}
    onOpenChange={(open) => { if (!open) close(); }}
    open={Boolean(state)}
    title={section === "status" ? "Cập nhật trạng thái" : "Chi tiết đơn hàng"}
  >
    {!state ? null : detail.isLoading ? <p className={styles.state}>Đang tải đơn hàng…</p>
      : detail.error ? <div className={styles.state} role="alert"><p>{detail.error instanceof Error ? detail.error.message : "Không thể tải đơn hàng."}</p><CmsButton type="button" variant="outline" onClick={() => detail.refetch()}>Thử lại</CmsButton></div>
      : !order ? <p className={styles.state}>Không tìm thấy đơn hàng.</p>
      : section === "status" ? <section className={styles.statusSection}>
        <div className={styles.current}><span>Trạng thái hiện tại</span><CmsBadge variant={getOrderStatusPresentation(order.status).variant}>{getOrderStatusPresentation(order.status).label}</CmsBadge></div>
        <CmsFormField htmlFor="order-next-status" label="Trạng thái mới" required>
          <CmsSelect id="order-next-status" options={ORDER_STATUS_OPTIONS} value={selectedStatus} onChange={(event) => setSelection((current) => ({ ...current, value: event.target.value as OrderStatus }))} />
        </CmsFormField>
        <p className={styles.note}>Không có ma trận chuyển trạng thái trong OpenAPI. Nếu Backend từ chối, CMS sẽ tải lại trạng thái hiện tại và giữ lựa chọn để bạn kiểm tra.</p>
        {mutations.updateStatus.error ? <p className={styles.alert} role="alert">{mutations.updateStatus.error instanceof Error ? mutations.updateStatus.error.message : "Không thể cập nhật trạng thái."}</p> : null}
      </section> : <OrderDetail order={order} />}
  </ResponsiveModal>;
}
