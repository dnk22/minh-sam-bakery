export type OrderStatus = "PENDING_CONFIRMATION" | "REJECTED" | "CONFIRMED" | "NEED_CALLBACK" | "COMPLETED";
export type OrderPaymentMethod = "AT_STORE" | "BANK_TRANSFER";
export type OrderFulfillmentMethod = "PICKUP" | "DELIVERY";
export type CreateOrderItem = { productId: string; variantId: string; quantity: number };
export type CreateOrderInput = {
  items: CreateOrderItem[]; fullName: string; phone: string; email?: string;
  fulfillmentMethod: OrderFulfillmentMethod; shippingAddress?: string | null;
  deliveryDate?: string; deliveryTime?: string; paymentMethod: OrderPaymentMethod;
  paymentImageUrl?: string; note?: string;
};
export type OrderItem = CreateOrderItem & {
  id: string; unitPrice: string; lineTotal: string; productName: string;
  productSku: string; variantSku: string; size: string; style: string; imageUrl?: string | null;
};
export type Order = {
  id: string; email?: string | null; phone: string; shippingAddress?: string | null;
  fullName?: string | null; note?: string | null; paymentMethod: OrderPaymentMethod;
  paymentImageUrl?: string | null; fulfillmentMethod: OrderFulfillmentMethod;
  status: OrderStatus; deliveryDate?: string | null; deliveryTime?: string | null;
  totalAmount: string; items: OrderItem[]; createdAt: string; updatedAt: string;
};
