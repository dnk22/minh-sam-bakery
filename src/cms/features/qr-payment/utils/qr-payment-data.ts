import { QR_PAYMENT_KEY, QR_PAYMENT_DESCRIPTION } from "../constants.ts";
import type { QrPaymentConfig } from "../types.ts";
export { readQrPaymentValue } from "../../../../lib/contracts/qr-payment/qr-payment-data.ts";

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
