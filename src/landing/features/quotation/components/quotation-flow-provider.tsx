"use client";

import { createContext, type FormEvent, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { submitQuotation } from "../submit-quotation";
import type { QuotationErrors, QuotationFlowState, QuotationProductContext, QuotationReceipt, QuotationRequestDraft } from "../types";
import { normalizeQuotationDraft, validateQuotationDraft } from "../validation";
import { QuotationRequestDrawer } from "./quotation-request-drawer";
import { QuotationSuccessDrawer } from "./quotation-success-drawer";

type QuotationFlowController = {
  openQuotation: (trigger?: HTMLElement) => void;
};

const QuotationFlowContext = createContext<QuotationFlowController | null>(null);

export function QuotationFlowProvider({ children, product }: { children: ReactNode; product: QuotationProductContext }) {
  const [flowState, setFlowState] = useState<QuotationFlowState>("closed");
  const [draft, setDraft] = useState<QuotationRequestDraft>(() => createInitialDraft(product));
  const [errors, setErrors] = useState<QuotationErrors>({});
  const [submitError, setSubmitError] = useState<string>();
  const [receipt, setReceipt] = useState<QuotationReceipt>();
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const submissionSequence = useRef(0);
  const isOpen = flowState !== "closed";

  const closeQuotation = useCallback(() => {
    submissionSequence.current += 1;
    setFlowState("closed");
    setSubmitError(undefined);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const openQuotation = useCallback((trigger?: HTMLElement) => {
    triggerRef.current = trigger ?? null;
    setDraft(createInitialDraft(product));
    setErrors({});
    setSubmitError(undefined);
    setReceipt(undefined);
    setFlowState("editing");
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeQuotation();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute("inert"));
      if (focusable.length === 0) return;
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
  }, [closeQuotation, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const animationFrame = window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => window.cancelAnimationFrame(animationFrame);
  }, [flowState, isOpen]);

  function updateDraft(patch: Partial<QuotationRequestDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof QuotationErrors)[]) delete next[key];
      return next;
    });
    if (flowState === "error") {
      setFlowState("editing");
      setSubmitError(undefined);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (flowState === "submitting") return;
    const normalized = normalizeQuotationDraft(draft);
    const validation = validateQuotationDraft(normalized);
    setDraft(normalized);
    setErrors(validation.errors);
    setSubmitError(undefined);
    if (validation.firstInvalidField) {
      window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>(`[data-field="${validation.firstInvalidField}"]`)?.focus());
      return;
    }

    const submissionId = ++submissionSequence.current;
    setFlowState("submitting");
    const result = await submitQuotation(normalized);
    if (submissionSequence.current !== submissionId) return;
    if (!result.ok) {
      setSubmitError(result.message);
      setFlowState("error");
      return;
    }
    setReceipt(result.receipt);
    setFlowState("success");
  }

  const controller = useMemo(() => ({ openQuotation }), [openQuotation]);

  return (
    <QuotationFlowContext.Provider value={controller}>
      {children}
      {isOpen && <button aria-label="Đóng bảng yêu cầu báo giá" className="fixed inset-0 z-[70] cursor-default bg-primary/60 backdrop-blur-sm" onClick={closeQuotation} tabIndex={-1} type="button" />}
      {(flowState === "editing" || flowState === "submitting" || flowState === "error") && <QuotationRequestDrawer dialogRef={dialogRef} draft={draft} errors={errors} flowState={flowState} onClose={closeQuotation} onSubmit={handleSubmit} onUpdate={updateDraft} product={product} submitError={submitError} />}
      {flowState === "success" && receipt && <QuotationSuccessDrawer dialogRef={dialogRef} onClose={closeQuotation} product={product} receipt={receipt} />}
    </QuotationFlowContext.Provider>
  );
}

export function useQuotationFlow() {
  const context = useContext(QuotationFlowContext);
  if (!context) throw new Error("useQuotationFlow must be used inside QuotationFlowProvider");
  return context;
}

function createInitialDraft(product: QuotationProductContext): QuotationRequestDraft {
  return {
    productId: product.id,
    productSlug: product.slug,
    quantityRange: "31-100",
    occasion: "tet",
    contactName: "",
    phone: "",
    desiredDeliveryDate: "",
    notes: "",
  };
}
