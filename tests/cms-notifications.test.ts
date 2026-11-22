import assert from "node:assert/strict";
import test from "node:test";

import { buildNotificationListQuery, isBulkReadResult, isCmsNotification, isNotificationList, isUnreadCount, notificationFilterValue, notificationStatePath, parseNotificationFilter, parseNotificationPage } from "../src/cms/features/notification-center/lib/notification-data.ts";
import { formatNotificationTime, getNotificationTypePresentation, resolveCmsNotificationDestination, safeCmsNotificationLink } from "../src/cms/features/notification-center/lib/notification-presentation.ts";
import { notificationInvalidationKeys, notificationMutationKey, notificationQueryKeys } from "../src/cms/features/notification-center/lib/notification-query-keys.ts";
import { bulkReadSchema } from "../src/cms/features/notification-center/schemas/notification.schema.ts";
import type { CmsNotification } from "../src/cms/features/notification-center/types.ts";

const notification: CmsNotification = { id: "notice-1", type: "ORDER_CREATED", title: "Đơn hàng mới", message: "Đơn MS-001 vừa được tạo.", link: "/cms/orders/order-1", metadata: { orderId: "order-1" }, isRead: false, readAt: null, createdAt: "2026-11-22T01:00:00.000Z", updatedAt: "2026-11-22T01:00:00.000Z" };

test("validates notification, list, unread-count and bulk-read responses", () => {
  assert.equal(isCmsNotification(notification), true);
  assert.equal(isCmsNotification({ ...notification, type: "FUTURE_TYPE" }), true);
  assert.equal(isCmsNotification({ ...notification, isRead: "false" }), false);
  assert.equal(isNotificationList({ items: [notification], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isUnreadCount({ count: 3 }), true);
  assert.equal(isUnreadCount({ count: -1 }), false);
  assert.equal(isBulkReadResult({ updated: 2 }), true);
});

test("presents documented and future notification types gracefully", () => {
  assert.deepEqual(getNotificationTypePresentation("ORDER_CREATED"), { label: "Đơn hàng mới", tone: "order" });
  assert.deepEqual(getNotificationTypePresentation("PRODUCT_LOW_STOCK"), { label: "Thông báo hệ thống", tone: "default" });
});

test("accepts only safe internal CMS notification links", () => {
  assert.equal(safeCmsNotificationLink("/cms/orders/abc?tab=detail#top"), "/cms/orders?tab=detail&orderId=abc#top");
  assert.equal(safeCmsNotificationLink("/cms"), "/cms");
  assert.equal(safeCmsNotificationLink("/san-pham"), null);
  assert.equal(safeCmsNotificationLink("https://example.com/cms"), null);
  assert.equal(safeCmsNotificationLink("//evil.example/cms"), null);
  assert.equal(safeCmsNotificationLink("javascript:alert(1)"), null);
});

test("maps read, unread and bulk-read operations to documented shapes", () => {
  assert.equal(notificationStatePath("id/unsafe", "read"), "/notifications/id%2Funsafe/read");
  assert.equal(notificationStatePath("notice-1", "unread"), "/notifications/notice-1/unread");
  assert.equal(bulkReadSchema.safeParse({ ids: ["notice-1", "notice-2"] }).success, true);
  assert.equal(bulkReadSchema.safeParse({ all: true }).success, true);
  assert.equal(bulkReadSchema.safeParse({}).success, false);
  assert.equal(bulkReadSchema.safeParse({ ids: [] }).success, false);
});

test("keeps list filters, pagination and invalidation scopes stable", () => {
  assert.equal(buildNotificationListQuery({ page: 2, limit: 20, isRead: false }), "page=2&limit=20&isRead=false");
  assert.equal(parseNotificationPage("0"), 1);
  assert.equal(parseNotificationFilter("read"), "read");
  assert.equal(parseNotificationFilter("invalid"), "all");
  assert.equal(notificationFilterValue("unread"), false);
  assert.equal(notificationFilterValue("all"), undefined);
  assert.deepEqual(notificationQueryKeys.list({ page: 1, limit: 20 }), ["cms", "notifications", "list", { page: 1, limit: 20 }]);
  assert.deepEqual(notificationInvalidationKeys("notice-1"), [["cms", "notifications", "list"], ["cms", "notifications", "unread-count"], ["cms", "notifications", "detail", "notice-1"]]);
  assert.deepEqual(notificationMutationKey, ["cms", "notifications", "mutation"]);
});

test("formats recent timestamps deterministically", () => {
  const now = Date.parse("2026-11-22T02:00:00.000Z");
  assert.equal(formatNotificationTime("2026-11-22T01:59:30.000Z", now), "Vừa xong");
  assert.equal(formatNotificationTime("2026-11-22T01:30:00.000Z", now), "30 phút trước");
  assert.equal(formatNotificationTime("2026-11-21T02:00:00.000Z", now), "1 ngày trước");
});

test("routes order notifications to the existing order modal", () => {
  assert.equal(safeCmsNotificationLink("/cms/orders/order-1"), "/cms/orders?orderId=order-1");
  assert.equal(safeCmsNotificationLink("/cms/orders/order%2Fbad"), null);
  assert.equal(resolveCmsNotificationDestination(notification), "/cms/orders?orderId=order-1");
  assert.equal(resolveCmsNotificationDestination({ type: "ORDER_CREATED", metadata: { orderId: "order-2" } }), "/cms/orders?orderId=order-2");
  assert.equal(resolveCmsNotificationDestination({ type: "ORDER_CREATED", link: "javascript:alert(1)", metadata: { orderId: "order-3" } }), "/cms/orders?orderId=order-3");
  assert.equal(resolveCmsNotificationDestination({ type: "ORDER_CREATED", metadata: { orderId: "invalid/id" } }), null);
  assert.equal(resolveCmsNotificationDestination({ type: "OTHER", metadata: { orderId: "order-1" } }), null);
});
