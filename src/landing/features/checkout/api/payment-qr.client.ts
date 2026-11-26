import { qrPaymentSchema } from "../../../../lib/contracts/qr-payment/qr-payment.schema.ts";

export async function getPaymentQr(signal: AbortSignal) {
  const response = await fetch("/api/public/payment-qr", { cache: "no-store", signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]) });
  if (response.status !== 200) throw new Error("Payment QR unavailable");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("code" in result) || result.code !== 200 || !("data" in result)) throw new Error("Invalid payment QR response");
  return qrPaymentSchema.parse(result.data);
}
