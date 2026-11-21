import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";

import { backendFieldErrors } from "../lib/system-config-data";
import { systemConfigErrorMessage } from "../lib/system-config-errors";

export async function requireSystemConfigAccess(): Promise<{ accessToken: string } | { response: Response }> {
  const resolution = await resolveCmsSession();
  if (resolution.status !== "authenticated") {
    const status = resolution.status === "forbidden" ? 403 : resolution.status === "locked" ? 423 : resolution.status === "unavailable" ? 503 : 401;
    return { response: systemConfigError(status) };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  return accessToken ? { accessToken } : { response: systemConfigError(401) };
}

export function systemConfigError(status: number, error?: unknown, fallback?: string, operation: "general" | "delete" = "general") {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  return noStoreJson({ ok: false, error: { code: `SYSTEM_CONFIG_${resolvedStatus}`, message: fallback ?? systemConfigErrorMessage(resolvedStatus, operation), fields: backendFieldErrors(backend?.data) } }, { status: resolvedStatus });
}

export const systemConfigJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export function validSystemConfigId(id: string) { return id.length > 0 && id.length <= 200 && !id.includes("/"); }
