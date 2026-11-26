import { QR_PAYMENT_KEY, QR_PAYMENT_DESCRIPTION } from "../constants.ts";
import type { QrPaymentConfig } from "../types.ts";

export function readQrPaymentValue(value: string): QrPaymentConfig | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const data = parsed as Record<string, unknown>;
    if (typeof data.accountNumber !== "string" || typeof data.accountHolder !== "string" ||
        typeof data.bankName !== "string" || typeof data.bankBranch !== "string" || typeof data.qrImageUrl !== "string") return null;
    return { accountNumber: data.accountNumber, accountHolder: data.accountHolder, bankName: data.bankName, bankBranch: data.bankBranch, qrImageUrl: data.qrImageUrl };
  } catch { return null; }
}

export function emptyQrPayment(): QrPaymentConfig {
  return { accountNumber: "", accountHolder: "", bankName: "", bankBranch: "", qrImageUrl: "" };
}
export function selectQrPayment<T extends { key: string }>(items: readonly T[]) {
  return items.filter(item => item.key === QR_PAYMENT_KEY);
}
export function createQrPaymentInput(values: QrPaymentConfig) {
  return { key: QR_PAYMENT_KEY, description: QR_PAYMENT_DESCRIPTION, value: JSON.stringify(values) };
}
export function updateQrPaymentInput(values: QrPaymentConfig) {
  return { value: JSON.stringify(values) };
}
