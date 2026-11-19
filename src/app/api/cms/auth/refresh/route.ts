import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { CmsAuthBackendError } from "@/cms/features/auth/lib/auth-errors";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import {
  clearCmsSessionCookies,
  readCmsSessionCookies,
  writeCmsSessionCookies,
} from "@/cms/features/auth/session/cookies";
import { CmsRotatedSessionError, refreshCmsSession } from "@/cms/features/auth/session/service";

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return authErrorResponse("forbidden");
  if (!hasJsonContentType(request)) return authErrorResponse("validation");

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
    const response = authErrorResponse(kind);
    if (kind === "unauthorized" || kind === "locked") clearCmsSessionCookies(response);
    else if (error instanceof CmsRotatedSessionError) writeCmsSessionCookies(response, error.tokens, Date.now());
    return response;
  }
}
