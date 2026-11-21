import { z } from "zod";

import { BANNER_POSITIONS, isBannerPosition, type BannerPosition } from "../../../../lib/banner/positions.ts";

import type { Banner, BannerFormValues, CreateBannerInput, UpdateBannerInput } from "../types";

const requiredText = (message: string) => z.string().trim().min(1, message);
const position = z.custom<BannerFormValues["position"]>(isBannerPosition, "Hãy chọn vị trí banner.");
const apiPosition = z.custom<BannerPosition>(isBannerPosition, "Vị trí banner không hợp lệ.");
const optionalLink = z.string().trim().refine((value) => !value || (/^\/(?!\/)/.test(value) || /^https?:\/\/[^\s]+$/i.test(value)), "Nhập đường dẫn tương đối hoặc URL http(s) hợp lệ.");
const optionalDate = z.string().trim().refine((value) => !value || !Number.isNaN(Date.parse(value)), "Ngày giờ không hợp lệ.");
const nullableLink = z.union([optionalLink, z.null()]);
const nullableDate = z.union([z.string().datetime(), z.null()]);

export const bannerFormSchema = z.object({
  title: requiredText("Tiêu đề không được để trống."), position, desktopImageUrl: requiredText("Ảnh desktop là bắt buộc."),
  mobileImageUrl: z.string(), link: optionalLink, sortOrder: z.number().int("Thứ tự phải là số nguyên."),
  startsAt: optionalDate, endsAt: optionalDate, isActive: z.boolean(),
}).superRefine(validateSchedule);

const nullableString = z.union([z.string().trim(), z.null()]);
const bannerWriteBase = z.object({
  title: requiredText("Tiêu đề không được để trống."), desktopImageUrl: requiredText("Ảnh desktop là bắt buộc."),
  mobileImageUrl: nullableString.optional(), link: nullableLink.optional(), position: apiPosition,
  sortOrder: z.number().int().optional(), startsAt: nullableDate.optional(), endsAt: nullableDate.optional(), isActive: z.boolean().optional(),
}).strict();
export const bannerCreateSchema = bannerWriteBase.extend({ mobileImageUrl: z.string().trim().optional(), link: optionalLink.optional(), startsAt: z.string().datetime().optional(), endsAt: z.string().datetime().optional() }).superRefine(validateApiSchedule);
export const bannerPatchSchema = bannerWriteBase.partial().superRefine(validateApiSchedule).refine((input) => Object.keys(input).length > 0, "Không có thay đổi để lưu.");

function validateSchedule(value: { startsAt: string; endsAt: string }, context: z.RefinementCtx) {
  if (value.startsAt && value.endsAt && Date.parse(value.startsAt) >= Date.parse(value.endsAt)) {
    context.addIssue({ code: "custom", path: ["endsAt"], message: "Thời gian kết thúc phải sau thời gian bắt đầu." });
  }
}
function validateApiSchedule(value: { startsAt?: string | null; endsAt?: string | null }, context: z.RefinementCtx) {
  if (value.startsAt && value.endsAt && Date.parse(value.startsAt) >= Date.parse(value.endsAt)) context.addIssue({ code: "custom", path: ["endsAt"], message: "Thời gian kết thúc phải sau thời gian bắt đầu." });
}

function toLocalDateTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
const iso = (value: string) => value ? new Date(value).toISOString() : undefined;

export function bannerToForm(banner?: Banner): BannerFormValues {
  return { title: banner?.title ?? "", position: banner?.position ?? "", desktopImageUrl: banner?.desktopImageUrl ?? "", mobileImageUrl: banner?.mobileImageUrl ?? "", link: banner?.link ?? "", sortOrder: banner?.sortOrder ?? 0, startsAt: toLocalDateTime(banner?.startsAt), endsAt: toLocalDateTime(banner?.endsAt), isActive: banner?.isActive ?? true };
}
export function formToBannerCreate(values: BannerFormValues): CreateBannerInput {
  const mobile = values.mobileImageUrl.trim(), link = values.link.trim(), startsAt = iso(values.startsAt), endsAt = iso(values.endsAt);
  return { title: values.title.trim(), position: values.position as Banner["position"], desktopImageUrl: values.desktopImageUrl.trim(), ...(mobile ? { mobileImageUrl: mobile } : {}), ...(link ? { link } : {}), sortOrder: values.sortOrder, ...(startsAt ? { startsAt } : {}), ...(endsAt ? { endsAt } : {}), isActive: values.isActive };
}
export function formToBannerPatch(values: BannerFormValues, original: Banner): UpdateBannerInput {
  const patch: UpdateBannerInput = {};
  const required = { title: values.title.trim(), position: values.position as Banner["position"], desktopImageUrl: values.desktopImageUrl.trim(), sortOrder: values.sortOrder, isActive: values.isActive };
  for (const key of Object.keys(required) as Array<keyof typeof required>) if (required[key] !== original[key]) Object.assign(patch, { [key]: required[key] });
  const optional = { mobileImageUrl: values.mobileImageUrl.trim() || null, link: values.link.trim() || null, startsAt: iso(values.startsAt) ?? null, endsAt: iso(values.endsAt) ?? null };
  for (const key of Object.keys(optional) as Array<keyof typeof optional>) if (optional[key] !== (original[key] ?? null)) Object.assign(patch, { [key]: optional[key] });
  return patch;
}

export const bannerPositionValues = BANNER_POSITIONS.map((item) => item.value);
