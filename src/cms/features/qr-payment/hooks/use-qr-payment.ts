"use client";

import { useQuery } from "@tanstack/react-query";
import { getSystemConfigs } from "@/cms/features/system-configs/api/system-configs.client";
import { systemConfigQueryKeys } from "@/cms/features/system-configs/lib/system-config-query-keys";
import { QR_PAYMENT_KEY } from "../constants";
import { selectQrPayment } from "../utils/qr-payment-data";
import type { SystemConfig } from "@/cms/features/system-configs/types";

export const qrPaymentQueryKey = [...systemConfigQueryKeys.lists(), "qr-payment-singleton"] as const;

export async function fetchQrPayment(signal?: AbortSignal): Promise<SystemConfig[]> {
  const matches: SystemConfig[] = [];
  // Search may match substrings. Exhaust pages before declaring the exact key absent.
  for (let page = 1; page <= 100; page++) {
    const result = await getSystemConfigs({ page, limit: 100, search: QR_PAYMENT_KEY }, signal);
    matches.push(...selectQrPayment(result.items));
    if (page >= result.pagination.totalPages) return matches;
  }
  throw new Error("Không thể xác minh đầy đủ cấu hình QR thanh toán.");
}

export function useQrPayment() {
  return useQuery({ queryKey: qrPaymentQueryKey, queryFn: ({ signal }) => fetchQrPayment(signal), staleTime: 0, refetchOnMount: "always" });
}
