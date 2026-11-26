import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";

import { orderErrorMessage } from "../lib/order-errors";

export function requireOrderAccess() {
  return requireCmsApiAccess(orderError);
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
