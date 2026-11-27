"use client";

import { useEffect, useRef, useState } from "react";
import { validatePaymentProofFile } from "@/lib/contracts/order/payment-proof";
import { uploadPaymentProof } from "../api/payment-upload.client";
import { isCurrentCheckoutSession } from "../store/checkout-session-store";

type UploadState =
  | { status: "idle"; file: null; url: null; error: string }
  | { status: "uploading" | "failed"; file: File; url: null; error: string }
  | { status: "ready"; file: File; url: string; error: string };

const idle: UploadState = { status: "idle", file: null, url: null, error: "" };

export function usePaymentUpload(sessionId: string | null) {
  const [state, setState] = useState<UploadState>(idle);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => { active.current?.abort(); }, []);

  function clear() {
    active.current?.abort();
    active.current = null;
    setState(idle);
  }

  async function select(file: File) {
    if (!sessionId || !isCurrentCheckoutSession(sessionId)) return;
    active.current?.abort();
    active.current = null;
    const validation = validatePaymentProofFile(file);
    if (validation) { setState({ ...idle, error: validation }); return; }
    const controller = new AbortController();
    active.current = controller;
    setState({ status: "uploading", file, url: null, error: "" });
    try {
      const url = await uploadPaymentProof(file, controller.signal);
      if (active.current !== controller || !isCurrentCheckoutSession(sessionId)) return;
      if (controller.signal.aborted) throw new Error("Upload cancelled");
      setState({ status: "ready", file, url, error: "" });
    } catch {
      if (active.current !== controller || !isCurrentCheckoutSession(sessionId)) return;
      setState({ status: "failed", file, url: null, error: "Không thể tải ảnh chứng từ. Vui lòng thử lại." });
    } finally {
      if (active.current === controller) active.current = null;
    }
  }

  return { ...state, select, clear, retry: () => { if (state.file && state.status === "failed") void select(state.file); } };
}

export type PaymentUpload = ReturnType<typeof usePaymentUpload>;
