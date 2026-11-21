import assert from "node:assert/strict";
import test from "node:test";

import { hasJsonContentType, isTrustedSameOriginRequest } from "../src/cms/features/auth/lib/csrf.ts";
import { canUpdateOrderStatus, clearOrderFilterQuery, isOrder, isOrderList, parseOrderListQuery, serializeOrderListParams, validOrderId } from "../src/cms/features/orders/lib/order-data.ts";
import { formatCalendarDate, formatVnd, isCalendarDate } from "../src/cms/features/orders/lib/order-format.ts";
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
  productIds: ["product-1"],
  totalAmount: "450000.00",
  products: [{ id: "product-1", sku: "BANH-01", name: "Bánh mẫu", unitPrice: "450000.00", imageUrl: null }],
  createdAt: "2026-11-19T08:00:00.000Z",
  updatedAt: "2026-11-19T09:00:00.000Z",
};

test("validates exact order DTOs and rejects unsafe ambiguous values", () => {
  assert.equal(isOrder(order), true);
  assert.equal(isOrder({ ...order, email: null, fullName: undefined, deliveryTime: undefined }), true);
  assert.equal(isOrder({ ...order, email: { value: "customer@example.com" } }), false);
  assert.equal(isOrder({ ...order, products: [{ ...order.products[0], imageUrl: { url: "/unsafe" } }] }), false);
  assert.equal(isOrder({ ...order, totalAmount: "45e4" }), false);
  assert.equal(isOrder({ ...order, deliveryDate: "2026-02-30" }), false);
  assert.equal(isOrder({ ...order, status: "CANCELLED" }), false);
});

test("validates paginated order lists without coercing pagination", () => {
  assert.equal(isOrderList({ items: [order], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isOrderList({ items: [order], pagination: { page: 0, limit: 20, total: 1, totalPages: 1 } }), false);
  assert.equal(isOrderList({ items: [order], pagination: { page: 1, limit: "20", total: 1, totalPages: 1 } }), false);
});

test("strictly validates the documented status update payload", () => {
  assert.deepEqual(updateOrderStatusSchema.parse({ status: "COMPLETED" }), { status: "COMPLETED" });
  assert.equal(updateOrderStatusSchema.safeParse({}).success, false);
  assert.equal(updateOrderStatusSchema.safeParse({ status: "CANCELLED" }).success, false);
  assert.equal(updateOrderStatusSchema.safeParse({ status: "CONFIRMED", note: "extra" }).success, false);
});

test("preserves repeated statuses through browser, BFF and Backend serialization", () => {
  const params: OrderListParams = { page: 2, limit: 20, statuses: ["CONFIRMED", "COMPLETED"], sortCreated: "asc", deliveryTime: "09:00-11:00" };
  const browserQuery = serializeOrderListParams(params);
  assert.deepEqual(browserQuery.getAll("status"), ["CONFIRMED", "COMPLETED"]);
  const parsed = parseOrderListQuery(browserQuery);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.data.statuses, ["CONFIRMED", "COMPLETED"]);
  assert.equal(parsed.data.deliveryTime, "09:00-11:00");
  const backendUrl = new URL(buildBackendUrl("https://backend.example", "/api/v1/orders", { status: parsed.data.statuses }));
  assert.deepEqual(backendUrl.searchParams.getAll("status"), ["CONFIRMED", "COMPLETED"]);
});

test("parses defaults and rejects malformed list filters", () => {
  assert.deepEqual(parseOrderListQuery(new URLSearchParams()), {
    ok: true,
    data: { page: 1, limit: 20, search: undefined, statuses: [], deliveryDate: undefined, deliveryTime: undefined, sortCreated: "desc" },
  });
  for (const query of ["page=0", "limit=101", "sortCreated=newest", "deliveryDate=2026-02-30", "status=CONFIRMED&status=UNKNOWN", "page=1&page=2"]) {
    assert.equal(parseOrderListQuery(new URLSearchParams(query)).ok, false, query);
  }
});

test("clears every order filter and resets pagination", () => {
  const query = new URLSearchParams("search=090&status=CONFIRMED&status=COMPLETED&deliveryDate=2026-11-20&deliveryTime=morning&sortCreated=asc&page=4&unrelated=kept");
  assert.equal(clearOrderFilterQuery(query).toString(), "unrelated=kept");
});

test("uses stable list/detail keys and declares both status invalidations", () => {
  const params: OrderListParams = { page: 1, limit: 20, statuses: [], sortCreated: "desc" };
  assert.deepEqual(orderQueryKeys.list(params), ["cms", "orders", "list", params]);
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

test("disables status no-op while allowing Backend-validated transitions", () => {
  assert.equal(canUpdateOrderStatus("CONFIRMED", "CONFIRMED"), false);
  assert.equal(canUpdateOrderStatus("CONFIRMED", "REJECTED"), true);
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
