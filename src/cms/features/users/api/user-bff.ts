import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";

import { backendFieldErrors } from "../lib/user-data";
import { userErrorMessage } from "../lib/user-errors";

export async function requireUserAccess(): Promise<{ accessToken: string } | { response: Response }> {
  const resolution = await resolveCmsSession();
  if (resolution.status !== "authenticated") {
    const status = resolution.status === "forbidden" ? 403 : resolution.status === "locked" ? 423 : resolution.status === "unavailable" ? 503 : 401;
    return { response: userError(status) };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  return accessToken ? { accessToken } : { response: userError(401) };
}

export function userError(status: number, error?: unknown, fallback?: string, operation: "general" | "delete" | "action" = "general") {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  return noStoreJson({ ok: false, error: { code: `USER_${resolvedStatus}`, message: fallback ?? userErrorMessage(resolvedStatus, operation), fields: backendFieldErrors(backend?.data) } }, { status: resolvedStatus });
}

export const userJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export function validUserId(id: string) { return id.length > 0 && id.length <= 200 && !id.includes("/"); }
