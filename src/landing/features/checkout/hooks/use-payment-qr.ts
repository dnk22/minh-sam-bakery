"use client";

import { useEffect, useState } from "react";
import type { QrPaymentConfig } from "@/lib/contracts/qr-payment/qr-payment.types";
import { getPaymentQr } from "../api/payment-qr.client";

export type PaymentQrState = { status: "loading" | "unavailable" } | { status: "ready"; config: QrPaymentConfig };

export function usePaymentQr(enabled: boolean) {
  const [state, setState] = useState<PaymentQrState>({ status: "loading" });
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void getPaymentQr(controller.signal).then(config => {
      if (!controller.signal.aborted) setState({ status: "ready", config });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ status: "unavailable" });
    });
    return () => controller.abort();
  }, [enabled]);
  return state;
}
