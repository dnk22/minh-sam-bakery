import { ORDER_STATUSES } from "../constants.ts";
import type { Order, OrderList, OrderListParams, OrderProductItem, OrderStatus } from "../types";
import { isCalendarDate } from "./order-format.ts";

const DECIMAL = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function isDateTime(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isOrderProductItem(value: unknown): value is OrderProductItem {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0 &&
    typeof value.sku === "string" && typeof value.name === "string" &&
    typeof value.unitPrice === "string" && DECIMAL.test(value.unitPrice) && optionalString(value.imageUrl);
}

export function isOrder(value: unknown): value is Order {
  return isRecord(value) && typeof value.id === "string" && value.id.length > 0 &&
    optionalString(value.email) && typeof value.phone === "string" &&
    typeof value.shippingAddress === "string" && optionalString(value.fullName) && optionalString(value.note) &&
    (value.paymentMethod === "AT_STORE" || value.paymentMethod === "BANK_TRANSFER") &&
    optionalString(value.paymentImageUrl) && isOrderStatus(value.status) &&
    optionalString(value.deliveryDate) && (value.deliveryDate == null || isCalendarDate(value.deliveryDate)) &&
    optionalString(value.deliveryTime) && Array.isArray(value.productIds) && value.productIds.every((id) => typeof id === "string") &&
    typeof value.totalAmount === "string" && DECIMAL.test(value.totalAmount) &&
    Array.isArray(value.products) && value.products.every(isOrderProductItem) &&
    isDateTime(value.createdAt) && isDateTime(value.updatedAt);
}

export function isOrderList(value: unknown): value is OrderList {
  if (!isRecord(value) || !Array.isArray(value.items) || !value.items.every(isOrder) || !isRecord(value.pagination)) return false;
  const { page, limit, total, totalPages } = value.pagination;
  return typeof page === "number" && Number.isSafeInteger(page) && page >= 1 &&
    typeof limit === "number" && Number.isSafeInteger(limit) && limit >= 1 && limit <= 100 &&
    typeof total === "number" && Number.isSafeInteger(total) && total >= 0 &&
    typeof totalPages === "number" && Number.isSafeInteger(totalPages) && totalPages >= 0;
}

export function parseOrderPage(value: string | null) {
  const page = Number(value ?? 1);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function parseOrderStatuses(values: readonly string[]) {
  return [...new Set(values.filter(isOrderStatus))];
}

function hasAtMostOne(query: URLSearchParams, key: string) {
  return query.getAll(key).length <= 1;
}

export function parseOrderListQuery(query: URLSearchParams): { ok: true; data: OrderListParams } | { ok: false } {
  const page = Number(query.get("page") ?? 1);
  const limit = Number(query.get("limit") ?? 20);
  const search = query.get("search")?.trim() || undefined;
  const rawStatuses = query.getAll("status");
  const statuses = parseOrderStatuses(rawStatuses);
  const deliveryDate = query.get("deliveryDate")?.trim() || undefined;
  const deliveryTime = query.get("deliveryTime")?.trim() || undefined;
  const sortCreated = query.get("sortCreated") ?? "desc";
  const singletonKeys = ["page", "limit", "search", "deliveryDate", "deliveryTime", "sortCreated"];

  if (!singletonKeys.every((key) => hasAtMostOne(query, key)) || !Number.isSafeInteger(page) || page < 1 ||
    !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || rawStatuses.length !== statuses.length ||
    (search && search.length > 200) || (deliveryDate && !isCalendarDate(deliveryDate)) ||
    (deliveryTime && deliveryTime.length > 100) || (sortCreated !== "asc" && sortCreated !== "desc")) return { ok: false };

  return { ok: true, data: { page, limit, search, statuses, deliveryDate, deliveryTime, sortCreated } };
}

export function serializeOrderListParams(params: OrderListParams) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search);
  params.statuses.forEach((status) => query.append("status", status));
  if (params.deliveryDate) query.set("deliveryDate", params.deliveryDate);
  if (params.deliveryTime) query.set("deliveryTime", params.deliveryTime);
  if (params.sortCreated !== "desc") query.set("sortCreated", params.sortCreated);
  return query;
}

export function canUpdateOrderStatus(current: OrderStatus, next: OrderStatus) {
  return current !== next;
}

export function validOrderId(id: string) {
  return id.trim() === id && id.length > 0 && id.length <= 200 && !id.includes("/") && !id.includes("\\");
}

export function clearOrderFilterQuery(query: URLSearchParams) {
  clearOrderAdvancedFilterQuery(query);
  query.delete("search");
  return query;
}

export function clearOrderAdvancedFilterQuery(query: URLSearchParams) {
  ["status", "deliveryDate", "deliveryTime", "sortCreated", "page"].forEach((key) => query.delete(key));
  return query;
}

export function countOrderAdvancedFilters(filters: Pick<OrderListParams, "statuses" | "deliveryDate" | "deliveryTime" | "sortCreated">) {
  return Number(filters.statuses.length > 0) + Number(Boolean(filters.deliveryDate)) +
    Number(Boolean(filters.deliveryTime)) + Number(filters.sortCreated !== "desc");
}
