import { CalendarDays, LoaderCircle, ReceiptText, Send, ShieldCheck, X } from "lucide-react";
import type { FormEvent, RefObject } from "react";

import type { QuotationErrors, QuotationFlowState, QuotationProductContext, QuotationRequestDraft } from "../types";
import { customEventOccasionOptions, customEventQuantityOptions, occasionOptions, quantityOptions } from "../types";
import { QuotationOptionGroup } from "./quotation-option-group";
import { QuotationProductSummary } from "./quotation-product-summary";

type RequestDrawerProps = {
  dialogRef: RefObject<HTMLElement | null>;
  draft: QuotationRequestDraft;
  errors: QuotationErrors;
  flowState: QuotationFlowState;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (patch: Partial<QuotationRequestDraft>) => void;
  product: QuotationProductContext;
  submitError?: string;
};

const inputClassName = "w-full rounded-md border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface shadow-inner focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function QuotationRequestDrawer({ dialogRef, draft, errors, flowState, onClose, onSubmit, onUpdate, product, submitError }: RequestDrawerProps) {
  const isSubmitting = flowState === "submitting";
  const isCustomEvent = product.quotationProfile === "custom-event";
  const activeQuantityOptions = isCustomEvent ? customEventQuantityOptions : quantityOptions;
  const activeOccasionOptions = isCustomEvent ? customEventOccasionOptions : occasionOptions;
  return (
    <aside aria-labelledby="quotation-request-title" aria-modal="true" className="fixed top-0 right-0 bottom-0 z-[71] flex h-dvh w-full max-w-[480px] flex-col overflow-hidden border-l border-outline-variant/30 bg-surface shadow-2xl" ref={dialogRef} role="dialog">
      <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={onSubmit}>
        <div className="flex shrink-0 flex-col gap-3 border-b border-outline-variant/30 bg-surface-container-low/60 p-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><ReceiptText aria-hidden="true" className="size-[22px] text-secondary" /><h2 className="font-headline-sm text-headline-sm font-bold text-primary" id="quotation-request-title">Yêu cầu báo giá</h2></div>
            <button aria-label="Đóng" className="flex size-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" data-autofocus onClick={onClose} type="button"><X aria-hidden="true" className="size-5" /></button>
          </div>
          <QuotationProductSummary product={product} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-space-md overflow-y-auto overscroll-contain p-space-md">
          <QuotationOptionGroup error={errors.quantityRange} field="quantityRange" label={isCustomEvent ? "1. Quy mô dự kiến" : "1. Số lượng dự kiến"} onChange={(quantityRange) => onUpdate({ quantityRange })} options={activeQuantityOptions} value={draft.quantityRange} />
          <QuotationOptionGroup error={errors.occasion} field="occasion" label={isCustomEvent ? "2. Loại sự kiện" : "2. Dịp tặng quà"} onChange={(occasion) => onUpdate({ occasion })} options={activeOccasionOptions} value={draft.occasion} />

          <section className="flex flex-col gap-3 pt-1" aria-labelledby="quotation-contact-heading">
            <div className="flex items-center gap-1"><h3 className="font-label-ui text-label-ui font-semibold text-on-surface" id="quotation-contact-heading">3. Thông tin người liên hệ</h3><span className="text-[13px] text-error">*</span></div>
            <FormField error={errors.contactName} id="quotation-contact-name" label="Họ tên người liên hệ">
              <input aria-describedby={errors.contactName ? "quotation-contact-name-error" : undefined} aria-invalid={Boolean(errors.contactName)} autoComplete="name" className={inputClassName} data-field="contactName" id="quotation-contact-name" maxLength={100} onChange={(event) => onUpdate({ contactName: event.target.value })} placeholder="Nhập họ tên của bạn" type="text" value={draft.contactName} />
            </FormField>
            <FormField error={errors.phone} id="quotation-phone" label="Số điện thoại">
              <input aria-describedby={errors.phone ? "quotation-phone-error" : undefined} aria-invalid={Boolean(errors.phone)} autoComplete="tel" className={inputClassName} data-field="phone" id="quotation-phone" inputMode="tel" maxLength={20} onChange={(event) => onUpdate({ phone: event.target.value })} placeholder="Nhập số điện thoại Zalo" type="tel" value={draft.phone} />
            </FormField>
          </section>

          <section className="flex flex-col gap-3 pt-1" aria-labelledby="quotation-additional-heading">
            <div className="flex items-center justify-between"><h3 className="font-label-ui text-label-ui font-semibold text-on-surface" id="quotation-additional-heading">4. Thông tin bổ sung</h3><span className="font-body-sm text-[12px] text-on-surface-variant">(Không bắt buộc)</span></div>
            <FormField error={errors.desiredDeliveryDate} id="quotation-delivery-date" label="Ngày mong muốn nhận hàng">
              <div className="relative"><input aria-describedby={errors.desiredDeliveryDate ? "quotation-delivery-date-error" : undefined} aria-invalid={Boolean(errors.desiredDeliveryDate)} className={`${inputClassName} pl-9`} data-field="desiredDeliveryDate" id="quotation-delivery-date" inputMode="numeric" maxLength={10} onChange={(event) => onUpdate({ desiredDeliveryDate: event.target.value })} placeholder="Chọn ngày dự kiến" type="text" value={draft.desiredDeliveryDate} /><CalendarDays aria-hidden="true" className="absolute top-2.5 left-2.5 size-[18px] text-on-surface-variant" /></div>
            </FormField>
            <FormField error={errors.notes} id="quotation-notes" label="Ghi chú thêm">
              <textarea className={`${inputClassName} resize-none placeholder:text-on-surface-variant/70`} data-field="notes" id="quotation-notes" maxLength={500} onChange={(event) => onUpdate({ notes: event.target.value })} placeholder={isCustomEvent ? "Ví dụ: Chủ đề, màu sắc, quy mô và địa điểm sự kiện..." : "Ví dụ: Yêu cầu nhận diện, quy cách và địa điểm giao nhận..."} rows={2} value={draft.notes} />
            </FormField>
          </section>

          <div className="flex items-start gap-2.5 rounded-lg bg-surface-container-low p-3 text-body-sm text-on-surface-variant"><ShieldCheck aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-secondary" /><p className="leading-relaxed">Minh Sâm chỉ sử dụng thông tin liên hệ để tư vấn cho yêu cầu này.</p></div>
          <div className="text-center"><span aria-disabled="true" className="inline-flex items-center gap-1 font-label-ui text-body-sm font-medium text-secondary">Bạn có yêu cầu đặc biệt hoặc dự án lớn? Gửi yêu cầu chi tiết</span></div>
          {submitError && <div className="rounded-md bg-error-container p-3 font-body-sm text-body-sm text-on-error-container" role="alert">{submitError}</div>}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-outline-variant/30 bg-surface-container-lowest p-space-md pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-container px-4 py-3.5 font-label-ui text-label-ui font-bold uppercase tracking-wider text-on-primary shadow-md transition-all hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.99] disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting} type="submit">{isSubmitting ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-secondary-fixed" /> : <Send aria-hidden="true" className="size-5 text-secondary-fixed" />}<span>{isSubmitting ? "ĐANG GỬI THÔNG TIN..." : "GỬI YÊU CẦU TƯ VẤN"}</span></button>
          <button className="w-full py-2 text-center font-label-ui text-body-sm text-on-surface-variant transition-colors hover:text-on-surface" disabled={isSubmitting} onClick={onClose} type="button">Đóng</button>
        </div>
      </form>
    </aside>
  );
}

function FormField({ children, error, id, label }: { children: React.ReactNode; error?: string; id: string; label: string }) {
  return <div className="flex flex-col gap-1.5"><label className="font-label-ui text-body-sm text-on-surface-variant" htmlFor={id}>{label}</label>{children}{error && <p className="font-body-sm text-body-sm text-error" id={`${id}-error`}>{error}</p>}</div>;
}
