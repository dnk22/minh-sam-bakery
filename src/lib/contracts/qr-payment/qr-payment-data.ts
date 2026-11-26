import type { QrPaymentConfig } from "./qr-payment.types.ts";

export const QR_PAYMENT_KEY = "QR_PAYMENT";

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

