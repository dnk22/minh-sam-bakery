"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import { useCartHydrated } from "@/landing/features/cart/components/cart-hydration";
import { useCartStore } from "@/landing/features/cart/store/cart-store";
import type { Order, CreateOrderInput } from "@/lib/contracts/order/order.types";
import { buildOrderRequest } from "../utils/order-request-mapper";
import { useCreateOrder } from "./use-create-order";
import { checkoutReturnTo, receiptOrigin, saveReceiptOrigin, clearReceiptOrigin, clearCartOrigin } from "../store/checkout-return";
import { readReceipt, clearReceipt, hasPending } from "../store/checkout-receipt";
import type { CheckoutIntent } from "@/landing/features/cart/types";

import { readCheckoutDraft, persistCheckoutDraft, clearCheckoutDraft } from "../store/checkout-draft";
import { loadCheckoutIntent, clearCheckoutIntent } from "../store/checkout-intent";
import type { CheckoutDraft, CheckoutErrors, CheckoutField, FulfillmentMethod } from "../types";
import { initialCheckoutDraft, localCalendarDate, normalizeCheckoutDraft, validateCheckoutDraft } from "../validation";

/** Client-only checkout orchestration. */
export function useCheckoutController() {
  const [loaded, setLoaded] = useState(false);
  const [intent, setIntent] = useState<CheckoutIntent | null>(null);
  const [draft, setDraft] = useState<CheckoutDraft>(initialCheckoutDraft);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [returnTo, setReturnTo] = useState<string>("/tim-kiem");
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [transferInput, setTransferInput] = useState<CreateOrderInput | null>(null);
  const [blocked, setBlocked] = useState(false);
  const submission = useCreateOrder();
  const cartHydrated = useCartHydrated();
  const [today, setToday] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const savedIntent = loadCheckoutIntent();
    setIntent(savedIntent);
    setReturnTo(checkoutReturnTo(savedIntent?.returnTo ?? receiptOrigin()));
    const savedReceipt = readReceipt();
    if (savedReceipt) { setReceipt(savedReceipt); setIntent(null); clearCheckoutIntent(); clearCheckoutDraft(); }
    setBlocked(hasPending());
    const savedDraft = readCheckoutDraft();
    if (savedDraft && !savedReceipt) setDraft(savedDraft);
    setToday(localCalendarDate());
    setLoaded(true);
  }, []);

  // Persist after React has committed the state, not from inside a state updater.
  // The hydration guard prevents the initial empty draft from overwriting saved data.
  useEffect(() => {
    if (!loaded || !intent || receipt) return;
    persistCheckoutDraft(draft);
  }, [draft, loaded, intent, receipt]);

  const updateDraft = (patch: Partial<CheckoutDraft>) => {
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
      paymentMethod: fulfillmentMethod === "delivery" && draft.paymentMethod === "AT_STORE"
        ? "BANK_TRANSFER" : draft.paymentMethod,
    });
  };

  const checkInformation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeCheckoutDraft(draft);
    const result = validateCheckoutDraft(normalized);
    setDraft(normalized);
    setErrors(result.errors);

    if (result.firstInvalidField) {
      formRef.current?.querySelector<HTMLElement>(
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
    confirmTransfer: () => { if (transferInput && !blocked) void submit(transferInput); },
    closeReceipt: () => { clearReceipt(); clearReceiptOrigin(); setReceipt(null); },
    loaded,
    intent,
    draft,
    errors,
    today,
    formRef,
    updateDraft,
    chooseFulfillment,
    checkInformation,
  };
}
