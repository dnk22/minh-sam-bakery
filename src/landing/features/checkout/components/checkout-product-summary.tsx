/* eslint-disable @next/next/no-img-element */

import type { CheckoutLineItem } from "../types";

export const formatVnd = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;

export function CheckoutProductSummary({ item }: { item: CheckoutLineItem }) {
  return (
    <section className="flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-md shadow-sm" aria-label="Sản phẩm đặt mua">
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-surface-container">
        <img alt={item.productImageAlt} className="h-full w-full object-cover" src={item.productImage} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-headline-sm text-[16px] leading-[22px] font-semibold text-primary">{item.productName}</h3>
          <span className="shrink-0 font-price-serif text-price-serif font-semibold text-primary">{formatVnd(item.unitPrice * item.quantity)}</span>
        </div>
        <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{item.variantLabel}</p>
        <div className="mt-space-xs flex items-center justify-between gap-2">
          <span className="font-label-ui text-body-sm font-medium text-secondary">Số lượng: {item.quantity.toString().padStart(2, "0")} hộp</span>
          <span className="font-label-eyebrow text-[10px] uppercase tracking-wider text-on-surface-variant">{formatVnd(item.unitPrice)} / hộp</span>
        </div>
      </div>
    </section>
  );
}
