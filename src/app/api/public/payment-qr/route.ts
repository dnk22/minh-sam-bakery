import { getBackendPaymentQr } from "@/landing/features/checkout/api/payment-qr.server";

const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    const data = await getBackendPaymentQr(request.signal);
    return Response.json({ code: 200, message: "Thành công", data }, { headers });
  } catch {
    return Response.json({ code: 503, message: "Thông tin thanh toán chưa khả dụng.", data: null }, { status: 503, headers });
  }
}
