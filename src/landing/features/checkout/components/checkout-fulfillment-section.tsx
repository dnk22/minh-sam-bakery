import { CalendarDays, MapPin, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";

import type { CheckoutDraft, CheckoutErrors, FulfillmentMethod } from "../types";
import { CheckoutField, checkoutInputStyles } from "./checkout-field";

export function CheckoutFulfillmentSection({ draft, errors, today, onUpdate, onFulfillmentChange }: {
  draft: CheckoutDraft;
  errors: CheckoutErrors;
  today: string;
  onUpdate: (patch: Partial<CheckoutDraft>) => void;
  onFulfillmentChange: (method: FulfillmentMethod) => void;
}) {
  const isDelivery = draft.fulfillmentMethod === "delivery";

  return (
    <section className="rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm" aria-labelledby="checkout-fulfillment-heading">
      <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-fulfillment-heading">
        2. Hình thức nhận bánh
      </h2>
      <fieldset className="grid gap-space-sm sm:grid-cols-2">
        <legend className="sr-only">Hình thức nhận hàng</legend>
        <FulfillmentOption
          method="pickup"
          selected={!isDelivery}
          onChange={onFulfillmentChange}
          icon={<Store className="size-6" />}
          title="Nhận tại cửa hàng"
          description="Đến nhận bánh tại Minh Sâm"
        />
        <FulfillmentOption
          method="delivery"
          selected={isDelivery}
          onChange={onFulfillmentChange}
          icon={<Truck className="size-6" />}
          title="Giao hàng tận nơi"
          description="Giao bánh đến địa chỉ của bạn"
        />
      </fieldset>
      <div className="mt-space-md space-y-space-md">
        {isDelivery ? (
          <CheckoutField error={errors.deliveryAddress} field="deliveryAddress" label="Địa chỉ giao hàng" required>
            <textarea
              className={checkoutInputStyles}
              data-checkout-field="deliveryAddress"
              maxLength={250}
              onChange={(event) => onUpdate({ deliveryAddress: event.target.value })}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
              rows={2}
              value={draft.deliveryAddress}
              aria-invalid={Boolean(errors.deliveryAddress)}
              aria-describedby={errors.deliveryAddress ? "checkout-deliveryAddress-error" : undefined}
            />
          </CheckoutField>
        ) : (
          <div className="flex items-start gap-space-sm rounded-lg bg-surface-container-low p-space-md font-body-sm text-body-sm text-on-surface-variant">
            <MapPin aria-hidden="true" className="size-5 shrink-0 text-secondary" />
            Địa chỉ và thời gian nhận hàng tại cửa hàng sẽ được xác nhận cùng đơn hàng.
          </div>
        )}
        <div className="grid gap-space-md sm:grid-cols-2">
          <CheckoutField
            error={errors.receiveDate}
            field="receiveDate"
            label={isDelivery ? "Ngày giao bánh mong muốn" : "Ngày nhận bánh mong muốn"}
            required
          >
            <span className="relative block">
              <input
                className={checkoutInputStyles}
                data-checkout-field="receiveDate"
                min={today || undefined}
                onChange={(event) => onUpdate({ receiveDate: event.target.value })}
                type="date"
                value={draft.receiveDate}
                aria-invalid={Boolean(errors.receiveDate)}
                aria-describedby={errors.receiveDate ? "checkout-receiveDate-error" : undefined}
              />
              <CalendarDays aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-outline" />
            </span>
          </CheckoutField>
          <CheckoutField error={errors.deliveryTime} field="deliveryTime" label="Khung giờ mong muốn (tùy chọn)">
            <input
              className={checkoutInputStyles}
              data-checkout-field="deliveryTime"
              maxLength={100}
              onChange={(event) => onUpdate({ deliveryTime: event.target.value })}
              placeholder="Ví dụ: 09:00–11:00"
              value={draft.deliveryTime}
              aria-invalid={Boolean(errors.deliveryTime)}
              aria-describedby={errors.deliveryTime ? "checkout-deliveryTime-error" : undefined}
            />
          </CheckoutField>
        </div>
        <CheckoutField field="notes" label="Ghi chú (tùy chọn)">
          <textarea
            className={checkoutInputStyles}
            maxLength={500}
            onChange={(event) => onUpdate({ notes: event.target.value })}
            placeholder="Lời chúc, yêu cầu đóng gói, lưu ý khi giao hàng..."
            rows={3}
            value={draft.notes}
          />
        </CheckoutField>
      </div>
    </section>
  );
}

function FulfillmentOption({ method, selected, onChange, icon, title, description }: {
  method: FulfillmentMethod;
  selected: boolean;
  onChange: (method: FulfillmentMethod) => void;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-space-sm rounded-lg border p-space-md ${selected ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface"}`}>
      <input
        checked={selected}
        className="mt-1 size-4 accent-primary"
        name="fulfillmentMethod"
        onChange={() => onChange(method)}
        type="radio"
        value={method}
      />
      <span className="mt-0.5 text-secondary">{icon}</span>
      <span>
        <strong className="block font-label-ui text-label-ui text-primary">{title}</strong>
        <small className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{description}</small>
      </span>
    </label>
  );
}
