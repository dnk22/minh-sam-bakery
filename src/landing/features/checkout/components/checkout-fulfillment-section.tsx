import { MapPin, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";

import type { CheckoutDraft, CheckoutErrors, FulfillmentMethod } from "../types";
import { CheckoutField, checkoutInputStyles } from "./checkout-field";
import { CheckoutDateInput } from "./checkout-date-input";

export function CheckoutFulfillmentSection({ draft, errors, today, onUpdate, onFulfillmentChange }: {
  draft: CheckoutDraft;
  errors: CheckoutErrors;
  today: string;
  onUpdate: (patch: Partial<CheckoutDraft>) => void;
  onFulfillmentChange: (method: FulfillmentMethod) => void;
}) {
  const isDelivery = draft.fulfillmentMethod === "delivery";

  return (
    <section className="min-w-0 rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm" aria-labelledby="checkout-fulfillment-heading">
      <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-fulfillment-heading">
        2. Hình thức nhận bánh
      </h2>
      <fieldset className="grid min-w-0 grid-cols-1 gap-space-sm md:grid-cols-2">
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
        <div className="grid min-w-0 grid-cols-1 gap-space-md md:grid-cols-2">
          <CheckoutField
            error={errors.receiveDate}
            field="receiveDate"
            label={isDelivery ? "Ngày giao bánh mong muốn" : "Ngày nhận bánh mong muốn"}
            required
          >
            <CheckoutDateInput value={draft.receiveDate} min={today} error={errors.receiveDate} onChange={receiveDate => onUpdate({ receiveDate })} />
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
    <label className={`flex min-w-0 cursor-pointer items-start gap-space-sm rounded-lg border p-space-md ${selected ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface"}`}>
      <input
        checked={selected}
        className="mt-1 size-4 shrink-0 accent-primary"
        name="fulfillmentMethod"
        onChange={() => onChange(method)}
        type="radio"
        value={method}
      />
      <span className="mt-0.5 shrink-0 text-secondary">{icon}</span>
      <span className="min-w-0 [overflow-wrap:anywhere]">
        <strong className="block font-label-ui text-label-ui text-primary">{title}</strong>
        <small className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{description}</small>
      </span>
    </label>
  );
}
