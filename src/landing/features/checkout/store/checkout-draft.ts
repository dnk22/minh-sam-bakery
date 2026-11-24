import type { CheckoutDraft } from "../types.ts";

export const CHECKOUT_DRAFT_KEY = "minh-sam-checkout-contact-v1";

/** Keep the existing session format so returning customers do not lose in-progress forms. */
export function parseCheckoutDraft(value: unknown): CheckoutDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const parsed = value as Partial<CheckoutDraft>;
  if (
    typeof parsed.fullName !== "string" ||
    typeof parsed.phone !== "string" ||
    typeof parsed.email !== "string" ||
    typeof parsed.deliveryAddress !== "string" ||
    typeof parsed.receiveDate !== "string" ||
    typeof parsed.deliveryTime !== "string" ||
    typeof parsed.notes !== "string" ||
    (parsed.fulfillmentMethod !== "pickup" && parsed.fulfillmentMethod !== "delivery") ||
    (parsed.paymentMethod !== "AT_STORE" && parsed.paymentMethod !== "BANK_TRANSFER")
  ) return null;
  return {
    fullName: parsed.fullName,
    phone: parsed.phone,
    email: parsed.email,
    fulfillmentMethod: parsed.fulfillmentMethod,
    deliveryAddress: parsed.deliveryAddress,
    receiveDate: parsed.receiveDate,
    deliveryTime: parsed.deliveryTime,
    notes: parsed.notes,
    paymentMethod: parsed.paymentMethod,
  };
}

export function readCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    return raw ? parseCheckoutDraft(JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function persistCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // A blocked or full sessionStorage must not prevent form editing.
  }
}

export function clearCheckoutDraft() { try { window.sessionStorage.removeItem(CHECKOUT_DRAFT_KEY); } catch {} }
