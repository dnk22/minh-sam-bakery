"use client";

import { pageLoading } from "../../../../shared/stores/page-loading.store.ts";
import { useEffect, useState } from "react";
import type { QrPaymentConfig } from "../../../../lib/contracts/qr-payment/qr-payment.types.ts";
import { getPaymentQr } from "../api/payment-qr.client.ts";
import { isCurrentCheckoutSession } from "../store/checkout-session-store.ts";

export type PaymentQrState = { status: "loading" | "unavailable" } | { status: "ready"; config: QrPaymentConfig };
type ScopedPaymentQrState = PaymentQrState & { sessionId: string | null };

export async function loadPaymentQrForSession(
  sessionId: string,
  signal: AbortSignal,
  loader: (signal: AbortSignal) => Promise<QrPaymentConfig> = getPaymentQr,
) {
  const config = await loader(signal);
  return !signal.aborted && isCurrentCheckoutSession(sessionId) ? config : null;
}

export function usePaymentQr(sessionId: string | null, enabled: boolean) {
  const [state, setState] = useState<ScopedPaymentQrState>({ sessionId, status: "loading" });
  const visible: PaymentQrState = state.sessionId === sessionId ? state : { status: "loading" };
  useEffect(() => {
    if (!enabled || !sessionId) return;
    const controller = new AbortController();
    const release = pageLoading.begin();
    void loadPaymentQrForSession(sessionId, controller.signal).then(config => {
      if (config) setState({ sessionId, status: "ready", config });
    }).catch(() => {
      if (!controller.signal.aborted && isCurrentCheckoutSession(sessionId)) setState({ sessionId, status: "unavailable" });
    }).finally(release);
    return () => { controller.abort(); release(); };
  }, [enabled, sessionId]);
  return visible;
}
