// Public checkout uses one raster image, with headroom for multipart overhead.
export const PAYMENT_PROOF_MAX_BYTES = 4 * 1024 * 1024;
export const PAYMENT_PROOF_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const PAYMENT_PROOF_ACCEPT = PAYMENT_PROOF_MIME_TYPES.join(",");

export function validatePaymentProofFile(file: Pick<File, "type" | "size">): string | null {
  if (!PAYMENT_PROOF_MIME_TYPES.some(type => type === file.type.toLowerCase())) return "Vui lòng chọn ảnh JPG, PNG hoặc WebP.";
  if (file.size <= 0 || file.size > PAYMENT_PROOF_MAX_BYTES) return "Ảnh phải có dung lượng lớn hơn 0 và không quá 4 MB.";
  return null;
}

export function isPaymentProofUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value || value.length > 2048 || /[\\\s\u0000-\u001f\u007f]/.test(value)) return false;
  try {
    if (value.startsWith("/uploads/")) {
      const decoded = decodeURIComponent(value);
      return !/[\\?#\s\u0000-\u001f\u007f]/.test(decoded) && !decoded.split("/").some(part => part === ".." || part === ".") && decoded.startsWith("/uploads/") && decoded.length > "/uploads/".length;
    }
    if (!/^https?:\/\//i.test(value)) return false;
    const url = new URL(value);
    return !url.username && !url.password && url.hostname !== "example.invalid";
  } catch { return false; }
}

export function isPaymentProofUploadResult(value: unknown): value is [{ url: string }] {
  return Array.isArray(value) && value.length === 1 && !!value[0] && typeof value[0] === "object" && isPaymentProofUrl(value[0].url);
}

export async function hasPaymentProofImageSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const matches = (offset: number, signature: number[]) => signature.every((byte, index) => bytes[offset + index] === byte);
  switch (file.type.toLowerCase()) {
    case "image/jpeg": return matches(0, [255, 216, 255]);
    case "image/png": return matches(0, [137, 80, 78, 71, 13, 10, 26, 10]);
    case "image/webp": return matches(0, [82, 73, 70, 70]) && matches(8, [87, 69, 66, 80]);
    default: return false;
  }
}
