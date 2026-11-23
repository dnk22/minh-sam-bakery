"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Minus, Plus, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { formatVnd } from "../../pricing";
import type { CatalogProduct, CatalogVariant } from "../../types";
import type { ProductAction } from "../../hooks/use-product-actions";

export function ProductVariantDialog({
  product, pendingAction, setPendingAction, variants, setVariantId,
  quantity, setQuantity, selectedVariant, commit,
}: {
  product: CatalogProduct;
  pendingAction: ProductAction | null;
  setPendingAction: Dispatch<SetStateAction<ProductAction | null>>;
  variants: CatalogVariant[];
  setVariantId: Dispatch<SetStateAction<string>>;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  selectedVariant: CatalogVariant | undefined;
  commit: (action: ProductAction, variant: CatalogVariant, amount: number) => void;
}) {
  return (
      <Dialog.Root
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-primary/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[91] max-h-[90dvh] w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-surface-container-lowest p-space-lg text-on-surface shadow-2xl">
            <div className="flex items-start justify-between gap-space-md">
              <div>
                <Dialog.Title className="font-headline-md text-headline-md text-primary">
                  Chọn loại
                </Dialog.Title>
                <Dialog.Description className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {product.name}
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Đóng chọn biến thể"
                className="rounded p-2 text-primary hover:bg-surface-container"
              >
                <X aria-hidden="true" className="size-5" />
              </Dialog.Close>
            </div>

            <fieldset className="mt-space-lg space-y-2">
              <legend className="mb-2 font-label-ui text-label-ui font-semibold text-on-surface">
                Quy cách
              </legend>
              {variants.map((variant) => (
                <label
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${variant.id === selectedVariant?.id ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface"}`}
                  key={variant.id}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      checked={variant.id === selectedVariant?.id}
                      className="size-4 accent-primary"
                      name={`product-variant-${product.id}`}
                      onChange={() => setVariantId(variant.id)}
                      type="radio"
                      value={variant.id}
                    />
                    <span className="font-body-md text-body-md text-primary">
                      {variant.label}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-price-serif text-[16px] font-semibold text-primary">
                      {formatVnd(variant.effectivePrice)}
                    </span>
                    {variant.hasDiscount ? (
                      <del className="text-[11px] text-outline">
                        {formatVnd(variant.originalPrice)}
                      </del>
                    ) : null}
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="mt-space-md flex items-center justify-between">
              <span className="font-label-ui text-label-ui font-semibold text-on-surface">
                Số lượng
              </span>
              <div className="flex items-center rounded-lg bg-surface-container-low">
                <button
                  aria-label="Giảm số lượng"
                  className="flex size-10 items-center justify-center disabled:opacity-40"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  type="button"
                >
                  <Minus className="size-4" />
                </button>
                <output className="w-10 text-center font-label-ui">
                  {quantity}
                </output>
                <button
                  aria-label="Tăng số lượng"
                  className="flex size-10 items-center justify-center disabled:opacity-40"
                  disabled={quantity >= 20}
                  onClick={() =>
                    setQuantity((value) => Math.min(20, value + 1))
                  }
                  type="button"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-space-lg flex items-center justify-between gap-2 border-t border-outline-variant pt-space-md">
              <div>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">
                  Tạm tính
                </span>
                <strong className="font-price-serif text-[22px] text-primary">
                  {formatVnd((selectedVariant?.effectivePrice ?? 0) * quantity)}
                </strong>
              </div>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-space-lg font-label-ui text-label-ui font-semibold text-on-primary disabled:opacity-50"
                disabled={!selectedVariant}
                onClick={() =>
                  selectedVariant &&
                  pendingAction &&
                  commit(pendingAction, selectedVariant, quantity)
                }
                type="button"
              >
                <Check aria-hidden="true" className="size-4" />
                {pendingAction === "buy-now" ? "Tiếp tục mua" : "Thêm vào giỏ"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
  );
}
