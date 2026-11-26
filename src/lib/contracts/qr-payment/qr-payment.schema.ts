import { z } from "zod";

export const qrPaymentSchema = z.object({
  accountNumber: z.string().trim().min(1, "Nhập số tài khoản.").max(100),
  accountHolder: z.string().trim().min(1, "Nhập chủ tài khoản.").max(200),
  bankName: z.string().trim().min(1, "Nhập ngân hàng.").max(200),
  bankBranch: z.string().trim().max(200),
  qrImageUrl: z.string().trim().min(1, "Hãy tải ảnh mã QR.").max(2048).refine(value => {
    if (value.startsWith("/uploads/")) return !value.includes("..") && !/[\\\s?#]/.test(value);
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
    } catch { return false; }
  }, "URL ảnh QR không hợp lệ."),
});
