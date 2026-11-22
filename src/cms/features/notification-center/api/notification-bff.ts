import "server-only";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";
import { notificationErrorMessage } from "../lib/notification-errors";
export async function requireNotificationAccess(): Promise<{ accessToken: string } | { response: Response }> { const resolution = await resolveCmsSession(); if (resolution.status !== "authenticated") { const status = resolution.status === "forbidden" ? 403 : resolution.status === "locked" ? 423 : resolution.status === "unavailable" ? 503 : 401; return { response: notificationError(status) }; } const accessToken = (await readCmsSessionCookies()).accessToken; return accessToken ? { accessToken } : { response: notificationError(401) }; }
export function notificationError(status: number, error?: unknown, fallback?: string) { const backend = error instanceof BackendRequestError ? error : null; const resolved = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status; return noStoreJson({ ok: false, error: { code: `NOTIFICATION_${resolved}`, message: fallback ?? notificationErrorMessage(resolved) } }, { status: resolved }); }
export const notificationJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export const validNotificationId = (id: string) => id.length > 0 && id.length <= 200 && !id.includes("/");
