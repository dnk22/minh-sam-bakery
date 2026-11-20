import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";

import { productErrorMessage } from "../lib/product-errors";
import { backendProductFieldErrors } from "../lib/product-data";

export async function requireProductAccess(): Promise<{ accessToken: string } | { response: Response }> {
  const resolution = await resolveCmsSession();
  if (resolution.status !== "authenticated") {
    const status = resolution.status === "forbidden" ? 403 : resolution.status === "locked" ? 423 : resolution.status === "unavailable" ? 503 : 401;
    return { response: productError(status) };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  return accessToken ? { accessToken } : { response: productError(401) };
}

export function productError(status: number, error?: unknown) {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  return noStoreJson({ ok: false, error: { code: `PRODUCT_${resolvedStatus}`, message: productErrorMessage(resolvedStatus), fields: backendProductFieldErrors(backend?.data) } }, { status: resolvedStatus });
}

export const productJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export function validProductId(id: string) { return id.length > 0 && id.length <= 200 && !id.includes("/"); }
