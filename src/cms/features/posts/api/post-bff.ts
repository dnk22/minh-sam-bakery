import "server-only";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";
import { backendPostFieldErrors } from "../lib/post-data";
import { postErrorMessage } from "../lib/post-errors";

export function requirePostAccess() {
  return requireCmsApiAccess(postError);
}
export function postError(status: number, error?: unknown) {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  return noStoreJson({ ok: false, error: { code: `POST_${resolvedStatus}`, message: postErrorMessage(resolvedStatus), fields: backendPostFieldErrors(backend?.data) } }, { status: resolvedStatus });
}
export const postJson = (data: unknown, status = 200) => noStoreJson(data, { status });
