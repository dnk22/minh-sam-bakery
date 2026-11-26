import type { Order } from "../../../../lib/contracts/order/order.types.ts";
import { isOrder } from "../../../../lib/contracts/order/order.schema.ts";
import { LEGACY_CHECKOUT_SESSION } from "./checkout-intent.ts";
import { CHECKOUT_PENDING_KEY, CHECKOUT_RECEIPT_KEY } from "./checkout-storage-keys.ts";

export type StoredCheckoutReceipt = { sessionId: string; order: Order };

export function readStoredReceipt(): StoredCheckoutReceipt | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(CHECKOUT_RECEIPT_KEY) ?? "null");
    if (isOrder(value)) return { sessionId: LEGACY_CHECKOUT_SESSION, order: value };
    if (!value || typeof value !== "object") return null;
    const candidate = value as Partial<StoredCheckoutReceipt>;
    return typeof candidate.sessionId === "string" && isOrder(candidate.order)
      ? { sessionId: candidate.sessionId, order: candidate.order }
      : null;
  } catch { return null; }
}

export function writeStoredReceipt(receipt: StoredCheckoutReceipt): boolean {
  try { sessionStorage.setItem(CHECKOUT_RECEIPT_KEY, JSON.stringify(receipt)); return true; } catch { return false; }
}

export function clearStoredReceipt() {
  try { sessionStorage.removeItem(CHECKOUT_RECEIPT_KEY); } catch { /* storage unavailable */ }
}

export function readPendingSessionId(): string | null {
  try { return sessionStorage.getItem(CHECKOUT_PENDING_KEY); } catch { return null; }
}

export function writePendingSessionId(sessionId: string): boolean {
  try { sessionStorage.setItem(CHECKOUT_PENDING_KEY, sessionId); return true; } catch { return false; }
}

export function clearPendingSessionId(expectedSessionId?: string) {
  try {
    const current = sessionStorage.getItem(CHECKOUT_PENDING_KEY);
    if (expectedSessionId === undefined || current === expectedSessionId || (current === "1" && expectedSessionId === LEGACY_CHECKOUT_SESSION)) {
      sessionStorage.removeItem(CHECKOUT_PENDING_KEY);
    }
  } catch { /* storage unavailable */ }
}
