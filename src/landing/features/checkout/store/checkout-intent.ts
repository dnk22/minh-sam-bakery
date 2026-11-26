import { cartOrigin, currentShoppingUrl, safeReturnTo, clearReceiptOrigin } from "./checkout-return.ts";
import { cartLineKey } from "../../cart/selection.ts";
import type { CartLine, CheckoutIntent } from "../../cart/types.ts";

export const CHECKOUT_INTENT_KEY = "minh-sam-checkout-intent-v1";
export const LEGACY_CHECKOUT_SESSION = "legacy";
export type StoredCheckoutIntent = CheckoutIntent & { sessionId: string };

function validCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartLine>;
  return typeof item.productId === "string" && item.productId.length > 0 &&
    typeof item.productName === "string" &&
    typeof item.productImage === "string" &&
    typeof item.productImageAlt === "string" &&
    typeof item.categorySlug === "string" &&
    typeof item.productSlug === "string" &&
    (item.variantId === null || typeof item.variantId === "string") &&
    typeof item.variantLabel === "string" &&
    typeof item.originalPrice === "number" && Number.isFinite(item.originalPrice) && item.originalPrice >= 0 &&
    typeof item.effectivePrice === "number" && Number.isFinite(item.effectivePrice) && item.effectivePrice >= 0 &&
    Number.isSafeInteger(item.quantity) && (item.quantity ?? 0) >= 1 && (item.quantity ?? 0) <= 20 &&
    item.key === cartLineKey(item.productId, item.variantId ?? null);
}

function writeCheckoutIntent(intent: CheckoutIntent): boolean {
  if (typeof window === "undefined" || intent.items.length === 0) return false;
  try {
    // Each explicit buy-now/cart action creates a distinct checkout session.
    const sessionId = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
    window.sessionStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify({ ...intent, sessionId }));
    window.sessionStorage.removeItem("minh-sam-checkout-receipt-v1");
    clearReceiptOrigin();
    return true;
  } catch {
    return false;
  }
}

export function saveBuyNowIntent(item: CartLine): boolean {
  return writeCheckoutIntent({ source: "buy-now", items: [item], returnTo: currentShoppingUrl() ?? undefined });
}

export function saveCartCheckoutIntent(items: CartLine[]): boolean {
  return writeCheckoutIntent({ source: "cart", items: items.map((item) => ({ ...item })), returnTo: cartOrigin() ?? undefined });
}

export function loadCheckoutIntent(): StoredCheckoutIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_INTENT_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const candidate = data as Partial<StoredCheckoutIntent>;
    if ((candidate.source !== "buy-now" && candidate.source !== "cart") ||
        !Array.isArray(candidate.items) || candidate.items.length === 0 ||
        candidate.items.length > 100 || !candidate.items.every(validCartLine) ||
        (candidate.source === "buy-now" && candidate.items.length !== 1)) return null;
    const sessionId = typeof candidate.sessionId === "string" && /^[0-9a-f]{32}$/.test(candidate.sessionId) ? candidate.sessionId : LEGACY_CHECKOUT_SESSION;
    return { source: candidate.source, items: candidate.items, returnTo: safeReturnTo(candidate.returnTo) ?? undefined, sessionId };
  } catch {
    return null;
  }
}

export function clearCheckoutIntent() { try { window.sessionStorage.removeItem(CHECKOUT_INTENT_KEY); } catch {} }

export function isCurrentCheckoutSession(sessionId: string): boolean {
  return loadCheckoutIntent()?.sessionId === sessionId;
}
