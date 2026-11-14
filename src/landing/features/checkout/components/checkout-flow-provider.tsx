"use client";

import { createContext, type FormEvent, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import type { CheckoutDraft, CheckoutErrors, CheckoutLineItem, CheckoutReceipt, CheckoutStage } from "../types";
import { normalizeCheckoutDraft, validateCheckoutDraft } from "../validation";
import { CheckoutOrderDrawer } from "./checkout-order-drawer";
import { CheckoutPickupSuccessDrawer } from "./checkout-pickup-success-drawer";
import { CheckoutTransferDrawer } from "./checkout-transfer-drawer";

type CheckoutFlowController = {
  openCheckout: (item: CheckoutLineItem, trigger?: HTMLElement) => void;
};

const CheckoutFlowContext = createContext<CheckoutFlowController | null>(null);

export function CheckoutFlowProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<CheckoutStage>("closed");
  const [item, setItem] = useState<CheckoutLineItem>();
  const [draft, setDraft] = useState<CheckoutDraft>(createInitialDraft);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [receipt, setReceipt] = useState<CheckoutReceipt>();
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const isOpen = stage !== "closed";

  const closeCheckout = useCallback(() => {
    setStage("closed");
    setErrors({});
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const openCheckout = useCallback((nextItem: CheckoutLineItem, trigger?: HTMLElement) => {
    triggerRef.current = trigger ?? null;
    setItem(nextItem);
    setDraft(createInitialDraft());
    setErrors({});
    setReceipt(undefined);
    setStage("editing");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCheckout();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute("inert"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCheckout, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, stage]);

  function updateDraft(patch: Partial<CheckoutDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof CheckoutErrors)[]) delete next[key];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeCheckoutDraft(draft);
    const validation = validateCheckoutDraft(normalized);
    setDraft(normalized);
    setErrors(validation.errors);
    if (validation.firstInvalidField) {
      window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>(`[data-field="${validation.firstInvalidField}"]`)?.focus());
      return;
    }

    setReceipt({ orderCode: createOrderCode(), createdAt: new Date().toISOString() });
    setStage(normalized.fulfillmentMethod === "pickup" ? "pickup-success" : "bank-transfer");
  }

  const controller = useMemo(() => ({ openCheckout }), [openCheckout]);

  return (
    <CheckoutFlowContext.Provider value={controller}>
      {children}
      {isOpen ? <button aria-label="Đóng bảng đặt hàng" className="fixed inset-0 z-[70] cursor-default bg-primary/50 backdrop-blur-[3px]" onClick={closeCheckout} tabIndex={-1} type="button" /> : null}
      {stage === "editing" && item ? <CheckoutOrderDrawer dialogRef={dialogRef} draft={draft} errors={errors} item={item} onClose={closeCheckout} onSubmit={handleSubmit} onUpdate={updateDraft} /> : null}
      {stage === "pickup-success" && item && receipt ? <CheckoutPickupSuccessDrawer dialogRef={dialogRef} draft={draft} item={item} onClose={closeCheckout} receipt={receipt} /> : null}
      {stage === "bank-transfer" && item && receipt ? <CheckoutTransferDrawer dialogRef={dialogRef} draft={draft} item={item} onBack={() => setStage("editing")} onClose={closeCheckout} receipt={receipt} /> : null}
    </CheckoutFlowContext.Provider>
  );
}

export function useCheckoutFlow() {
  const context = useContext(CheckoutFlowContext);
  if (!context) throw new Error("useCheckoutFlow must be used inside CheckoutFlowProvider");
  return context;
}

function createInitialDraft(): CheckoutDraft {
  return { fullName: "", phone: "", email: "", fulfillmentMethod: "pickup", deliveryAddress: "", receiveDate: "", notes: "" };
}

function createOrderCode() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `MS-${date}-${String(now.getTime()).slice(-4)}`;
}
