import { CreditCard, Clock3 } from "lucide-react";

export function PaymentQrUnavailable({ onClose }: { onClose: () => void }) {
  return <div className="mt-space-md flex flex-col items-center gap-3 rounded-xl bg-surface-container-low px-4 py-8 text-center" role="status">
    <div aria-hidden="true" className="relative mb-2 flex size-28 items-center justify-center rounded-full bg-secondary-container/40">
      <span className="absolute -left-2 top-5 size-3 rounded-full bg-secondary/30" />
      <span className="absolute -right-1 bottom-4 size-4 rounded-full bg-secondary/20" />
      <CreditCard className="size-16 -rotate-12 text-primary" strokeWidth={1.2} />
      <span className="absolute bottom-2 right-1 rounded-full bg-surface-container-lowest p-2 shadow-sm"><Clock3 className="size-8 text-secondary" strokeWidth={1.5} /></span>
    </div>
    <h3 className="font-headline-sm text-headline-sm text-primary">Thông tin thanh toán chưa khả dụng</h3>
    <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">Minh Sâm xin lỗi, hiện tại thông tin thanh toán chuyển khoản chưa có sẵn. Vui lòng quay lại sau.</p>
    <button type="button" onClick={onClose} className="mt-2 min-h-11 w-full rounded-lg bg-primary px-4 font-label-ui text-on-primary">Quay lại</button>
  </div>;
}
