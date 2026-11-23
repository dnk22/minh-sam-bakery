"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCartLine } from "@/landing/features/cart/selection";
import { useCartStore } from "@/landing/features/cart/store/cart-store";
import { saveBuyNowIntent } from "@/landing/features/checkout/store/checkout-intent";
import { routes } from "@/landing/lib/routes";
import type { CatalogProduct, CatalogVariant } from "../types";

export type ProductAction = "buy-now" | "add-to-cart";

/** Transaction intent and variant state; no order API is invoked here. */
export function useProductActions(product: CatalogProduct) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [pendingAction, setPendingAction] = useState<ProductAction | null>(
    null,
  );
  const [variantId, setVariantId] = useState(
    product.pricing.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const variants = product.pricing.variants;
  const selectedVariant =
    variants.find((variant) => variant.id === variantId) ?? variants[0];

  function commit(
    action: ProductAction,
    variant: CatalogVariant,
    amount: number,
  ) {
    const line = createCartLine(product, variant, amount);
    if (action === "add-to-cart") {
      addItem(line);
      setFeedback(`Đã thêm ${amount} sản phẩm vào giỏ hàng`);
    } else {
      if (!saveBuyNowIntent(line)) {
        setFeedback(
          "Không thể lưu thông tin mua hàng. Vui lòng kiểm tra cài đặt trình duyệt.",
        );
        return;
      }
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

  return { pendingAction, setPendingAction, variantId, setVariantId, quantity, setQuantity, feedback, variants, selectedVariant, commit, start };
}
