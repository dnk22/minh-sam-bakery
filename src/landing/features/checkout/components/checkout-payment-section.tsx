import { CreditCard, Store, AlertCircle, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import type { PaymentQrState } from "../hooks/use-payment-qr";
import type { CheckoutDraft, CheckoutErrors, PaymentMethod } from "../types";

export function CheckoutPaymentSection({ draft, errors, onUpdate, qrStatus }: {
  qrStatus: PaymentQrState["status"];
  draft: CheckoutDraft;
  errors: CheckoutErrors;
  onUpdate: (patch: Partial<CheckoutDraft>) => void;
}) {
  const isDelivery = draft.fulfillmentMethod === "delivery";
  return (
    <section className="min-w-0 rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm" aria-labelledby="checkout-payment-heading">
      <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-payment-heading">
        3. Phương thức thanh toán
      </h2>
      <fieldset className="grid min-w-0 grid-cols-1 gap-space-sm md:grid-cols-2">
        <legend className="sr-only">Chọn phương thức thanh toán</legend>
        <PaymentOption
          value="BANK_TRANSFER"
          checked={qrStatus === "ready" && draft.paymentMethod === "BANK_TRANSFER"}
          disabled={qrStatus !== "ready"}
          onChange={(paymentMethod) => onUpdate({ paymentMethod })}
          icon={<CreditCard className="size-5" />}
          label="Chuyển khoản ngân hàng"
          note={qrStatus === "ready" ? "Hiển thị QR trước khi xác nhận đặt hàng" : undefined}
        />
        <PaymentOption
          value="AT_STORE"
          checked={!isDelivery && draft.paymentMethod === "AT_STORE"}
          disabled={isDelivery}
          onChange={(paymentMethod) => onUpdate({ paymentMethod })}
          icon={<Store className="size-5" />}
          label="Thanh toán tại cửa hàng"
          note={isDelivery ? "Chỉ áp dụng khi nhận bánh tại cửa hàng" : "Thanh toán khi đến nhận bánh"}
        />
      </fieldset>
      {qrStatus === "loading" ? <p role="status" className="mt-3 flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant"><LoaderCircle aria-hidden="true" className="size-4 shrink-0 motion-safe:animate-spin" />Đang kiểm tra phương thức chuyển khoản...</p> : null}
      {qrStatus === "unavailable" ? <p role="status" className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 font-body-sm text-body-sm text-amber-800"><AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><span>Phương thức chuyển khoản ngân hàng hiện chưa có sẵn. {isDelivery ? "Vui lòng chọn nhận bánh tại cửa hàng hoặc quay lại sau." : "Bạn có thể thanh toán tại cửa hàng."}</span></p> : null}
      {errors.paymentMethod ? (
        <p className="mt-2 font-body-sm text-error" role="alert">{errors.paymentMethod}</p>
      ) : null}
    </section>
  );
}

function PaymentOption({ value, checked, disabled, onChange, icon, label, note }: {
  value: PaymentMethod;
  checked: boolean;
  disabled?: boolean;
  onChange: (paymentMethod: PaymentMethod) => void;
  icon: ReactNode;
  label: string;
  note?: string;
}) {
  return (
    <label className={`flex min-w-0 cursor-pointer items-start gap-space-sm rounded-lg border p-space-md ${checked ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
      <input
        checked={checked}
        className="mt-1 size-4 shrink-0 accent-primary"
        disabled={disabled}
        name="paymentMethod"
        onChange={() => onChange(value)}
        type="radio"
        value={value}
      />
      <span className="shrink-0 text-secondary">{icon}</span>
      <span className="min-w-0 [overflow-wrap:anywhere]">
        <strong className="block font-label-ui text-label-ui text-primary">{label}</strong>
        {note ? <small className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{note}</small> : null}
      </span>
    </label>
  );
}
