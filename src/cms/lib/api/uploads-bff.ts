import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { BackendRequestError } from "@/lib/api/errors";

export async function requireUploadAccess(): Promise<{ accessToken: string } | { response: Response }> {
  const resolution = await resolveCmsSession();
  if (resolution.status !== "authenticated") {
    const status = resolution.status === "forbidden" ? 403 : resolution.status === "locked" ? 423 : resolution.status === "unavailable" ? 503 : 401;
    return { response: uploadError(status) };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  return accessToken ? { accessToken } : { response: uploadError(401) };
}

export function uploadError(status: number, error?: unknown, fallback?: string) {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  const message = fallback ?? (resolvedStatus === 401 ? "Phiên đăng nhập không còn hợp lệ." : resolvedStatus === 403 ? "Bạn không có quyền tải ảnh." : "Dịch vụ hình ảnh đang tạm thời gián đoạn.");
  return noStoreJson({ ok: false, error: { code: `UPLOAD_${resolvedStatus}`, message } }, { status: resolvedStatus });
}

export const uploadJson = (data: unknown, status = 200) => noStoreJson(data, { status });
