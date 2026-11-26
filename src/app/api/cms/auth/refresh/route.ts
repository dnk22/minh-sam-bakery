import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { CmsAuthBackendError } from "@/cms/features/auth/lib/auth-errors";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import {
  clearCmsSessionCookies,
  readCmsSessionCookies,
  writeCmsSessionCookies,
} from "@/cms/features/auth/session/cookies";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";
import { CmsRotatedSessionError, refreshCmsSession } from "@/cms/features/auth/session/service";

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return authErrorResponse("forbidden");
  if (!hasJsonContentType(request)) return authErrorResponse("validation");

  let body: unknown;
  try { body = await request.json(); } catch { return authErrorResponse("validation"); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return authErrorResponse("validation");
  const checkFresh = "checkFresh" in body && body.checkFresh === true;

  // A prior attempt or another tab may already have rotated the cookies.
  // Verify the current session before rotating again, especially after a lost response.
  if (checkFresh) {
    const resolution = await resolveCmsSession();
    if (resolution.status === "authenticated") return noStoreJson({ ok: true });
    if (resolution.status === "unavailable") return authErrorResponse("unavailable");
    if (resolution.status === "forbidden") return authErrorResponse("forbidden");
    if (resolution.status === "locked") {
      const response = authErrorResponse("locked");
      clearCmsSessionCookies(response);
      return response;
    }
  }

  const session = await readCmsSessionCookies();
  if (!session.refreshToken) {
    const response = authErrorResponse("unauthorized");
    clearCmsSessionCookies(response);
    return response;
  }

  try {
    const { tokens } = await refreshCmsSession(session.refreshToken);
    const response = noStoreJson({ ok: true });
    writeCmsSessionCookies(response, tokens, Date.now());
    return response;
  } catch (error) {
    const kind = error instanceof CmsAuthBackendError ? error.kind : "unavailable";
    const response = authErrorResponse(kind, kind === "unauthorized" ? { message: "Phiên đăng nhập đã hết hạn." } : undefined);
    if (error instanceof CmsAuthBackendError && error.retryAfter) response.headers.set("Retry-After", error.retryAfter);
    if (kind === "unauthorized" || kind === "locked") clearCmsSessionCookies(response);
    else if (error instanceof CmsRotatedSessionError) writeCmsSessionCookies(response, error.tokens, Date.now());
    return response;
  }
}
