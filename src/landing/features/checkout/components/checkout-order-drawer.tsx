"use client";

import { ArrowRight, CalendarDays, Check, CreditCard, Mail, MapPin, Phone, QrCode, Store, Truck, UserRound, WalletCards, X } from "lucide-react";
import type { FormEvent, ReactNode, RefObject } from "react";

import type { CheckoutDraft, CheckoutErrors, CheckoutLineItem, FulfillmentMethod } from "../types";
import { CheckoutProductSummary, formatVnd } from "./checkout-product-summary";

type CheckoutOrderDrawerProps = {
  dialogRef: RefObject<HTMLElement | null>;
  draft: CheckoutDraft;
  errors: CheckoutErrors;
  item: CheckoutLineItem;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (patch: Partial<CheckoutDraft>) => void;
};

const inputClassName = "w-full rounded-lg bg-surface-container-low px-4 py-2.5 font-body-md text-body-md text-on-surface shadow-sm outline-none transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20";

export function CheckoutOrderDrawer({ dialogRef, draft, errors, item, onClose, onSubmit, onUpdate }: CheckoutOrderDrawerProps) {
  const total = item.unitPrice * item.quantity;
  const isPickup = draft.fulfillmentMethod === "pickup";

  return (
    <aside aria-labelledby="checkout-title" aria-modal="true" className="fixed top-0 right-0 bottom-0 z-[71] flex h-dvh w-full max-w-[520px] flex-col overflow-hidden border-l border-outline-variant/30 bg-surface text-on-surface shadow-2xl" ref={dialogRef} role="dialog">
      <header className="flex shrink-0 items-start justify-between px-5 pt-5 pb-4 md:px-7 md:pt-7">
        <div>
          <span className="block font-label-eyebrow text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">Minh Sâm Bakery • Nghi thức đặt quà</span>
          <h2 className="mt-1 font-headline-md text-[28px] leading-9 font-medium text-primary" id="checkout-title">Thông tin đặt hàng</h2>
        </div>
        <button aria-label="Đóng bảng đặt hàng" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high" data-autofocus onClick={onClose} type="button"><X className="size-5" /></button>
      </header>

      <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={onSubmit}>
        <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 pb-8 md:px-7">
          <CheckoutProductSummary item={item} />

          <section aria-labelledby="customer-information-heading" className="space-y-4">
            <SectionHeading id="customer-information-heading" index="01">Thông tin người nhận</SectionHeading>
            <div className="space-y-3">
              <FormField error={errors.fullName} id="checkout-full-name" label="Họ và tên">
                <InputWithIcon Icon={UserRound}><input aria-describedby={errors.fullName ? "checkout-full-name-error" : undefined} aria-invalid={Boolean(errors.fullName)} autoComplete="name" className={inputClassName} data-field="fullName" id="checkout-full-name" maxLength={100} onChange={(event) => onUpdate({ fullName: event.target.value })} placeholder="Nhập họ và tên" type="text" value={draft.fullName} /></InputWithIcon>
              </FormField>
              <FormField error={errors.phone} id="checkout-phone" label="Số điện thoại">
                <InputWithIcon Icon={Phone}><input aria-describedby={errors.phone ? "checkout-phone-error" : undefined} aria-invalid={Boolean(errors.phone)} autoComplete="tel" className={inputClassName} data-field="phone" id="checkout-phone" inputMode="tel" maxLength={20} onChange={(event) => onUpdate({ phone: event.target.value })} placeholder="Nhập số điện thoại" type="tel" value={draft.phone} /></InputWithIcon>
              </FormField>
              <FormField error={errors.email} id="checkout-email" label="Email" optional>
                <InputWithIcon Icon={Mail}><input aria-describedby={errors.email ? "checkout-email-error" : undefined} aria-invalid={Boolean(errors.email)} autoComplete="email" className={inputClassName} data-field="email" id="checkout-email" maxLength={150} onChange={(event) => onUpdate({ email: event.target.value })} placeholder="Địa chỉ email (không bắt buộc)" type="email" value={draft.email} /></InputWithIcon>
              </FormField>
            </div>
          </section>

          <section aria-labelledby="fulfillment-heading" className="space-y-4">
            <SectionHeading id="fulfillment-heading" index="02">Hình thức nhận bánh</SectionHeading>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Hình thức nhận bánh">
              <FulfillmentCard Icon={Store} description="Đến nhận bánh tại Minh Sâm" label="Nhận tại cửa hàng" method="pickup" onSelect={(fulfillmentMethod) => onUpdate({ fulfillmentMethod })} selected={isPickup} />
              <FulfillmentCard Icon={Truck} description="Giao bánh đến địa chỉ của bạn" label="Giao tận nơi" method="delivery" onSelect={(fulfillmentMethod) => onUpdate({ fulfillmentMethod })} selected={!isPickup} />
            </div>

            <div className="space-y-3 rounded-xl bg-surface-container-low p-4 shadow-sm">
              {isPickup ? (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <div><p className="font-label-ui text-label-ui font-semibold text-primary">Địa điểm nhận bánh</p><p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">Trà Viện Minh Sâm — 12 Hàng Than, Ba Đình, Hà Nội</p><span className="mt-1 block font-label-eyebrow text-[10px] uppercase tracking-wider text-secondary">Giờ đón khách: 08:30 – 21:00</span></div>
                </div>
              ) : (
                <FormField error={errors.deliveryAddress} id="checkout-delivery-address" label="Địa chỉ giao hàng">
                  <InputWithIcon Icon={MapPin}><input aria-describedby={errors.deliveryAddress ? "checkout-delivery-address-error" : undefined} aria-invalid={Boolean(errors.deliveryAddress)} autoComplete="street-address" className={inputClassName} data-field="deliveryAddress" id="checkout-delivery-address" maxLength={250} onChange={(event) => onUpdate({ deliveryAddress: event.target.value })} placeholder="Số nhà, đường, phường/xã, quận/huyện..." type="text" value={draft.deliveryAddress} /></InputWithIcon>
                </FormField>
              )}
              <FormField error={errors.receiveDate} id="checkout-receive-date" label={isPickup ? "Chọn ngày nhận bánh" : "Ngày mong muốn nhận bánh"}>
                <InputWithIcon Icon={CalendarDays}><input aria-describedby={errors.receiveDate ? "checkout-receive-date-error" : undefined} aria-invalid={Boolean(errors.receiveDate)} className={inputClassName} data-field="receiveDate" id="checkout-receive-date" min={getTodayInputValue()} onChange={(event) => onUpdate({ receiveDate: event.target.value })} type="date" value={draft.receiveDate} /></InputWithIcon>
              </FormField>
              <label className="block space-y-1" htmlFor="checkout-notes"><span className="font-label-ui text-label-ui font-medium text-on-surface">Ghi chú đơn hàng <span className="font-normal text-outline">(tuỳ chọn)</span></span><textarea className={`${inputClassName} resize-none`} id="checkout-notes" maxLength={500} onChange={(event) => onUpdate({ notes: event.target.value })} placeholder={isPickup ? "Ví dụ: Lời nhắn, yêu cầu đóng gói, giờ ghé cửa hàng..." : "Ví dụ: Hướng dẫn giao hàng, lời chúc gửi kèm hộp quà..."} rows={2} value={draft.notes} /></label>
            </div>
          </section>

          <section aria-labelledby="payment-heading" className="space-y-4">
            <SectionHeading id="payment-heading" index="03">Hình thức thanh toán</SectionHeading>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low p-4 shadow-sm">
              <div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary">{isPickup ? <WalletCards className="size-5" /> : <QrCode className="size-5" />}</span><div><p className="font-label-ui text-label-ui font-semibold text-primary">{isPickup ? "Thanh toán tại cửa hàng" : "Chuyển khoản ngân hàng"}</p><p className="font-body-sm text-body-sm text-on-surface-variant">{isPickup ? "Thanh toán khi đến nhận bánh (Tiền mặt / Thẻ)" : "Quét mã QR ở bước tiếp theo để thanh toán"}</p></div></div>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary"><Check className="size-3" /></span>
            </div>
            <p className="flex items-center gap-2 font-body-sm text-[11px] leading-4 text-outline"><CreditCard className="size-4 shrink-0" />Phương thức thanh toán được áp dụng theo hình thức nhận bánh đã chọn.</p>
          </section>
        </div>

        <footer className="shrink-0 space-y-3 border-t border-outline-variant/30 bg-surface-container-low/95 px-5 py-4 shadow-[0_-8px_24px_rgba(36,22,20,0.06)] backdrop-blur-md md:px-7">
          <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant"><div className="flex justify-between"><span>Tiền bánh ({item.quantity} hộp)</span><span className="font-medium text-on-surface">{formatVnd(total)}</span></div><div className="flex justify-between"><span>Phí giao hàng</span><span className="font-label-ui text-[12px] font-medium uppercase tracking-wider text-secondary">{isPickup ? "Không áp dụng" : "Sẽ được xác nhận"}</span></div><div className="my-2 h-px bg-outline-variant/40" /><div className="flex items-baseline justify-between"><span className="font-headline-sm text-[18px] font-semibold text-primary">{isPickup ? "Tổng cộng" : "Tạm tính hiện tại"}</span><span className="font-headline-sm text-[22px] font-bold text-primary">{formatVnd(total)}</span></div></div>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-3.5 font-label-ui text-label-ui font-semibold uppercase tracking-widest text-on-primary shadow-md transition-colors hover:bg-primary" type="submit"><span>{isPickup ? "Xác nhận đặt bánh" : "Tiếp tục đặt bánh"}</span><ArrowRight className="size-[18px]" /></button>
        </footer>
      </form>
    </aside>
  );
}

function SectionHeading({ children, id, index }: { children: string; id: string; index: string }) {
  return <div className="flex items-center gap-2"><span className="font-label-eyebrow text-label-eyebrow font-semibold text-secondary">{index}</span><h3 className="font-headline-sm text-headline-sm font-semibold text-primary" id={id}>{children}</h3></div>;
}

function FormField({ children, error, id, label, optional = false }: { children: ReactNode; error?: string; id: string; label: string; optional?: boolean }) {
  return <div className="space-y-1"><label className="block font-label-ui text-label-ui font-medium text-on-surface" htmlFor={id}>{label}{optional ? <span className="font-normal text-outline"> (không bắt buộc)</span> : <span className="text-error"> *</span>}</label>{children}{error ? <p className="font-body-sm text-[11px] text-error" id={`${id}-error`}>{error}</p> : null}</div>;
}

function InputWithIcon({ children, Icon }: { children: ReactNode; Icon: typeof UserRound }) {
  return <div className="relative">{children}<Icon aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-[18px] -translate-y-1/2 text-outline/70" /></div>;
}

function FulfillmentCard({ Icon, description, label, method, onSelect, selected }: { Icon: typeof Store; description: string; label: string; method: FulfillmentMethod; onSelect: (method: FulfillmentMethod) => void; selected: boolean }) {
  return <button aria-checked={selected} className={`flex min-h-32 flex-col justify-between rounded-xl p-4 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${selected ? "bg-surface-container-high text-primary ring-1 ring-primary/20" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"}`} onClick={() => onSelect(method)} role="radio" type="button"><span className="flex w-full items-center justify-between"><span className={`flex size-9 items-center justify-center rounded-full ${selected ? "bg-primary-container text-on-primary" : "bg-surface-container text-on-surface-variant"}`}><Icon className="size-5" /></span><span className={`flex size-4 items-center justify-center rounded-full ${selected ? "bg-primary-container" : "bg-surface-variant"}`}>{selected ? <span className="size-2 rounded-full bg-secondary-fixed" /> : null}</span></span><span className="mt-3"><span className="block font-label-ui text-label-ui font-semibold text-primary">{label}</span><span className="mt-1 block font-body-sm text-[11px] leading-[15px] text-on-surface-variant">{description}</span></span></button>;
}

function getTodayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
