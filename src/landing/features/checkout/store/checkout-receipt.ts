import type { Order } from "../../../../lib/contracts/order/order.types.ts";
import { isOrder } from "../../../../lib/contracts/order/order.schema.ts";
const KEY = "minh-sam-checkout-receipt-v1";
const PENDING = "minh-sam-checkout-submit-pending-v1";
export function readReceipt(): Order | null {
  try { const value: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "null"); return isOrder(value) ? value : null; } catch { return null; }
}
export function saveReceipt(order: Order) { try { sessionStorage.setItem(KEY, JSON.stringify(order)); } catch {} }
export function clearReceipt() { try { sessionStorage.removeItem(KEY); } catch {} }
export function markPending(): boolean { try { sessionStorage.setItem(PENDING, "1"); return true; } catch { return false; } }
export function hasPending(): boolean { try { return sessionStorage.getItem(PENDING) === "1"; } catch { return false; } }
export function clearPending() { try { sessionStorage.removeItem(PENDING); } catch {} }
