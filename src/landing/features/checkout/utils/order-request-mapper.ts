import type { CheckoutIntent } from "../../cart/types.ts";
import type { CheckoutDraft } from "../types.ts";
import type { CreateOrderInput } from "../../../../lib/contracts/order/order.types.ts";
import { isCreateOrderInput, MOCK_PAYMENT_IMAGE_URL } from "../../../../lib/contracts/order/order.schema.ts";

export function buildOrderRequest(intent: CheckoutIntent, draft: CheckoutDraft): CreateOrderInput {
  const items = intent.items.map(item => {
    if (!item.variantId || item.variantId.startsWith("base-")) throw new Error("Sản phẩm chưa có quy cách đặt hàng hợp lệ. Vui lòng chọn lại sản phẩm.");
    return { productId: item.productId, variantId: item.variantId, quantity: item.quantity };
  });
  const input: CreateOrderInput = {
    items, fullName: draft.fullName, phone: draft.phone, email: draft.email || undefined,
    fulfillmentMethod: draft.fulfillmentMethod === "pickup" ? "PICKUP" : "DELIVERY",
    shippingAddress: draft.fulfillmentMethod === "delivery" ? draft.deliveryAddress : null,
    deliveryDate: draft.receiveDate, deliveryTime: draft.deliveryTime || undefined,
    note: draft.notes || undefined, paymentMethod: draft.paymentMethod,
    ...(draft.paymentMethod === "BANK_TRANSFER" ? { paymentImageUrl: MOCK_PAYMENT_IMAGE_URL } : {}),
  };
  if (!isCreateOrderInput(input)) throw new Error("Thông tin đặt hàng không hợp lệ. Vui lòng kiểm tra lại.");
  return input;
}
