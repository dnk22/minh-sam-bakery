import "server-only";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";
import { backendFieldErrors } from "../lib/banner-data";
import { bannerErrorMessage } from "../lib/banner-errors";
export function requireBannerAccess() {
  return requireCmsApiAccess(bannerError);
}
export function bannerError(status: number, error?: unknown, fallback?: string) { const backend = error instanceof BackendRequestError ? error : null; const resolved = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status; return noStoreJson({ ok: false, error: { code: `BANNER_${resolved}`, message: fallback ?? bannerErrorMessage(resolved), fields: backendFieldErrors(backend?.data) } }, { status: resolved }); }
export const bannerJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export const validBannerId = (id: string) => id.length > 0 && id.length <= 200 && !id.includes("/");
