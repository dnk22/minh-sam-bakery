import "server-only";
import { backendRequest } from "@/lib/api/backend-client";
import { isPaymentProofUploadResult } from "@/lib/contracts/order/payment-proof";

export async function uploadBackendPaymentProof(file: File, signal: AbortSignal) {
  const body = new FormData();
  body.append("files", file);
  const response = await backendRequest({
    path: "/api/v1/public/upload/qr/pay", method: "POST", body, signal,
    cache: "no-store", timeoutMs: 40000, requireHttps: true, validate: isPaymentProofUploadResult,
  });
  if (response.code !== 201) throw new Error("Unexpected payment upload response");
  return response.data;
}
