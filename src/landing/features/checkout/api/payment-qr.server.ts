import "server-only";
import { backendBaseUrl, backendRequest } from "@/lib/api/backend-client";
import { resolveBackendAssetUrl } from "@/lib/api/asset-url";
import { QR_PAYMENT_KEY, readQrPaymentValue } from "@/lib/contracts/qr-payment/qr-payment-data";
import { qrPaymentSchema } from "@/lib/contracts/qr-payment/qr-payment.schema";

function isQrRecord(value: unknown): value is { key: string; value: string } {
  return !!value && typeof value === "object" && "key" in value && value.key === QR_PAYMENT_KEY && "value" in value && typeof value.value === "string";
}

export async function getBackendPaymentQr(signal?: AbortSignal) {
  const response = await backendRequest({
    path: "/api/v1/public/p-con/qr", method: "GET", cache: "no-store",
    requireHttps: true, signal, validate: isQrRecord,
  });
  if (response.code !== 200) throw new Error("Payment QR unavailable");
  const parsed = qrPaymentSchema.parse(readQrPaymentValue(response.data.value));
  const qrImageUrl = resolveBackendAssetUrl(parsed.qrImageUrl, backendBaseUrl());
  if (!qrImageUrl || (process.env.NODE_ENV === "production" && !qrImageUrl.startsWith("https://"))) throw new Error("Invalid payment QR URL");
  return { ...parsed, qrImageUrl };
}
