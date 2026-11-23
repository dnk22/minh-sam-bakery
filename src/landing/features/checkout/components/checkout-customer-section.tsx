import type { CheckoutDraft, CheckoutErrors } from "../types";
import { CheckoutField, checkoutInputStyles } from "./checkout-field";

export function CheckoutCustomerSection({ draft, errors, onUpdate }: {
  draft: CheckoutDraft;
  errors: CheckoutErrors;
  onUpdate: (patch: Partial<CheckoutDraft>) => void;
}) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm" aria-labelledby="checkout-contact-heading">
      <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-contact-heading">
        1. Thông tin khách hàng
      </h2>
      <div className="grid gap-space-md sm:grid-cols-2">
        <CheckoutField error={errors.fullName} field="fullName" label="Họ và tên" required>
          <input
            autoComplete="name"
            className={checkoutInputStyles}
            data-checkout-field="fullName"
            maxLength={100}
            onChange={(event) => onUpdate({ fullName: event.target.value })}
            placeholder="Nhập họ và tên"
            value={draft.fullName}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "checkout-fullName-error" : undefined}
          />
        </CheckoutField>
        <CheckoutField error={errors.phone} field="phone" label="Số điện thoại" required>
          <input
            autoComplete="tel"
            className={checkoutInputStyles}
            data-checkout-field="phone"
            maxLength={20}
            onChange={(event) => onUpdate({ phone: event.target.value })}
            placeholder="Số điện thoại nhận hàng"
            type="tel"
            value={draft.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
          />
        </CheckoutField>
        <div className="sm:col-span-2">
          <CheckoutField error={errors.email} field="email" label="Email (không bắt buộc)">
            <input
              autoComplete="email"
              className={checkoutInputStyles}
              data-checkout-field="email"
              maxLength={150}
              onChange={(event) => onUpdate({ email: event.target.value })}
              placeholder="Email nhận thông tin đơn hàng"
              type="email"
              value={draft.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "checkout-email-error" : undefined}
            />
          </CheckoutField>
        </div>
      </div>
    </section>
  );
}
