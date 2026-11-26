"use client";

import { type FormEvent, useEffect, useState, useSyncExternalStore } from "react";

import { useCartHydrated } from "@/landing/features/cart/components/cart-hydration";
import { useCartStore } from "@/landing/features/cart/store/cart-store";
import type { Order, CreateOrderInput } from "@/lib/contracts/order/order.types";
import { buildOrderRequest } from "../utils/order-request-mapper";
import { usePaymentQr } from "./use-payment-qr";
import { useCreateOrder } from "./use-create-order";
import { checkoutReturnTo, receiptOrigin, saveReceiptOrigin, clearReceiptOrigin, clearCartOrigin } from "../store/checkout-return";
import { readReceipt, clearReceipt, hasPending } from "../store/checkout-receipt";
import type { CheckoutIntent } from "@/landing/features/cart/types";

import { readCheckoutDraft, persistCheckoutDraft, clearCheckoutDraft } from "../store/checkout-draft";
import { loadCheckoutIntent, clearCheckoutIntent } from "../store/checkout-intent";
import type { CheckoutDraft, CheckoutErrors, CheckoutField, FulfillmentMethod } from "../types";
import { initialCheckoutDraft, localCalendarDate, normalizeCheckoutDraft, validateCheckoutDraft } from "../validation";

// The session is read only after hydration. The external-store snapshot is a
// stable boolean, not a freshly allocated object.
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function useCheckoutReady() {
  return useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
}

function readInitialSession() {
  const savedReceipt = readReceipt();
  const savedIntent = loadCheckoutIntent();
  return {
    intent: savedReceipt ? null : savedIntent,
    receipt: savedReceipt,
    returnTo: checkoutReturnTo(savedIntent?.returnTo ?? receiptOrigin()),
    blocked: hasPending(),
    draft: savedReceipt ? initialCheckoutDraft() : readCheckoutDraft() ?? initialCheckoutDraft(),
    today: localCalendarDate(),
  };
}

/** Client-only checkout orchestration, mounted after hydration. */
export function useCheckoutController() {
  const [initial] = useState(readInitialSession);
  const [intent, setIntent] = useState<CheckoutIntent | null>(initial.intent);
  const [draft, setDraft] = useState<CheckoutDraft>(initial.draft);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [returnTo] = useState(initial.returnTo);
  const [receipt, setReceipt] = useState<Order | null>(initial.receipt);
  const [transferInput, setTransferInput] = useState<CreateOrderInput | null>(null);
  const [blocked] = useState(initial.blocked);
  const submission = useCreateOrder();
  const paymentQr = usePaymentQr(Boolean(intent) && !receipt);
  const qrReady = paymentQr.status === "ready";
  // A restored transfer draft must not stay selected when QR is unavailable.
  const effectivePaymentMethod = draft.fulfillmentMethod === "delivery" && qrReady ? "BANK_TRANSFER"
    : draft.fulfillmentMethod === "pickup" && paymentQr.status === "unavailable" ? "AT_STORE" : draft.paymentMethod;
  const effectiveDraft = { ...draft, paymentMethod: effectivePaymentMethod };
  const paymentBlocked = !qrReady && (effectiveDraft.paymentMethod === "BANK_TRANSFER" || effectiveDraft.fulfillmentMethod === "delivery");
  const cartHydrated = useCartHydrated();
  const today = initial.today;

  useEffect(() => {
    if (initial.receipt) { clearCheckoutIntent(); clearCheckoutDraft(); }
  }, [initial.receipt]);

  // Persist after React has committed the state, not from inside a state updater.
  // This hook mounts only after hydration, with the restored draft.
  useEffect(() => {
    if (!intent || receipt) return;
    persistCheckoutDraft({ ...draft, paymentMethod: effectivePaymentMethod });
  }, [draft, intent, receipt, effectivePaymentMethod]);

  const updateDraft = (patch: Partial<CheckoutDraft>) => {
    if (patch.paymentMethod === "BANK_TRANSFER" && !qrReady && patch.fulfillmentMethod === undefined) return;
    setDraft((current) => ({ ...current, ...patch }));
    submission.setError("");
    setErrors((current) => {
      const next = { ...current };
      for (const field of Object.keys(patch) as CheckoutField[]) delete next[field];
      if (patch.fulfillmentMethod !== undefined) {
        delete next.deliveryAddress;
        delete next.receiveDate;
        delete next.paymentMethod;
      }
      return next;
    });
  };

  const chooseFulfillment = (fulfillmentMethod: FulfillmentMethod) => {
    updateDraft({
      fulfillmentMethod,
      paymentMethod: fulfillmentMethod === "delivery" ? "BANK_TRANSFER" : !qrReady ? "AT_STORE" : effectiveDraft.paymentMethod,
    });
  };

  const checkInformation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeCheckoutDraft(effectiveDraft);
    const result = validateCheckoutDraft(normalized);
    setDraft(normalized);
    if (paymentBlocked) {
      setErrors({ ...result.errors, paymentMethod: paymentQr.status === "loading" ? "Đang kiểm tra phương thức chuyển khoản." : "Chuyển khoản ngân hàng chưa có sẵn. Vui lòng chọn nhận bánh tại cửa hàng hoặc quay lại sau." });
      return;
    }
    setErrors(result.errors);

    if (result.firstInvalidField) {
      event.currentTarget.querySelector<HTMLElement>(
        `[data-checkout-field="${result.firstInvalidField}"]`,
      )?.focus();
    }
    if (result.firstInvalidField || (intent?.source === "cart" && !cartHydrated) || !intent || blocked || submission.pending || submission.uncertain || transferInput || receipt) return;
    try {
      const input = buildOrderRequest(intent, normalized);
      if (input.paymentMethod === "BANK_TRANSFER") setTransferInput(input);
      else void submit(input);
    } catch (error) { submission.setError(error instanceof Error ? error.message : "Thông tin đặt hàng không hợp lệ."); }
  };

  async function submit(input: CreateOrderInput) {
    if (!intent || (intent.source === "cart" && !cartHydrated)) return;
    await submission.submit(input, order => {
      if (intent.source === "cart") {
        useCartStore.getState().consumePurchasedItems(intent.items);
      }
      saveReceiptOrigin(intent.returnTo);
      if (intent.source === "cart") clearCartOrigin();
      clearCheckoutIntent();
      clearCheckoutDraft();
      setTransferInput(null);
      setReceipt(order);
      setIntent(null);
    });
  }

  return {
    receipt, transferInput, returnTo,
    pending: submission.pending,
    blocked: blocked || submission.uncertain || Boolean(intent?.source === "cart" && !cartHydrated),
    submitError: submission.error || (blocked ? "Chưa xác minh được lần đặt hàng trước. Vui lòng liên hệ cửa hàng trước khi đặt lại." : ""),
    closeTransfer: () => { if (!submission.pending) setTransferInput(null); },
    confirmTransfer: () => { if (transferInput && !blocked && qrReady) void submit(transferInput); },
    closeReceipt: () => { clearReceipt(); clearReceiptOrigin(); setReceipt(null); },
    intent,
    draft: effectiveDraft,
    paymentQr: paymentQr,
    paymentBlocked,
    errors,
    today,
    updateDraft,
    chooseFulfillment,
    checkInformation,
  };
}
