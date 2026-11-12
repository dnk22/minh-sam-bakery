/* eslint-disable @next/next/no-img-element */

import type { QuotationProductContext } from "../types";

export function QuotationProductSummary({ product }: { product: QuotationProductContext }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-2.5">
      <img alt={product.imageAlt} className="size-16 shrink-0 rounded object-cover" src={product.image} />
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-secondary">{product.categoryLabel}</span>
        <span className="truncate font-headline-sm text-body-md font-semibold text-primary">{product.name}</span>
        <span className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">Báo giá ưu đãi B2B theo số lượng</span>
      </div>
    </div>
  );
}
