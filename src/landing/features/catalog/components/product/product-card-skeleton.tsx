import { PRODUCT_PAGE_SIZE } from "../../../../lib/product-pagination";
import { PRODUCT_GRID_CLASS, PRODUCT_CARD_BODY_CLASS, PRODUCT_CARD_ACTIONS_CLASS } from "./product-card-layout";

/** Match the landscape ProductCard's image, typography and purchase actions. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm motion-safe:animate-pulse">
      <div className="aspect-[4/3] w-full bg-surface-container" />
      <div className={PRODUCT_CARD_BODY_CLASS}>
        <div>
          <div className="mb-1 h-5 sm:h-[var(--text-headline-sm--line-height,28px)] w-3/4 rounded bg-surface-container" />
          <div className="mb-2 space-y-1 sm:mb-space-sm">
            <div className="h-3 sm:h-4 w-full rounded bg-surface-container" />
            <div className="h-3 sm:h-4 w-4/5 rounded bg-surface-container" />
          </div>
        </div>
        <div className={PRODUCT_CARD_ACTIONS_CLASS}>
          <div className="h-6 sm:h-[30px] w-1/2 rounded bg-surface-container" />
          <div className="flex items-stretch gap-1.5 sm:gap-space-xs">
            <div className="h-11 flex-1 rounded-lg bg-surface-container" />
            <div className="size-11 rounded-lg bg-surface-container" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = PRODUCT_PAGE_SIZE }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Đang tải sản phẩm" className={PRODUCT_GRID_CLASS}>
      {Array.from({ length: Math.max(1, count) }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}
