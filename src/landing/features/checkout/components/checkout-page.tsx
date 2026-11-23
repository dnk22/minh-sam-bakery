"use client";

import { ArrowLeft, CalendarDays, CreditCard, MapPin, ShoppingBag, Store, Truck } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { formatVnd } from "@/landing/features/catalog/pricing";
import type { CheckoutIntent } from "@/landing/features/cart/types";
import { routes } from "@/landing/lib/routes";

import { loadCheckoutIntent } from "../store/checkout-intent";
import type { CheckoutDraft, CheckoutErrors, CheckoutField, FulfillmentMethod, PaymentMethod } from "../types";
import { initialCheckoutDraft, localCalendarDate, normalizeCheckoutDraft, validateCheckoutDraft } from "../validation";

const DRAFT_KEY = "minh-sam-checkout-contact-v1";
const inputStyles = "w-full rounded-lg border border-outline-variant bg-surface px-3 py-3 font-body-md text-body-md text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30";

function readDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const parsed = data as Partial<CheckoutDraft>;
    if (typeof parsed.fullName !== "string" || typeof parsed.phone !== "string" ||
      typeof parsed.email !== "string" || typeof parsed.deliveryAddress !== "string" ||
      typeof parsed.receiveDate !== "string" || typeof parsed.deliveryTime !== "string" ||
      typeof parsed.notes !== "string" ||
      (parsed.fulfillmentMethod !== "pickup" && parsed.fulfillmentMethod !== "delivery") ||
      (parsed.paymentMethod !== "AT_STORE" && parsed.paymentMethod !== "BANK_TRANSFER")) return null;
    return parsed as CheckoutDraft;
  } catch {
    return null;
  }
}

export function CheckoutPage() {
  const [loaded, setLoaded] = useState(false);
  const [intent, setIntent] = useState<CheckoutIntent | null>(null);
  const [draft, setDraft] = useState<CheckoutDraft>(initialCheckoutDraft);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formChecked, setFormChecked] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setIntent(loadCheckoutIntent());
    const previousDraft = readDraft();
    if (previousDraft) setDraft(previousDraft);
    setToday(localCalendarDate());
    setLoaded(true);
  }, []);

  const updateDraft = (patch: Partial<CheckoutDraft>) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* Session storage may be unavailable. */ }
      return next;
    });
    setFormChecked(false);
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as CheckoutField[]) delete next[key];
      return next;
    });
  };

  const chooseFulfillment = (fulfillmentMethod: FulfillmentMethod) => {
    updateDraft({
      fulfillmentMethod,
      paymentMethod: fulfillmentMethod === "delivery" && draft.paymentMethod === "AT_STORE"
        ? "BANK_TRANSFER" : draft.paymentMethod,
    });
  };

  const checkInformation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeCheckoutDraft(draft);
    const result = validateCheckoutDraft(normalized);
    setDraft(normalized);
    setErrors(result.errors);
    setFormChecked(!result.firstInvalidField);
    if (result.firstInvalidField) {
      document.querySelector<HTMLElement>(`[data-checkout-field="${result.firstInvalidField}"]`)?.focus();
    }
    // Intentionally no create-order API call: quantity/variant/fulfillment contract is not finalized.
  };

  if (!loaded) {
    return <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]"><div className="mx-auto max-w-[1360px] px-gutter py-space-xl font-body-md text-on-surface-variant">Đang chuẩn bị thanh toán...</div></main>;
  }

  if (!intent) {
    return (
      <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-space-md px-gutter py-space-xl text-center">
          <ShoppingBag aria-hidden="true" className="size-12 text-secondary" />
          <h1 className="font-headline-lg text-headline-md text-primary">Chưa có sản phẩm để thanh toán</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Hãy chọn Mua ngay hoặc chọn sản phẩm trong giỏ hàng trước khi thanh toán.</p>
          <Link className="rounded-lg bg-primary px-space-lg py-3 font-label-ui text-on-primary" href={routes.cart}>Quay lại giỏ hàng</Link>
        </div>
      </main>
    );
  }

  const subtotal = intent.items.reduce((sum, item) => sum + item.effectivePrice * item.quantity, 0);
  const isDelivery = draft.fulfillmentMethod === "delivery";

  return (
    <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <nav aria-label="Đường dẫn trang" className="mb-space-lg flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link href={routes.home}>Trang chủ</Link><span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-primary">Thanh toán</span>
        </nav>
        <div className="mb-space-xl">
          <h1 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">Thông tin thanh toán</h1>
          <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
            {intent.source === "buy-now" ? "Đơn mua ngay" : "Đơn từ giỏ hàng"} • {intent.items.length} dòng sản phẩm.
          </p>
        </div>

        <form className="grid items-start gap-gutter-desktop lg:grid-cols-[minmax(0,1fr)_minmax(310px,400px)]" noValidate onSubmit={checkInformation}>
          <div className="min-w-0 space-y-space-lg">
            <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm" aria-labelledby="checkout-contact-heading">
              <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-contact-heading">1. Thông tin khách hàng</h2>
              <div className="grid gap-space-md sm:grid-cols-2">
                <TextField error={errors.fullName} field="fullName" label="Họ và tên" required>
                  <input autoComplete="name" className={inputStyles} data-checkout-field="fullName" maxLength={100} onChange={(event) => updateDraft({ fullName: event.target.value })} placeholder="Nhập họ và tên" value={draft.fullName} />
                </TextField>
                <TextField error={errors.phone} field="phone" label="Số điện thoại" required>
                  <input autoComplete="tel" className={inputStyles} data-checkout-field="phone" maxLength={20} onChange={(event) => updateDraft({ phone: event.target.value })} placeholder="Số điện thoại nhận hàng" type="tel" value={draft.phone} />
                </TextField>
                <div className="sm:col-span-2">
                  <TextField error={errors.email} field="email" label="Email (không bắt buộc)">
                    <input autoComplete="email" className={inputStyles} data-checkout-field="email" maxLength={150} onChange={(event) => updateDraft({ email: event.target.value })} placeholder="Email nhận thông tin đơn hàng" type="email" value={draft.email} />
                  </TextField>
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm" aria-labelledby="checkout-fulfillment-heading">
              <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-fulfillment-heading">2. Hình thức nhận bánh</h2>
              <fieldset className="grid gap-space-sm sm:grid-cols-2">
                <legend className="sr-only">Hình thức nhận hàng</legend>
                <FulfillmentOption method="pickup" selected={draft.fulfillmentMethod === "pickup"} onChange={chooseFulfillment} icon={<Store className="size-6" />} title="Nhận tại cửa hàng" description="Đến nhận bánh tại Minh Sâm" />
                <FulfillmentOption method="delivery" selected={isDelivery} onChange={chooseFulfillment} icon={<Truck className="size-6" />} title="Giao hàng tận nơi" description="Giao bánh đến địa chỉ của bạn" />
              </fieldset>

              <div className="mt-space-md space-y-space-md">
                {isDelivery ? (
                  <TextField error={errors.deliveryAddress} field="deliveryAddress" label="Địa chỉ giao hàng" required>
                    <textarea className={inputStyles} data-checkout-field="deliveryAddress" maxLength={250} onChange={(event) => updateDraft({ deliveryAddress: event.target.value })} placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..." rows={2} value={draft.deliveryAddress} />
                  </TextField>
                ) : (
                  <div className="flex items-start gap-space-sm rounded-lg bg-surface-container-low p-space-md font-body-sm text-body-sm text-on-surface-variant">
                    <MapPin aria-hidden="true" className="size-5 shrink-0 text-secondary" />
                    Địa chỉ và thời gian nhận hàng tại cửa hàng sẽ được xác nhận cùng đơn hàng.
                  </div>
                )}
                <div className="grid gap-space-md sm:grid-cols-2">
                  <TextField error={errors.receiveDate} field="receiveDate" label={isDelivery ? "Ngày giao bánh mong muốn" : "Ngày nhận bánh mong muốn"} required>
                    <span className="relative block">
                      <input className={inputStyles} data-checkout-field="receiveDate" min={today || undefined} onChange={(event) => updateDraft({ receiveDate: event.target.value })} type="date" value={draft.receiveDate} />
                      <CalendarDays aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-outline" />
                    </span>
                  </TextField>
                  <TextField error={errors.deliveryTime} field="deliveryTime" label="Khung giờ mong muốn (tùy chọn)">
                    <input className={inputStyles} data-checkout-field="deliveryTime" maxLength={100} onChange={(event) => updateDraft({ deliveryTime: event.target.value })} placeholder="Ví dụ: 09:00–11:00" value={draft.deliveryTime} />
                  </TextField>
                </div>
                <TextField field="notes" label="Ghi chú (tùy chọn)">
                  <textarea className={inputStyles} maxLength={500} onChange={(event) => updateDraft({ notes: event.target.value })} placeholder="Lời chúc, yêu cầu đóng gói, lưu ý khi giao hàng..." rows={3} value={draft.notes} />
                </TextField>
              </div>
            </section>

            <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm" aria-labelledby="checkout-payment-heading">
              <h2 className="mb-space-md font-headline-md text-headline-sm text-primary" id="checkout-payment-heading">3. Phương thức thanh toán</h2>
              <fieldset className="space-y-space-sm">
                <legend className="sr-only">Chọn phương thức thanh toán</legend>
                <PaymentOption value="BANK_TRANSFER" checked={draft.paymentMethod === "BANK_TRANSFER"} onChange={(paymentMethod) => updateDraft({ paymentMethod })} icon={<CreditCard className="size-5" />} label="Chuyển khoản ngân hàng" note="Thông tin chuyển khoản hiển thị sau khi đơn được tạo" />
                <PaymentOption value="AT_STORE" checked={draft.paymentMethod === "AT_STORE"} disabled={isDelivery} onChange={(paymentMethod) => updateDraft({ paymentMethod })} icon={<Store className="size-5" />} label="Thanh toán tại cửa hàng" note={isDelivery ? "Chỉ áp dụng khi nhận bánh tại cửa hàng" : "Thanh toán khi đến nhận bánh"} />
              </fieldset>
              {errors.paymentMethod ? <p className="mt-2 font-body-sm text-error" role="alert">{errors.paymentMethod}</p> : null}
              <p className="mt-space-md font-body-sm text-body-sm text-on-surface-variant">Chưa phát sinh giao dịch thanh toán tại bước này.</p>
            </section>
          </div>

          <aside className="sticky top-24 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm" aria-label="Tóm tắt đơn thanh toán">
            <h2 className="mb-space-md font-headline-md text-headline-sm text-primary">Đơn hàng của bạn</h2>
            <ul className="max-h-[45vh] space-y-space-md overflow-y-auto border-b border-outline-variant pb-space-md">
              {intent.items.map((item) => (
                <li className="flex items-start gap-space-sm" key={item.key}>
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                    <SafeImage alt={item.productImageAlt} className="size-full object-cover" src={item.productImage} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-label-ui text-label-ui text-primary">{item.productName}</span>
                    <span className="mt-0.5 block font-body-sm text-[12px] text-on-surface-variant">{item.variantLabel} × {item.quantity}</span>
                    <span className="mt-1 block font-price-serif text-[14px] text-primary">{formatVnd(item.effectivePrice * item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-space-md space-y-space-sm">
              <div className="flex justify-between gap-3 font-body-md text-body-md"><span>Tạm tính</span><strong>{formatVnd(subtotal)}</strong></div>
              <div className="flex justify-between gap-3 font-body-sm text-body-sm text-on-surface-variant"><span>Phí giao hàng</span><span>{isDelivery ? "Chưa xác định" : "Không áp dụng"}</span></div>
            </div>
            <div className="my-space-lg border-t border-outline-variant" />
            <div className="flex items-baseline justify-between gap-2"><span className="font-headline-sm text-headline-sm font-semibold text-primary">Tạm tính</span><strong className="font-price-serif text-[24px] text-primary">{formatVnd(subtotal)}</strong></div>
            <p className="mt-space-sm font-body-sm text-[12px] text-on-surface-variant">Giá, số lượng và biến thể sẽ được Backend xác nhận khi tích hợp tạo đơn. Đây chưa phải số tiền thanh toán cuối cùng.</p>
            <button className="mt-space-lg flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-space-lg font-label-ui text-label-ui font-semibold text-on-primary" type="submit">
              Kiểm tra thông tin
            </button>
            {formChecked ? (
              <div className="mt-space-md rounded-lg bg-surface-container-low p-space-md font-body-sm text-body-sm text-primary" role="status">
                Thông tin hợp lệ. Chức năng gửi đơn hàng đang chờ cập nhật API; chưa có đơn hàng hay thanh toán nào được tạo.
              </div>
            ) : null}
            <p className="mt-space-md font-body-sm text-[12px] text-on-surface-variant">Chưa thể xác nhận đặt hàng trực tuyến ở giai đoạn này.</p>
            <Link className="mt-space-md flex items-center justify-center gap-2 font-body-sm text-secondary hover:underline" href={intent.source === "cart" ? routes.cart : routes.search}>
              <ArrowLeft aria-hidden="true" className="size-4" /> Quay lại mua sắm
            </Link>
          </aside>
        </form>
      </section>
    </main>
  );
}

function TextField({ field, label, error, required, children }: {
  field: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 font-label-ui text-label-ui text-on-surface">
      <span>{label}{required ? <span className="text-error"> *</span> : null}</span>
      {children}
      {error ? <span className="block font-body-sm text-[12px] text-error" id={`checkout-${field}-error`}>{error}</span> : null}
    </label>
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
      <input checked={selected} className="mt-1 size-4 accent-primary" name="fulfillmentMethod" onChange={() => onChange(method)} type="radio" value={method} />
      <span className="mt-0.5 text-secondary">{icon}</span>
      <span><strong className="block font-label-ui text-label-ui text-primary">{title}</strong><small className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{description}</small></span>
    </label>
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
      <input checked={checked} className="mt-1 size-4 accent-primary" disabled={disabled} name="paymentMethod" onChange={() => onChange(value)} type="radio" value={value} />
      <span className="text-secondary">{icon}</span>
      <span><strong className="block font-label-ui text-label-ui text-primary">{label}</strong><small className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{note}</small></span>
    </label>
  );
}
