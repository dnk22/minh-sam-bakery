import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { clearCmsSessionCookies, readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { revokeCmsSession } from "@/cms/features/auth/session/service";

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return authErrorResponse("forbidden");
  if (!hasJsonContentType(request)) return authErrorResponse("validation");

  const result = await revokeCmsSession(await readCmsSessionCookies());
  const response = result.failure
    ? authErrorResponse(result.failure, {
        body: { revoked: false, localSessionCleared: true },
        message: "Đã xóa phiên trên thiết bị nhưng chưa thể xác nhận thu hồi token với máy chủ.",
      })
    : noStoreJson({ ok: true, revoked: result.revoked, localSessionCleared: true });
  clearCmsSessionCookies(response);
  return response;
}
