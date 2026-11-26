import { cartLineKey } from "../../cart/selection.ts";
import type { CartLine, CheckoutIntent } from "../../cart/types.ts";
import { safeReturnTo } from "./checkout-return.ts";
import { CHECKOUT_INTENT_KEY } from "./checkout-storage-keys.ts";

export { CHECKOUT_INTENT_KEY } from "./checkout-storage-keys.ts";
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

export function writeCheckoutIntent(intent: CheckoutIntent): StoredCheckoutIntent | null {
  if (typeof window === "undefined" || intent.items.length === 0) return null;
  try {
    const sessionId = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
    const stored = { ...intent, sessionId };
    window.sessionStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(stored));
    return stored;
  } catch {
    return null;
  }
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

export function clearStoredCheckoutIntent() {
  try { window.sessionStorage.removeItem(CHECKOUT_INTENT_KEY); } catch { /* storage unavailable */ }
}
