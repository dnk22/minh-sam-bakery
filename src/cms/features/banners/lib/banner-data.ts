import { isBannerPosition } from "../../../../lib/banner/positions.ts";

import type { Banner, BannerList, BannerListParams } from "../types";

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const nullableString = (value: unknown) => value === undefined || value === null || typeof value === "string";
export function isBanner(value: unknown): value is Banner {
  return record(value) && typeof value.id === "string" && typeof value.title === "string" && typeof value.desktopImageUrl === "string" && nullableString(value.mobileImageUrl) && nullableString(value.link) && isBannerPosition(value.position) && typeof value.sortOrder === "number" && Number.isFinite(value.sortOrder) && nullableString(value.startsAt) && nullableString(value.endsAt) && typeof value.isActive === "boolean" && typeof value.createdAt === "string" && typeof value.updatedAt === "string";
}
export function isBannerList(value: unknown): value is BannerList {
  if (!record(value) || !Array.isArray(value.items) || !value.items.every(isBanner) || !record(value.pagination)) return false;
  return [value.pagination.page, value.pagination.limit, value.pagination.total, value.pagination.totalPages].every((item) => typeof item === "number" && Number.isFinite(item));
}
export const isDeletedBanner = (value: unknown): value is { id: string } => record(value) && typeof value.id === "string" && value.id.length > 0;
export function backendFieldErrors(data: unknown) { if (!record(data) || !Array.isArray(data.errors)) return undefined; const fields: Record<string, string> = {}; for (const item of data.errors) if (record(item) && typeof item.field === "string" && typeof item.message === "string") fields[item.field] = item.message; return Object.keys(fields).length ? fields : undefined; }
export function parseBannerPage(value: string | null) { const page = Number(value ?? 1); return Number.isSafeInteger(page) && page > 0 ? page : 1; }
export function parseBannerActive(value: string | null) { return value === "true" ? true : value === "false" ? false : undefined; }
export function buildBannerListQuery(params: BannerListParams) { const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) }); if (params.search) query.set("search", params.search); if (params.position) query.set("position", params.position); if (params.isActive !== undefined) query.set("isActive", String(params.isActive)); return query.toString(); }
