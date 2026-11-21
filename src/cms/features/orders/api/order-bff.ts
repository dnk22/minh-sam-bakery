import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";

import { orderErrorMessage } from "../lib/order-errors";

export async function requireOrderAccess(): Promise<{ accessToken: string } | { response: Response }> {
  const resolution = await resolveCmsSession();
  if (resolution.status !== "authenticated") {
    const status = resolution.status === "forbidden" ? 403
      : resolution.status === "locked" ? 423
        : resolution.status === "unavailable" ? 503 : 401;
    return { response: orderError(status) };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  return accessToken ? { accessToken } : { response: orderError(401) };
}

export function orderError(status: number, error?: unknown) {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599
    ? backend.code
    : backend?.status && backend.status >= 400 && backend.status <= 599 ? backend.status : status;
  return noStoreJson({
    ok: false,
    error: { code: `ORDER_${resolvedStatus}`, message: orderErrorMessage(resolvedStatus) },
  }, { status: resolvedStatus });
}

export const orderJson = (data: unknown, status = 200) => noStoreJson(data, { status });
