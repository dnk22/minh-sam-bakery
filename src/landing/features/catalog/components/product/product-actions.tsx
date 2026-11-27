"use client";
import { ShoppingCart } from "lucide-react";
import type { CatalogProduct } from "../../types";
import { useProductActions } from "../../hooks/use-product-actions";
import { ProductVariantDialog } from "./product-variant-dialog";

export function ProductActions({ product, compact = false, responsiveCompact = false }: {
  product: CatalogProduct;
  compact?: boolean;
  responsiveCompact?: boolean;
}) {
  const { pendingAction, setPendingAction, setVariantId, quantity, setQuantity, feedback,
    variants, selectedVariant, commit, start } = useProductActions(product);

  return (
    <div className="relative z-20 w-full">
      <div className={`flex items-stretch ${responsiveCompact ? "gap-1.5 sm:gap-space-xs" : "gap-space-xs"}`}>
        <button
          className={`flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-lg bg-primary font-label-ui font-semibold uppercase text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 ${compact ? "px-2 text-[11px] tracking-wider" : responsiveCompact ? "px-1 text-[11px] leading-tight tracking-normal break-words sm:px-2 sm:text-label-ui sm:tracking-wider" : "px-2 text-label-ui tracking-wider"}`}
          disabled={!product.pricing.available}
          onClick={() => start("buy-now")}
          type="button"
        >
          {product.pricing.available ? "Mua ngay" : "Tạm hết hàng"}
        </button>
        <button
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface text-primary transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!product.pricing.available}
          onClick={() => start("add-to-cart")}
          title="Thêm vào giỏ"
          type="button"
        >
          <ShoppingCart aria-hidden="true" className="size-[19px]" />
        </button>
      </div>
      <span
        aria-live="polite"
        className="block font-body-sm text-[11px] text-secondary"
      >
        {feedback}
      </span>

      <ProductVariantDialog
        product={product}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
        variants={variants}
        setVariantId={setVariantId}
        quantity={quantity}
        setQuantity={setQuantity}
        selectedVariant={selectedVariant}
        commit={commit}
      />
    </div>
  );
}
