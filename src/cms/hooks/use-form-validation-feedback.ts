"use client";

import { useCallback } from "react";
import type { FieldErrors, FieldValues, SubmitErrorHandler } from "react-hook-form";

import { findFirstFormErrorPath } from "@/cms/lib/form-validation";
import { notify } from "@/cms/lib/notifications";

const DEFAULT_MESSAGE = "Vui lòng kiểm tra lại các trường chưa hợp lệ.";

export function focusCmsFormIssue(formId: string, fieldName?: string) {
  window.requestAnimationFrame(() => {
    const form = document.getElementById(formId);
    if (!form) return;
    const candidates = Array.from(form.querySelectorAll<HTMLElement>("[name], [data-cms-field], [aria-invalid='true'], [data-upload-pending]"));
    const target = candidates.find((element) => element.getAttribute("name") === fieldName)
      ?? candidates.find((element) => element.dataset.cmsField === fieldName)
      ?? (fieldName === "__upload__" ? candidates.find((element) => element.dataset.uploadPending === "true") : undefined)
      ?? candidates.find((element) => element.getAttribute("aria-invalid") === "true");
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    target.focus({ preventScroll: true });
  });
}

export function useFormValidationFeedback<TValues extends FieldValues>({
  formId,
  message = DEFAULT_MESSAGE,
}: {
  formId: string;
  message?: string;
}) {
  return useCallback<SubmitErrorHandler<TValues>>((errors: FieldErrors<TValues>) => {
    notify.error(message, `validation:${formId}`);
    focusCmsFormIssue(formId, findFirstFormErrorPath(errors));
  }, [formId, message]);
}
