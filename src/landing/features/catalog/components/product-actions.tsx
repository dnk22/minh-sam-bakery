"use client";
import { ShoppingCart } from "lucide-react";
import type { CatalogProduct } from "../types";
import { useProductActions } from "../hooks/use-product-actions";
import { ProductVariantDialog } from "./product-variant-dialog";

export function ProductActions({ product, compact = false }: {
  product: CatalogProduct;
  compact?: boolean;
}) {
  const { pendingAction, setPendingAction, setVariantId, quantity, setQuantity, feedback,
    variants, selectedVariant, commit, start } = useProductActions(product);

  return (
    <div className="relative z-20 w-full">
      <div className="flex items-stretch gap-space-xs">
        <button
          className={`flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary px-2 font-label-ui font-semibold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 ${compact ? "text-[11px]" : "text-label-ui"}`}
          disabled={!product.pricing.available}
          onClick={() => start("buy-now")}
          type="button"
        >
          {product.pricing.available ? "Mua ngay" : "Tạm hết hàng"}
        </button>
        <button
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-outline-variant bg-surface text-primary transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
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
