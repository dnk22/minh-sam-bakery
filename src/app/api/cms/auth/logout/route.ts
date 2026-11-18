import { backendLogout, CmsAuthBackendError } from "@/cms/features/auth/api/backend-auth-client";
import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { clearCmsSessionCookies, readCmsSessionCookies } from "@/cms/features/auth/session/cookies";

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return authErrorResponse("forbidden");
  if (!hasJsonContentType(request)) return authErrorResponse("validation");

  const session = await readCmsSessionCookies();
  let revoked = false;
  let failure: "unavailable" | "timeout" | "invalid_response" | null = null;
  if (session.accessToken && session.refreshToken) {
    try {
      revoked = (await backendLogout(session.accessToken, session.refreshToken)).revoked;
    } catch (error) {
      if (error instanceof CmsAuthBackendError && (error.kind === "unavailable" || error.kind === "timeout" || error.kind === "invalid_response")) {
        failure = error.kind;
      }
    }
  }

  const response = failure
    ? noStoreJson({ ok: false, revoked: false, localSessionCleared: true, error: { code: failure.toUpperCase(), message: "Đã xóa phiên trên thiết bị nhưng chưa thể xác nhận thu hồi token với máy chủ." } }, { status: failure === "timeout" ? 504 : 503 })
    : noStoreJson({ ok: true, revoked, localSessionCleared: true });
  clearCmsSessionCookies(response);
  return response;
}
