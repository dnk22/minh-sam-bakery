import { isOrder } from "@/lib/contracts/order/order.schema";
import type { CreateOrderInput } from "@/lib/contracts/order/order.types";

export class CheckoutSubmitError extends Error {
  constructor(message: string, readonly uncertain = false) { super(message); }
}
export async function createOrder(input: CreateOrderInput) {
  let response: Response;
  try {
    response = await fetch("/api/public/orders/create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input), cache: "no-store", signal: AbortSignal.timeout(35000),
    });
  } catch { throw new CheckoutSubmitError("Chưa xác minh được kết quả tạo đơn. Vui lòng liên hệ cửa hàng trước khi đặt lại.", true); }
  let result: unknown;
  try { result = await response.json(); } catch { throw new CheckoutSubmitError("Không đọc được kết quả tạo đơn. Vui lòng liên hệ cửa hàng.", true); }
  if (!result || typeof result !== "object" || !("data" in result)) throw new CheckoutSubmitError("Kết quả tạo đơn không hợp lệ.", true);
  if (!response.ok) throw new CheckoutSubmitError("message" in result && typeof result.message === "string" ? result.message : "Không thể tạo đơn.", response.status >= 500);
  if (!isOrder(result.data) || result.data.status !== "PENDING_CONFIRMATION") throw new CheckoutSubmitError("Chưa xác minh được kết quả tạo đơn. Vui lòng liên hệ cửa hàng.", true);
  return result.data;
}
