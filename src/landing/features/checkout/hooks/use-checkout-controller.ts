"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

import type { CheckoutIntent } from "@/landing/features/cart/types";

import { readCheckoutDraft, persistCheckoutDraft } from "../store/checkout-draft";
import { loadCheckoutIntent } from "../store/checkout-intent";
import type { CheckoutDraft, CheckoutErrors, CheckoutField, FulfillmentMethod } from "../types";
import { initialCheckoutDraft, localCalendarDate, normalizeCheckoutDraft, validateCheckoutDraft } from "../validation";

/**
 * Client-only checkout orchestration. UI sections receive only their data and event callbacks.
 * Submitting validates the form; it deliberately does NOT create a Backend order yet.
 */
export function useCheckoutController() {
  const [loaded, setLoaded] = useState(false);
  const [intent, setIntent] = useState<CheckoutIntent | null>(null);
  const [draft, setDraft] = useState<CheckoutDraft>(initialCheckoutDraft);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formChecked, setFormChecked] = useState(false);
  const [today, setToday] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIntent(loadCheckoutIntent());
    const savedDraft = readCheckoutDraft();
    if (savedDraft) setDraft(savedDraft);
    setToday(localCalendarDate());
    setLoaded(true);
  }, []);

  // Persist after React has committed the state, not from inside a state updater.
  // The hydration guard prevents the initial empty draft from overwriting saved data.
  useEffect(() => {
    if (!loaded) return;
    persistCheckoutDraft(draft);
  }, [draft, loaded]);

  const updateDraft = (patch: Partial<CheckoutDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setFormChecked(false);
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
    setFormChecked(!result.firstInvalidField);
    if (result.firstInvalidField) {
      formRef.current?.querySelector<HTMLElement>(
        `[data-checkout-field="${result.firstInvalidField}"]`,
      )?.focus();
    }
    // No fake order, transfer receipt or payment confirmation.
  };

  return {
    loaded,
    intent,
    draft,
    errors,
    formChecked,
    today,
    formRef,
    updateDraft,
    chooseFulfillment,
    checkInformation,
  };
}
