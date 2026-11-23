import { formatVnd } from "../pricing";
import type { CatalogPricing } from "../types";

export function ProductPrice({
  pricing, compact = false,
}: { pricing: CatalogPricing; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1" aria-label="Giá sản phẩm">
      <span className={`font-price-serif font-bold ${compact ? "text-[16px]" : "text-[20px]"} text-primary`}>
        {pricing.isFrom ? "Từ " : ""}{formatVnd(pricing.effectivePrice)}
      </span>
      {pricing.hasDiscount ? (
        <del className="font-body-sm text-[12px] text-outline" aria-label="Giá gốc">
          {formatVnd(pricing.originalPrice)}
        </del>
      ) : null}
      {pricing.hasDiscount && pricing.discountPercent !== null && pricing.discountPercent > 0 ? (
        <span className="rounded bg-error-container px-1.5 py-0.5 font-label-eyebrow text-[11px] font-semibold text-on-error-container">
          -{pricing.discountPercent}%
        </span>
      ) : null}
    </div>
  );
}
