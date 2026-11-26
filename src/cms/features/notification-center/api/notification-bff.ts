import "server-only";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";
import { notificationErrorMessage } from "../lib/notification-errors";
export function requireNotificationAccess() {
  return requireCmsApiAccess(notificationError);
}
export function notificationError(status: number, error?: unknown, fallback?: string) { const backend = error instanceof BackendRequestError ? error : null; const resolved = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status; return noStoreJson({ ok: false, error: { code: `NOTIFICATION_${resolved}`, message: fallback ?? notificationErrorMessage(resolved) } }, { status: resolved }); }
export const notificationJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export const validNotificationId = (id: string) => id.length > 0 && id.length <= 200 && !id.includes("/");
