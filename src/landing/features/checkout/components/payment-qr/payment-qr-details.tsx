import type { QrPaymentConfig } from "@/lib/contracts/qr-payment/qr-payment.types";

export function PaymentQrDetails({ config }: { config: QrPaymentConfig }) {
  const entries = [["Ngân hàng", config.bankName], ["Chủ tài khoản", config.accountHolder], ["Số tài khoản", config.accountNumber], ...(config.bankBranch ? [["Chi nhánh", config.bankBranch]] : [])];
  return <dl className="space-y-2 font-body-sm text-body-sm">{entries.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3"><dt className="min-w-0 text-on-surface-variant">{label}</dt><dd className="min-w-0 [overflow-wrap:anywhere] text-right font-semibold">{value}</dd></div>)}</dl>;
}
