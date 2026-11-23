import type { CartLine, CheckoutIntent } from "../../cart/types";

export const CHECKOUT_INTENT_KEY = "minh-sam-checkout-intent-v1";

export function saveBuyNowIntent(item: CartLine): void {
  if (typeof window === "undefined") return;
  const intent: CheckoutIntent = { source: "buy-now", items: [item] };
  window.sessionStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(intent));
}

export function saveCartCheckoutIntent(items: CartLine[]): void {
  if (typeof window === "undefined" || items.length === 0) return;
  const intent: CheckoutIntent = { source: "cart", items: items.map((item) => ({ ...item })) };
  window.sessionStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(intent));
}
