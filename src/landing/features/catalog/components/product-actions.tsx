"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCartLine } from "@/landing/features/cart/selection";
import { useCartStore } from "@/landing/features/cart/store/cart-store";
import { saveBuyNowIntent } from "@/landing/features/checkout/store/checkout-intent";
import { routes } from "@/landing/lib/routes";

import { formatVnd } from "../pricing";
import type { CatalogProduct, CatalogVariant } from "../types";

type ProductAction = "buy-now" | "add-to-cart";

export function ProductActions({ product, compact = false }: {
  product: CatalogProduct;
  compact?: boolean;
}) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [pendingAction, setPendingAction] = useState<ProductAction | null>(null);
  const [variantId, setVariantId] = useState(product.pricing.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const variants = product.pricing.variants;
  const selectedVariant = variants.find((variant) => variant.id === variantId) ?? variants[0];

  function commit(action: ProductAction, variant: CatalogVariant, amount: number) {
    const line = createCartLine(product, variant, amount);
    if (action === "add-to-cart") {
      addItem(line);
      setFeedback(`Đã thêm ${amount} sản phẩm vào giỏ hàng`);
    } else {
      saveBuyNowIntent(line);
      router.push(routes.checkout);
    }
    setPendingAction(null);
  }

  function start(action: ProductAction) {
    if (!product.pricing.available || variants.length === 0) return;
    setFeedback("");
    if (variants.length === 1) {
      commit(action, variants[0], 1);
    } else {
      setVariantId(variants[0].id);
      setQuantity(1);
      setPendingAction(action);
    }
  }

  return (
    <div className="relative z-20 w-full">
      <div className="flex items-stretch gap-space-xs">
        <button
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
          className="flex min-h-11 min-w-11 items-center justify-center rounded border border-outline-variant bg-surface text-primary transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!product.pricing.available}
          onClick={() => start("add-to-cart")}
          title="Thêm vào giỏ"
          type="button"
        >
          <ShoppingCart aria-hidden="true" className="size-[19px]" />
        </button>
        <button
          className={`flex min-h-11 flex-1 items-center justify-center rounded bg-primary px-2 font-label-ui font-semibold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 ${compact ? "text-[11px]" : "text-label-ui"}`}
          disabled={!product.pricing.available}
          onClick={() => start("buy-now")}
          type="button"
        >
          {product.pricing.available ? "Mua ngay" : "Tạm hết hàng"}
        </button>
      </div>
      <span aria-live="polite" className="block font-body-sm text-[11px] text-secondary">{feedback}</span>

      <Dialog.Root open={pendingAction !== null} onOpenChange={(open) => !open && setPendingAction(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-primary/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[91] max-h-[90dvh] w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-surface-container-lowest p-space-lg text-on-surface shadow-2xl">
            <div className="flex items-start justify-between gap-space-md">
              <div>
                <Dialog.Title className="font-headline-md text-headline-md text-primary">Chọn quy cách bánh</Dialog.Title>
                <Dialog.Description className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {product.name} — chọn biến thể và số lượng trước khi tiếp tục.
                </Dialog.Description>
              </div>
              <Dialog.Close aria-label="Đóng chọn biến thể" className="rounded p-2 text-primary hover:bg-surface-container">
                <X aria-hidden="true" className="size-5" />
              </Dialog.Close>
            </div>

            <fieldset className="mt-space-lg space-y-2">
              <legend className="mb-2 font-label-ui text-label-ui font-semibold text-on-surface">Quy cách</legend>
              {variants.map((variant) => (
                <label
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${variant.id === selectedVariant?.id ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface"}`}
                  key={variant.id}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      checked={variant.id === selectedVariant?.id}
                      className="size-4 accent-primary"
                      name="product-variant"
                      onChange={() => setVariantId(variant.id)}
                      type="radio"
                      value={variant.id}
                    />
                    <span className="font-body-md text-body-md text-primary">{variant.label}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-price-serif text-[16px] font-semibold text-primary">{formatVnd(variant.effectivePrice)}</span>
                    {variant.hasDiscount ? <del className="text-[11px] text-outline">{formatVnd(variant.originalPrice)}</del> : null}
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="mt-space-md flex items-center justify-between">
              <span className="font-label-ui text-label-ui font-semibold text-on-surface">Số lượng</span>
              <div className="flex items-center rounded-lg bg-surface-container-low">
                <button aria-label="Giảm số lượng" className="flex size-10 items-center justify-center disabled:opacity-40" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button"><Minus className="size-4" /></button>
                <output className="w-10 text-center font-label-ui">{quantity}</output>
                <button aria-label="Tăng số lượng" className="flex size-10 items-center justify-center disabled:opacity-40" disabled={quantity >= 20} onClick={() => setQuantity((value) => Math.min(20, value + 1))} type="button"><Plus className="size-4" /></button>
              </div>
            </div>
            <div className="mt-space-lg flex items-center justify-between gap-2 border-t border-outline-variant pt-space-md">
              <div>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">Tạm tính</span>
                <strong className="font-price-serif text-[22px] text-primary">{formatVnd((selectedVariant?.effectivePrice ?? 0) * quantity)}</strong>
              </div>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-space-lg font-label-ui text-label-ui font-semibold text-on-primary disabled:opacity-50"
                disabled={!selectedVariant}
                onClick={() => selectedVariant && pendingAction && commit(pendingAction, selectedVariant, quantity)}
                type="button"
              >
                <Check aria-hidden="true" className="size-4" />
                {pendingAction === "buy-now" ? "Tiếp tục mua" : "Thêm vào giỏ"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
