"use client";
import { Check, ReceiptText } from "lucide-react";
import type { Order } from "@/lib/contracts/order/order.types";
import { formatVnd } from "@/landing/features/catalog/pricing";
import { CheckoutDialog } from "./checkout-dialog";

export function CheckoutSuccessModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return <CheckoutDialog title="Xác nhận đặt bánh" onClose={onClose}>
    <section className="flex flex-col items-center gap-3 py-space-lg text-center">
      <div className="flex size-20 items-center justify-center rounded-full border border-dashed border-secondary bg-secondary-container"><Check className="size-9 text-secondary" /></div>
      <h3 className="font-headline-sm text-headline-sm font-semibold text-primary">Đơn đặt bánh đã được ghi nhận</h3>
      <p className="font-body-sm text-on-surface-variant">Cửa hàng sẽ liên hệ xác nhận thông tin đơn hàng của quý khách.</p>
    </section>
    <section className="space-y-3 rounded-xl bg-surface-container-low p-4">
      <div className="flex items-center gap-2 font-semibold"><ReceiptText className="size-5 text-secondary" />Mã đơn hàng</div>
      <p className="break-all font-mono text-sm">{order.id}</p>
      <ul className="space-y-2 border-y border-outline-variant py-3">{order.items.map(item => <li key={item.id} className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0 flex-1 [overflow-wrap:anywhere]"><strong>{item.productName}</strong><p className="text-sm">{[item.size,item.style].filter(Boolean).join(" • ")} × {item.quantity}</p></div><strong className="min-w-0 max-w-[45%] text-right [overflow-wrap:anywhere]">{formatVnd(Number(item.lineTotal))}</strong></li>)}</ul>
      <dl className="space-y-2 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 [&>dd]:text-right"><dt>Hình thức nhận</dt><dd>{order.fulfillmentMethod === "PICKUP" ? "Tại cửa hàng" : "Giao tận nơi"}</dd></div>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 [&>dd]:text-right"><dt>Ngày nhận</dt><dd>{order.deliveryDate || "Chờ xác nhận"} {order.deliveryTime || ""}</dd></div>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 [&>dd]:text-right"><dt>Thanh toán</dt><dd>{order.paymentMethod === "AT_STORE" ? "Tại cửa hàng" : "Chuyển khoản (chưa xác minh)"}</dd></div>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 [&>dd]:text-right"><dt>Trạng thái đơn</dt><dd>{({PENDING_CONFIRMATION:"Chờ xác nhận",CONFIRMED:"Đã xác nhận",NEED_CALLBACK:"Cần liên hệ lại",REJECTED:"Đã từ chối",COMPLETED:"Hoàn thành"})[order.status]}</dd></div>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 [&>dd]:text-right border-t border-outline-variant pt-3"><dt>Tổng tiền đơn hàng</dt><dd className="font-price-serif text-lg font-bold text-primary">{formatVnd(Number(order.totalAmount))}</dd></div>
      </dl>
    </section>
    <button type="button" onClick={onClose} className="mt-space-md min-h-12 w-full rounded-lg bg-primary px-4 font-label-ui font-semibold text-on-primary">Hoàn tất &amp; quay lại</button>
  </CheckoutDialog>;
}
