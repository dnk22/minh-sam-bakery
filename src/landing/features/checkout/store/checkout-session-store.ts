import type { Order } from "../../../../lib/contracts/order/order.types.ts";
import type { CartLine } from "../../cart/types.ts";
import { cartOrigin, clearReceiptOrigin, currentShoppingUrl } from "./checkout-return.ts";
import {
  clearStoredCheckoutIntent,
  LEGACY_CHECKOUT_SESSION,
  loadCheckoutIntent,
  writeCheckoutIntent,
  type StoredCheckoutIntent,
} from "./checkout-intent.ts";
import {
  clearPendingSessionId,
  clearStoredReceipt,
  readPendingSessionId,
  readStoredReceipt,
  writePendingSessionId,
  writeStoredReceipt,
  type StoredCheckoutReceipt,
} from "./checkout-receipt.ts";

export type CheckoutSessionSnapshot = {
  intent: StoredCheckoutIntent | null;
  receipt: StoredCheckoutReceipt | null;
  revision: number;
};

const serverSnapshot: CheckoutSessionSnapshot = { intent: null, receipt: null, revision: 0 };
const listeners = new Set<() => void>();
let browserSnapshot: CheckoutSessionSnapshot | null = null;

function readBrowserSnapshot(revision: number): CheckoutSessionSnapshot {
  const receipt = readStoredReceipt();
  return {
    intent: receipt ? null : loadCheckoutIntent(),
    receipt,
    revision,
  };
}

function publish(next: Omit<CheckoutSessionSnapshot, "revision">) {
  const revision = (browserSnapshot?.revision ?? 0) + 1;
  browserSnapshot = { ...next, revision };
  listeners.forEach((listener) => listener());
}

export function getCheckoutSessionSnapshot(): CheckoutSessionSnapshot {
  if (typeof window === "undefined") return serverSnapshot;
  browserSnapshot ??= readBrowserSnapshot(0);
  return browserSnapshot;
}

export function getCheckoutSessionServerSnapshot() {
  return serverSnapshot;
}

export function subscribeCheckoutSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Re-read storage after reload/BFCache restoration and notify mounted Checkout UI. */
export function restoreCheckoutSession() {
  if (typeof window === "undefined") return serverSnapshot;
  browserSnapshot = readBrowserSnapshot((browserSnapshot?.revision ?? 0) + 1);
  listeners.forEach((listener) => listener());
  return browserSnapshot;
}

function beginCheckout(intent: Parameters<typeof writeCheckoutIntent>[0]): boolean {
  const stored = writeCheckoutIntent(intent);
  if (!stored) return false;
  clearStoredReceipt();
  clearPendingSessionId();
  clearReceiptOrigin();
  publish({ intent: stored, receipt: null });
  return true;
}

export function beginBuyNowCheckout(item: CartLine): boolean {
  return beginCheckout({ source: "buy-now", items: [{ ...item }], returnTo: currentShoppingUrl() ?? undefined });
}

export function beginCartCheckout(items: CartLine[]): boolean {
  return beginCheckout({ source: "cart", items: items.map((item) => ({ ...item })), returnTo: cartOrigin() ?? undefined });
}

export function isCurrentCheckoutSession(sessionId: string): boolean {
  return getCheckoutSessionSnapshot().intent?.sessionId === sessionId;
}

export function isCheckoutSessionPending(sessionId: string): boolean {
  const pending = readPendingSessionId();
  return pending === sessionId || (pending === "1" && sessionId === LEGACY_CHECKOUT_SESSION);
}

export function markCheckoutSessionPending(sessionId: string): boolean {
  if (!isCurrentCheckoutSession(sessionId) || isCheckoutSessionPending(sessionId)) return false;
  return writePendingSessionId(sessionId);
}

export function clearCheckoutSessionPending(sessionId: string) {
  clearPendingSessionId(sessionId);
}

export function completeCheckoutSession(sessionId: string, order: Order): boolean {
  if (!isCurrentCheckoutSession(sessionId)) return false;
  const receipt = { sessionId, order };
  writeStoredReceipt(receipt);
  clearStoredCheckoutIntent();
  clearPendingSessionId(sessionId);
  publish({ intent: null, receipt });
  return true;
}

export function clearCheckoutReceipt() {
  clearStoredReceipt();
  const current = getCheckoutSessionSnapshot();
  publish({ intent: current.intent, receipt: null });
}
