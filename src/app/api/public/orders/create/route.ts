import { isTrustedSameOriginRequest, hasJsonContentType } from "@/lib/api/same-origin";
import { NextResponse } from "next/server";
import { isCreateOrderInput } from "@/lib/contracts/order/order.schema";
import { BackendRequestError } from "@/lib/api/errors";
import { createBackendOrder } from "@/landing/features/checkout/api/checkout.server";

export async function POST(request: Request) {
  const reply = (code: number, message: string, data: unknown = null) =>
    NextResponse.json({ code, message, data }, { status: code, headers: { "Cache-Control": "no-store" } });
  if (!isTrustedSameOriginRequest(request)) return reply(403, "Yêu cầu không hợp lệ.");
  if (!hasJsonContentType(request)) return reply(400, "Dữ liệu không hợp lệ.");
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 64000) return reply(413, "Dữ liệu quá lớn.");
    input = JSON.parse(raw);
  } catch { return reply(400, "Dữ liệu không hợp lệ."); }
  if (!isCreateOrderInput(input)) return reply(400, "Thông tin đặt hàng không hợp lệ.");
  try {
    const order = await createBackendOrder(input);
    if (order.status !== "PENDING_CONFIRMATION") return reply(502, "Chưa xác minh được trạng thái đơn. Vui lòng liên hệ cửa hàng.");
    return reply(201, "Đơn đặt bánh đã được ghi nhận", order);
  } catch (error) {
    if (error instanceof BackendRequestError && ["http","application"].includes(error.kind)) {
      const status = error.code ?? error.status;
      if (status && [400,404,409,422,429].includes(status)) return reply(status, "Không thể tạo đơn với thông tin hiện tại. Vui lòng kiểm tra lại sản phẩm và thông tin nhận bánh.");
    }
    return reply(502, "Chưa xác minh được kết quả tạo đơn. Vui lòng liên hệ cửa hàng trước khi đặt lại.");
  }
}
