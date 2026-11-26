import type { Order } from "../../../../lib/contracts/order/order.types.ts";
import { isOrder } from "../../../../lib/contracts/order/order.schema.ts";
import { isCurrentCheckoutSession, LEGACY_CHECKOUT_SESSION } from "./checkout-intent.ts";
const KEY = "minh-sam-checkout-receipt-v1";
const PENDING = "minh-sam-checkout-submit-pending-v1";
export function readReceipt(): Order | null {
  try { const value: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "null"); return isOrder(value) ? value : null; } catch { return null; }
}
export function saveReceipt(order: Order) { try { sessionStorage.setItem(KEY, JSON.stringify(order)); } catch {} }
export function clearReceipt() { try { sessionStorage.removeItem(KEY); } catch {} }
export function hasPending(sessionId: string): boolean {
  try {
    const pending = sessionStorage.getItem(PENDING);
    return pending === sessionId || (pending === "1" && sessionId === LEGACY_CHECKOUT_SESSION);
  } catch { return false; }
}

export function markPending(sessionId: string): boolean {
  try {
    if (!isCurrentCheckoutSession(sessionId) || hasPending(sessionId)) return false;
    sessionStorage.setItem(PENDING, sessionId);
    return true;
  } catch { return false; }
}

export function clearPending(sessionId: string) {
  try { if (hasPending(sessionId)) sessionStorage.removeItem(PENDING); } catch {}
}
