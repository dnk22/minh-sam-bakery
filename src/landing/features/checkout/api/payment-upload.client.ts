import { isPaymentProofUploadResult, validatePaymentProofFile } from "../../../../lib/contracts/order/payment-proof.ts";

export async function uploadPaymentProof(file: File, signal: AbortSignal, fetchImpl: typeof fetch = fetch): Promise<string> {
  const validation = validatePaymentProofFile(file);
  if (validation) throw new Error(validation);
  const body = new FormData();
  body.append("files", file);
  const response = await fetchImpl("/api/public/payment-upload", { method: "POST", body, cache: "no-store", signal: AbortSignal.any([signal, AbortSignal.timeout(50000)]) });
  if (response.status !== 201) throw new Error(response.status === 413 ? "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn." : "Không thể tải ảnh chứng từ. Vui lòng thử lại.");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("code" in result) || result.code !== 201 || !("data" in result) || !isPaymentProofUploadResult(result.data)) throw new Error("Kết quả tải ảnh không hợp lệ. Vui lòng thử lại.");
  return result.data[0].url;
}
