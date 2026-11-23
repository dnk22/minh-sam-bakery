import { CreditCard, Store } from "lucide-react";
import type { ReactNode } from "react";

import type { CheckoutDraft, CheckoutErrors, PaymentMethod } from "../types";

export function CheckoutPaymentSection({ draft, errors, onUpdate }: {
  draft: CheckoutDraft;
  errors: CheckoutErrors;
  onUpdate: (patch: Partial<CheckoutDraft>) => void;
}) {
  const isDelivery = draft.fulfillmentMethod === "delivery";
  return (
    <section className="rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm" aria-labelledby="checkout-payment-heading">
      <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-payment-heading">
        3. Phương thức thanh toán
      </h2>
      <fieldset className="space-y-space-sm">
        <legend className="sr-only">Chọn phương thức thanh toán</legend>
        <PaymentOption
          value="BANK_TRANSFER"
          checked={draft.paymentMethod === "BANK_TRANSFER"}
          onChange={(paymentMethod) => onUpdate({ paymentMethod })}
          icon={<CreditCard className="size-5" />}
          label="Chuyển khoản ngân hàng"
          note="Thông tin chuyển khoản hiển thị sau khi đơn được tạo"
        />
        <PaymentOption
          value="AT_STORE"
          checked={draft.paymentMethod === "AT_STORE"}
          disabled={isDelivery}
          onChange={(paymentMethod) => onUpdate({ paymentMethod })}
          icon={<Store className="size-5" />}
          label="Thanh toán tại cửa hàng"
          note={isDelivery ? "Chỉ áp dụng khi nhận bánh tại cửa hàng" : "Thanh toán khi đến nhận bánh"}
        />
      </fieldset>
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
  note: string;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-space-sm rounded-lg border p-space-md ${checked ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
      <input
        checked={checked}
        className="mt-1 size-4 accent-primary"
        disabled={disabled}
        name="paymentMethod"
        onChange={() => onChange(value)}
        type="radio"
        value={value}
      />
      <span className="text-secondary">{icon}</span>
      <span>
        <strong className="block font-label-ui text-label-ui text-primary">{label}</strong>
        <small className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{note}</small>
      </span>
    </label>
  );
}
