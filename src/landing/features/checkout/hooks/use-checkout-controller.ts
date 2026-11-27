"use client";

import { type FormEvent, useEffect, useState, useSyncExternalStore } from "react";

import { normalizeVietnamMobilePhone } from "@/lib/contracts/order/vietnam-mobile-phone";
import { useCartHydrated } from "@/landing/features/cart/components/cart-hydration";
import { useCartStore } from "@/landing/features/cart/store/cart-store";
import type { CreateOrderInput } from "@/lib/contracts/order/order.types";
import { buildOrderRequest, finalizeTransferOrder } from "../utils/order-request-mapper";
import { usePaymentUpload } from "./use-payment-upload";
import { usePaymentQr } from "./use-payment-qr";
import { useCreateOrder } from "./use-create-order";
import { checkoutReturnTo, receiptOrigin, saveReceiptOrigin, clearReceiptOrigin, clearCartOrigin } from "../store/checkout-return";

import { readCheckoutDraft, persistCheckoutDraft, clearCheckoutDraft } from "../store/checkout-draft";
import {
  clearCheckoutReceipt,
  isCheckoutSessionPending,
  isCurrentCheckoutSession,
  type CheckoutSessionSnapshot,
} from "../store/checkout-session-store";
import type { CheckoutDraft, CheckoutErrors, CheckoutField, FulfillmentMethod } from "../types";
import { initialCheckoutDraft, localCalendarDate, normalizeCheckoutDraft, validateCheckoutDraft, validateCheckoutPhone } from "../validation";

// The session is read only after hydration. The external-store snapshot is a
// stable boolean, not a freshly allocated object.
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function useCheckoutReady() {
  return useSyncExternalStore(subscribeHydration, clientSnapshot, serverSnapshot);
}

/** Client-only checkout orchestration, mounted after hydration. */
export function useCheckoutController(session: CheckoutSessionSnapshot) {
  const { intent, receipt: storedReceipt } = session;
  const receipt = storedReceipt?.order ?? null;
  const [draft, setDraft] = useState<CheckoutDraft>(() => receipt ? initialCheckoutDraft() : readCheckoutDraft() ?? initialCheckoutDraft());
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [returnTo] = useState(() => checkoutReturnTo(intent?.returnTo ?? receiptOrigin()));
  const [transferInput, setTransferInput] = useState<CreateOrderInput | null>(null);
  const [restoredBlocked] = useState(() => Boolean(intent && isCheckoutSessionPending(intent.sessionId)));
  const submission = useCreateOrder(intent?.sessionId ?? null);
  const paymentUpload = usePaymentUpload(intent?.sessionId ?? null);
  const paymentQr = usePaymentQr(intent?.sessionId ?? null, !receipt);
  const qrReady = paymentQr.status === "ready";
  // A restored transfer draft must not stay selected when QR is unavailable.
  const effectivePaymentMethod = draft.fulfillmentMethod === "delivery" && qrReady ? "BANK_TRANSFER"
    : draft.fulfillmentMethod === "pickup" && paymentQr.status === "unavailable" ? "AT_STORE" : draft.paymentMethod;
  const effectiveDraft = { ...draft, paymentMethod: effectivePaymentMethod };
  const paymentBlocked = paymentQr.status === "loading" || (!qrReady && (effectiveDraft.paymentMethod === "BANK_TRANSFER" || effectiveDraft.fulfillmentMethod === "delivery"));
  const cartHydrated = useCartHydrated();
  const today = localCalendarDate();

  useEffect(() => {
    if (receipt) clearCheckoutDraft();
  }, [receipt]);

  // Persist after React has committed the state, not from inside a state updater.
  // This hook mounts only after hydration, with the restored draft.
  useEffect(() => {
    if (!intent || receipt || !isCurrentCheckoutSession(intent.sessionId)) return;
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

  const validatePhoneOnBlur = (value: string) => {
    const message = validateCheckoutPhone(value);
    const normalized = normalizeVietnamMobilePhone(value);
    if (normalized) setDraft(current => ({ ...current, phone: normalized }));
    setErrors(current => {
      const next = { ...current };
      if (message) next.phone = message;
      else delete next.phone;
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
    if (paymentQr.status === "loading") return;
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
    if (result.firstInvalidField || (intent?.source === "cart" && !cartHydrated) || !intent || restoredBlocked || submission.pending || submission.uncertain || transferInput || receipt) return;
    try {
      const input = buildOrderRequest(intent, normalized);
      if (input.paymentMethod === "BANK_TRANSFER") setTransferInput(input);
      else { paymentUpload.clear(); void submit(input); }
    } catch (error) { submission.setError(error instanceof Error ? error.message : "Thông tin đặt hàng không hợp lệ."); }
  };

  async function submit(input: CreateOrderInput) {
    if (!intent || (intent.source === "cart" && !cartHydrated)) return;
    await submission.submit(input, () => {
      if (intent.source === "cart") {
        useCartStore.getState().consumePurchasedItems(intent.items);
      }
      saveReceiptOrigin(intent.returnTo);
      if (intent.source === "cart") clearCartOrigin();
      clearCheckoutDraft();
      setTransferInput(null);
    });
  }

  return {
    receipt, transferInput, returnTo,
    pending: submission.pending,
    blocked: restoredBlocked || submission.uncertain || Boolean(intent?.source === "cart" && !cartHydrated),
    submitError: submission.error || (restoredBlocked ? "Chưa xác minh được lần đặt hàng này. Vui lòng kiểm tra với cửa hàng trước khi bắt đầu đơn hàng mới." : ""),
    closeTransfer: () => { if (!submission.pending) setTransferInput(null); },
    paymentUpload,
    confirmTransfer: () => {
      if (!transferInput || restoredBlocked || submission.pending || submission.uncertain || !qrReady || paymentUpload.status !== "ready") return;
      try { void submit(finalizeTransferOrder(transferInput, paymentUpload.url)); }
      catch (error) { submission.setError(error instanceof Error ? error.message : "Ảnh chứng từ không hợp lệ."); }
    },
    closeReceipt: () => { clearCheckoutReceipt(); clearReceiptOrigin(); },
    intent,
    draft: effectiveDraft,
    paymentQr: paymentQr,
    paymentBlocked,
    errors,
    today,
    updateDraft,
    validatePhoneOnBlur,
    chooseFulfillment,
    checkInformation,
  };
}
