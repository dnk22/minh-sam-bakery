import { ArrowRight, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";

import { routes } from "@/landing/lib/routes";

import { occasionLabel, quantityLabel, type QuotationProductContext, type QuotationReceipt } from "../types";

export function QuotationSuccessDrawer({ dialogRef, onClose, product, receipt }: { dialogRef: RefObject<HTMLElement | null>; onClose: () => void; product: QuotationProductContext; receipt: QuotationReceipt }) {
  return (
    <aside aria-labelledby="quotation-success-title" aria-modal="true" className="fixed top-0 right-0 bottom-0 z-[71] flex h-dvh w-full max-w-md flex-col overflow-y-auto border-l border-secondary-container bg-surface shadow-2xl sm:w-[480px]" ref={dialogRef} role="dialog">
      <div className="flex w-full shrink-0 items-center justify-between border-b border-outline-variant/30 p-6"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Xác nhận đăng ký tư vấn</span><button aria-label="Đóng hộp thoại" className="flex size-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-autofocus onClick={onClose} type="button"><X aria-hidden="true" className="size-[22px]" /></button></div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center sm:px-8">
        <div className="relative mb-5 flex items-center justify-center"><div className="flex size-20 items-center justify-center rounded-full border border-secondary/30 bg-secondary-container/40 shadow-inner"><div className="flex size-14 items-center justify-center rounded-full border border-secondary/40 bg-surface-container-low shadow-sm"><CheckCircle2 aria-hidden="true" className="size-9 text-secondary" /></div></div></div>
        <h2 className="mb-3 font-headline-sm text-headline-sm font-bold tracking-tight text-primary" id="quotation-success-title">Yêu cầu báo giá đã được xác nhận trong bản xem trước</h2>
        <p className="mb-6 max-w-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">Mã bên dưới chỉ xác nhận luồng demo trên thiết bị này. Thông tin chưa được gửi tới Minh Sâm vì hệ thống tiếp nhận production chưa được kết nối.</p>
        <div className="mb-6 w-full rounded-lg border border-secondary-container/60 bg-surface-container-lowest p-4 text-left shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-outline-variant/30 pb-2"><span className="font-label-eyebrow text-[11px] font-bold uppercase tracking-wider text-secondary">Thông tin yêu cầu</span><span className="break-all text-right font-label-ui text-body-sm font-semibold text-primary">{receipt.referenceId}</span></div>
          <dl className="flex flex-col gap-2 font-body-sm text-body-sm">
            <SummaryRow label="Sản phẩm" value={product.name} prominent />
            <SummaryRow label="Số lượng dự kiến" value={quantityLabel(receipt.request.quantityRange)} />
            <SummaryRow label="Dịp tặng" value={occasionLabel(receipt.request.occasion)} />
            <SummaryRow label="Người liên hệ" value={`${receipt.request.contactName} • ${receipt.request.phone}`} />
          </dl>
        </div>
        <div className="flex w-full flex-col gap-3"><button className="flex w-full items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 font-label-ui text-label-ui font-bold uppercase tracking-wider text-on-primary shadow-md transition-all hover:bg-primary active:scale-[0.99]" onClick={onClose} type="button">HOÀN TẤT &amp; QUAY LẠI</button><Link className="inline-flex w-full items-center justify-center gap-1 py-2 font-label-ui text-body-sm font-medium text-primary transition-colors hover:text-secondary" href={routes.category("qua-tang")} onClick={onClose}>Khám phá thêm các bộ quà khác <ArrowRight aria-hidden="true" className="size-4" /></Link></div>
      </div>
      <div className="shrink-0 border-t border-outline-variant/30 bg-surface-container-low/50 p-6 text-center"><p className="font-body-sm text-[12px] leading-relaxed text-on-surface-variant">Cần hỗ trợ? Gọi Minh Sâm: <a className="font-semibold text-secondary hover:underline" href="tel:+840974231998">+84 (0) 974 231 998</a></p></div>
    </aside>
  );
}

function SummaryRow({ label, prominent = false, value }: { label: string; prominent?: boolean; value: string }) {
  return <div className="flex items-start justify-between gap-2"><dt className="shrink-0 text-on-surface-variant">{label}:</dt><dd className={`break-words text-right font-medium ${prominent ? "text-primary" : "text-on-surface"}`}>{value}</dd></div>;
}
