import assert from "node:assert/strict";
import test from "node:test";

import { hasJsonContentType, isTrustedSameOriginRequest } from "../src/cms/features/auth/lib/csrf.ts";
import { clearLinkedOrderId, clearOrderAdvancedFilterQuery, clearOrderFilterQuery, getLinkedOrderId, isOrder, isOrderList, parseOrderListQuery, serializeOrderListParams, validOrderId } from "../src/cms/features/orders/lib/order-data.ts";
import { formatCalendarDate, formatVnd, isCalendarDate, getDefaultOrderCreatedRange, isValidOrderCreatedRange } from "../src/cms/features/orders/lib/order-format.ts";
import { ORDER_VIEW_CONFIG, canPerformOrderAction, targetOrderStatus } from "../src/cms/features/orders/lib/order-views.ts";
import { orderInvalidationKeys, orderQueryKeys } from "../src/cms/features/orders/lib/order-query-keys.ts";
import { updateOrderStatusSchema } from "../src/cms/features/orders/schemas/order.schema.ts";
import type { Order, OrderListParams } from "../src/cms/features/orders/types.ts";
import { buildBackendUrl } from "../src/lib/api/transport.ts";

const order: Order = {
  id: "order-123456789",
  email: "customer@example.com",
  phone: "0900000000",
  shippingAddress: "Hà Nội",
  fullName: "Khách hàng",
  note: null,
  paymentMethod: "BANK_TRANSFER",
  paymentImageUrl: "/uploads/orders/payment.webp",
  status: "CONFIRMED",
  deliveryDate: "2026-11-20",
  deliveryTime: "09:00-11:00",
  fulfillmentMethod: "DELIVERY",
  totalAmount: "450000.00",
  items: [{ id: "item-1", productId: "product-1", variantId: "variant-1", quantity: 2, productSku: "BANH-01", variantSku: "BANH-01-L", productName: "Bánh mẫu", size: "L", style: "", unitPrice: "225000.00", lineTotal: "450000.00", imageUrl: null }],
  createdAt: "2026-11-19T08:00:00.000Z",
  updatedAt: "2026-11-19T09:00:00.000Z",
};

test("validates exact order DTOs and rejects unsafe ambiguous values", () => {
  assert.equal(isOrder(order), true);
  assert.equal(isOrder({ ...order, email: null, fullName: undefined, deliveryTime: undefined }), true);
  assert.equal(isOrder({ ...order, email: { value: "customer@example.com" } }), false);
  assert.equal(isOrder({ ...order, items: [{ ...order.items[0], imageUrl: { url: "/unsafe" } }] }), false);
  assert.equal(isOrder({ ...order, totalAmount: "45e4" }), false);
  assert.equal(isOrder({ ...order, deliveryDate: "2026-02-30" }), false);
  assert.equal(isOrder({ ...order, status: "CANCELLED" }), false);
});

test("validates paginated order lists without coercing pagination", () => {
  assert.equal(isOrderList({ items: [order], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isOrderList({ items: [order], pagination: { page: 0, limit: 20, total: 1, totalPages: 1 } }), false);
  assert.equal(isOrderList({ items: [order], pagination: { page: 1, limit: "20", total: 1, totalPages: 1 } }), false);
});

test("manual CMS status updates support confirmation, rejection and completion", () => {
  assert.deepEqual(updateOrderStatusSchema.parse({ status: "CONFIRMED" }), { status: "CONFIRMED" });
  assert.deepEqual(updateOrderStatusSchema.parse({ status: "REJECTED" }), { status: "REJECTED" });
  assert.deepEqual(updateOrderStatusSchema.parse({ status: "COMPLETED" }), { status: "COMPLETED" });
  for (const status of ["PENDING_CONFIRMATION", "NEED_CALLBACK", "UNKNOWN"]) {
    assert.equal(updateOrderStatusSchema.safeParse({ status }).success, false);
  }
  assert.equal(updateOrderStatusSchema.safeParse({ status: "CONFIRMED", note: "extra" }).success, false);
});

test("maps every order submenu to its documented endpoint and fixed statuses", () => {
  assert.deepEqual(ORDER_VIEW_CONFIG.pending.statuses, ["PENDING_CONFIRMATION", "NEED_CALLBACK"]);
  assert.deepEqual(ORDER_VIEW_CONFIG.delivery.statuses, ["CONFIRMED"]);
  assert.deepEqual(ORDER_VIEW_CONFIG.completed.statuses, ["COMPLETED"]);
  assert.equal(ORDER_VIEW_CONFIG.history.endpoint, "history");
  assert.deepEqual(ORDER_VIEW_CONFIG.history.statuses, ["REJECTED", "COMPLETED"]);
  assert.equal(canPerformOrderAction("pending", "NEED_CALLBACK", "confirm"), true);
  assert.equal(canPerformOrderAction("pending", "PENDING_CONFIRMATION", "reject"), true);
  assert.equal(canPerformOrderAction("delivery", "CONFIRMED", "reject"), true);
  assert.equal(canPerformOrderAction("delivery", "CONFIRMED", "confirm"), false);
  assert.equal(canPerformOrderAction("completed", "COMPLETED", "reject"), false);
  assert.equal(canPerformOrderAction("history", "REJECTED", "confirm"), false);
  assert.equal(canPerformOrderAction("history", "COMPLETED", "detail"), true);
  assert.equal(targetOrderStatus("confirm"), "CONFIRMED");
  assert.equal(targetOrderStatus("reject"), "REJECTED");
  assert.equal(targetOrderStatus("complete"), "COMPLETED");
  assert.deepEqual(ORDER_VIEW_CONFIG.delivery.actions, ["detail", "complete", "reject"]);
  assert.equal(canPerformOrderAction("delivery", "CONFIRMED", "complete"), true);
  for (const view of ["pending", "completed", "history"] as const) assert.equal(canPerformOrderAction(view, "CONFIRMED", "complete"), false);
  for (const status of ["PENDING_CONFIRMATION", "NEED_CALLBACK", "REJECTED", "COMPLETED"] as const) assert.equal(canPerformOrderAction("delivery", status, "complete"), false);
});

test("default order range uses Vietnam calendar dates and spans 30 day boundaries", () => {
  assert.deepEqual(getDefaultOrderCreatedRange(new Date("2026-11-23T01:51:00.000Z")), {
    createdFrom: "2026-10-24", createdTo: "2026-11-23",
  });
  assert.deepEqual(getDefaultOrderCreatedRange(new Date("2026-11-22T18:00:00.000Z")), {
    createdFrom: "2026-10-24", createdTo: "2026-11-23",
  });
  assert.equal(isValidOrderCreatedRange("2026-10-24", "2026-11-23"), true);
  assert.equal(isValidOrderCreatedRange("2026-10-23", "2026-11-23"), false);
  assert.equal(isValidOrderCreatedRange("2026-11-24", "2026-11-23"), false);
  assert.equal(isValidOrderCreatedRange("2026-02-30", "2026-03-01"), false);
  assert.equal(isValidOrderCreatedRange("", "2026-11-23"), false);
  assert.equal(isValidOrderCreatedRange("2026-11-23", "2026-11-23"), true);
});

test("serializes required order date range and roundtrips through BFF", () => {
  const params: OrderListParams = {
    page: 2, limit: 20, createdFrom: "2026-10-24", createdTo: "2026-11-23",
    deliveryTime: "09:00-11:00",
  };
  const browserQuery = serializeOrderListParams(params);
  assert.equal(browserQuery.get("createdFrom"), "2026-10-24");
  assert.equal(browserQuery.get("createdTo"), "2026-11-23");
  const parsed = parseOrderListQuery(browserQuery);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.data.deliveryTime, "09:00-11:00");
  const url = new URL(buildBackendUrl("https://backend.example", "/api/v1/orders", {
    createdFrom: parsed.data.createdFrom, createdTo: parsed.data.createdTo,
    status: [...ORDER_VIEW_CONFIG.pending.statuses],
  }));
  assert.deepEqual(url.searchParams.getAll("status"), ["PENDING_CONFIRMATION", "NEED_CALLBACK"]);
});

test("rejects missing, duplicated, malformed or oversized date query parameters", () => {
  assert.equal(parseOrderListQuery(new URLSearchParams()).ok, false);
  for (const query of [
    "createdFrom=2026-10-24&createdTo=2026-11-23&createdTo=2026-11-22",
    "createdFrom=2026-10-23&createdTo=2026-11-23",
    "createdFrom=2026-11-24&createdTo=2026-11-23",
    "createdFrom=2026-02-30&createdTo=2026-03-01",
    "createdFrom=2026-10-24&createdTo=2026-11-23&page=0",
    "createdFrom=2026-10-24&createdTo=2026-11-23&limit=101",
    "createdFrom=2026-10-24&createdTo=2026-11-23&status=CONFIRMED",
    "createdFrom=2026-10-24&createdTo=2026-11-23&sortCreated=asc",
  ]) assert.equal(parseOrderListQuery(new URLSearchParams(query)).ok, false, query);
});

test("clearing optional order filters preserves mandatory createdFrom/createdTo", () => {
  const query = new URLSearchParams("search=090&deliveryDate=2026-11-20&deliveryTime=morning&createdFrom=2026-10-24&createdTo=2026-11-23&page=4&unrelated=kept");
  assert.equal(clearOrderFilterQuery(query).toString(), "createdFrom=2026-10-24&createdTo=2026-11-23&unrelated=kept");
  const advanced = new URLSearchParams("search=090&deliveryDate=2026-11-20&deliveryTime=morning&createdFrom=2026-10-24&createdTo=2026-11-23&page=3");
  assert.equal(clearOrderAdvancedFilterQuery(advanced).toString(), "search=090&createdFrom=2026-10-24&createdTo=2026-11-23");
});

test("separates order list cache by workflow view", () => {
  const params: OrderListParams = { page: 1, limit: 20, createdFrom: "2026-10-24", createdTo: "2026-11-23" };
  assert.deepEqual(orderQueryKeys.list("pending", params), ["cms", "orders", "list", "pending", params]);
  assert.deepEqual(orderQueryKeys.list("history", params), ["cms", "orders", "list", "history", params]);
  assert.deepEqual(orderInvalidationKeys("order-1"), [orderQueryKeys.lists(), orderQueryKeys.detail("order-1")]);
});

test("formats decimal money without floating-point precision loss", () => {
  assert.equal(formatVnd("900719925474099312345.00"), "900.719.925.474.099.312.345 ₫");
  assert.equal(formatVnd("450000.50"), "450.000,5 ₫");
  assert.equal(formatVnd("invalid"), "Không xác định");
});

test("keeps a date-only value on its original calendar day", () => {
  assert.equal(isCalendarDate("2026-11-20"), true);
  assert.equal(isCalendarDate("2026-11-31"), false);
  assert.equal(formatCalendarDate("2026-11-20"), "20/11/2026");
});

test("requires same-origin JSON requests for the status PUT boundary", () => {
  const trusted = new Request("https://cms.example/api/cms/orders/1/update", { method: "PUT", headers: { origin: "https://cms.example", "content-type": "application/json; charset=utf-8" } });
  const foreign = new Request("https://cms.example/api/cms/orders/1/update", { method: "PUT", headers: { origin: "https://evil.example", "content-type": "application/json" } });
  assert.equal(isTrustedSameOriginRequest(trusted), true);
  assert.equal(hasJsonContentType(trusted), true);
  assert.equal(isTrustedSameOriginRequest(foreign), false);
  assert.equal(validOrderId("order-1"), true);
  assert.equal(validOrderId(" order-1"), false);
  assert.equal(validOrderId("order/1"), false);
});

test("opens linked orders and clears their target without discarding existing filters", () => {
  const params = new URLSearchParams("page=3&status=CONFIRMED&orderId=order-123");
  assert.equal(getLinkedOrderId(params), "order-123");
  assert.equal(getLinkedOrderId(new URLSearchParams("orderId=one&orderId=two")), null);
  assert.equal(getLinkedOrderId(new URLSearchParams("orderId=bad%2Fid")), null);
  assert.equal(getLinkedOrderId(new URLSearchParams("orderId=")), null);
  assert.equal(clearLinkedOrderId(params).toString(), "page=3&status=CONFIRMED");
});
