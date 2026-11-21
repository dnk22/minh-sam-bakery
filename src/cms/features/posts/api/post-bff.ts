import "server-only";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";
import { backendPostFieldErrors } from "../lib/post-data";
import { postErrorMessage } from "../lib/post-errors";

export async function requirePostAccess(): Promise<{ accessToken: string } | { response: Response }> {
  const resolution = await resolveCmsSession();
  if (resolution.status !== "authenticated") {
    const status = resolution.status === "forbidden" ? 403 : resolution.status === "locked" ? 423 : resolution.status === "unavailable" ? 503 : 401;
    return { response: postError(status) };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  return accessToken ? { accessToken } : { response: postError(401) };
}
export function postError(status: number, error?: unknown) {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  return noStoreJson({ ok: false, error: { code: `POST_${resolvedStatus}`, message: postErrorMessage(resolvedStatus), fields: backendPostFieldErrors(backend?.data) } }, { status: resolvedStatus });
}
export const postJson = (data: unknown, status = 200) => noStoreJson(data, { status });
