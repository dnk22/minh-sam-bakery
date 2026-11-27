import { isTrustedSameOriginRequest } from "@/lib/api/same-origin";
import { PAYMENT_PROOF_MAX_BYTES, validatePaymentProofFile, hasPaymentProofImageSignature } from "@/lib/contracts/order/payment-proof";
import { uploadBackendPaymentProof } from "@/landing/features/checkout/api/payment-upload.server";
import { BackendRequestError } from "@/lib/api/errors";

export async function POST(request: Request) {
  const reply = (code: number, message: string, data: unknown = null) =>
    Response.json({ code, message, data }, { status: code, headers: { "Cache-Control": "no-store" } });
  if (!isTrustedSameOriginRequest(request)) return reply(403, "Yêu cầu không hợp lệ.");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) return reply(400, "Dữ liệu không hợp lệ.");
  const maxBody = PAYMENT_PROOF_MAX_BYTES + 64 * 1024;
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBody)) return reply(413, "Ảnh quá lớn.");
  // Bound the stream even when Content-Length is absent; do not parse an unlimited body.
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, "Thiếu ảnh chứng từ.");
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maxBody) { await reader.cancel(); return reply(413, "Ảnh quá lớn."); }
      chunks.push(new Uint8Array(part.value));
    }
    const form = await new Response(new Blob(chunks), { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
    const files = form.getAll("files");
    const file = files[0];
    if (files.length !== 1 || !(file instanceof File) || [...form.keys()].some(key => key !== "files")) return reply(400, "Chỉ được tải một ảnh chứng từ.");
    const validation = validatePaymentProofFile(file);
    if (validation) return reply(file.size > PAYMENT_PROOF_MAX_BYTES ? 413 : 400, validation);
    if (!await hasPaymentProofImageSignature(file)) return reply(400, "Nội dung ảnh không hợp lệ.");
    try {
      const data = await uploadBackendPaymentProof(file, request.signal);
      return reply(201, "Tải ảnh thành công.", data);
    } catch (error) {
      if (error instanceof BackendRequestError && error.status && [400, 401, 403, 404, 413, 429].includes(error.status)) return reply(error.status, "Không thể tải ảnh chứng từ. Vui lòng thử lại.");
      return reply(502, "Không thể tải ảnh chứng từ. Vui lòng thử lại.");
    }
  } catch { return reply(400, "Dữ liệu ảnh không hợp lệ."); }
}
