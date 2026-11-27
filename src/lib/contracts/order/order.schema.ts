import type { CreateOrderInput, Order, OrderItem, OrderStatus } from "./order.types.ts";

import { isPaymentProofUrl } from "./payment-proof.ts";

const decimal = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
// Legacy CMS display only; never accepted for new checkout requests.
export const MOCK_PAYMENT_IMAGE_URL = "https://example.invalid/checkout/mock-transfer.png";
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): v is string => typeof v === "string";
const nonempty = (v: unknown): v is string => str(v) && v.trim().length > 0;
const optional = (v: unknown) => v == null || str(v);
const money = (v: unknown) => str(v) && decimal.test(v);
const date = (v: unknown) => str(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
export const isOrderStatus = (v: unknown): v is OrderStatus => ["PENDING_CONFIRMATION","REJECTED","CONFIRMED","NEED_CALLBACK","COMPLETED"].some(s => s === v);
const payment = (v: unknown) => v === "AT_STORE" || v === "BANK_TRANSFER";
const fulfillment = (v: unknown) => v === "PICKUP" || v === "DELIVERY";
const item = (v: unknown) => record(v) && nonempty(v.productId) && nonempty(v.variantId) && !v.variantId.startsWith("base-") && typeof v.quantity === "number" && Number.isSafeInteger(v.quantity) && v.quantity >= 1;
export function isOrderItem(v: unknown): v is OrderItem {
  return record(v) && item(v) && nonempty(v.id) && money(v.unitPrice) && money(v.lineTotal) &&
    [v.productName,v.productSku,v.variantSku,v.size,v.style].every(str) && optional(v.imageUrl);
}
export function isOrder(v: unknown): v is Order {
  return record(v) && nonempty(v.id) && str(v.phone) && payment(v.paymentMethod) && fulfillment(v.fulfillmentMethod) &&
    isOrderStatus(v.status) && money(v.totalAmount) && Array.isArray(v.items) && v.items.every(isOrderItem) &&
    [v.email,v.shippingAddress,v.fullName,v.note,v.paymentImageUrl,v.deliveryTime].every(optional) &&
    (v.deliveryDate == null || date(v.deliveryDate)) && str(v.createdAt) && !Number.isNaN(Date.parse(v.createdAt)) &&
    str(v.updatedAt) && !Number.isNaN(Date.parse(v.updatedAt));
}
export function isOrderRequestDraft(v: unknown): v is CreateOrderInput {
  if (!record(v) || !Array.isArray(v.items) || !v.items.length || v.items.length > 100 || !v.items.every(item)) return false;
  if (!v.items.every(x => x.quantity <= 20) || new Set(v.items.map(x => JSON.stringify([x.productId,x.variantId]))).size !== v.items.length) return false;
  if (Object.keys(v).some(key => !["items","fullName","phone","email","fulfillmentMethod","shippingAddress","deliveryDate","deliveryTime","paymentMethod","paymentImageUrl","note"].includes(key)) ||
      v.items.some(x => Object.keys(x).some(key => !["productId","variantId","quantity"].includes(key)))) return false;
  return nonempty(v.fullName) && v.fullName.length <= 100 && str(v.phone) && /^(?:\+84|0)(?:\d[ .-]?){8,10}$/.test(v.phone) &&
    (v.email === undefined || (str(v.email) && v.email.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))) &&
    fulfillment(v.fulfillmentMethod) && payment(v.paymentMethod) &&
    (v.fulfillmentMethod === "DELIVERY" ? nonempty(v.shippingAddress) && v.shippingAddress.length <= 250 && v.paymentMethod === "BANK_TRANSFER" : v.shippingAddress == null) &&
    date(v.deliveryDate) && (v.deliveryTime === undefined || str(v.deliveryTime) && v.deliveryTime.length <= 100) &&
    (v.note === undefined || str(v.note) && v.note.length <= 500) &&
    (v.paymentMethod === "BANK_TRANSFER" ? v.paymentImageUrl === undefined || isPaymentProofUrl(v.paymentImageUrl) : v.paymentImageUrl === undefined);
}

/** Strict wire contract: bank transfers require a real uploaded receipt. */
export function isCreateOrderInput(v: unknown): v is CreateOrderInput {
  return isOrderRequestDraft(v) && (v.paymentMethod !== "BANK_TRANSFER" || isPaymentProofUrl(v.paymentImageUrl));
}
