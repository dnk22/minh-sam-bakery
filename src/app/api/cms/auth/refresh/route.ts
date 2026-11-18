import { backendMe, backendRefresh, CmsAuthBackendError } from "@/cms/features/auth/api/backend-auth-client";
import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import {
  clearCmsSessionCookies,
  readCmsSessionCookies,
  writeCmsSessionCookies,
} from "@/cms/features/auth/session/cookies";
import type { CmsAuthTokens } from "@/cms/features/auth/types";

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return authErrorResponse("forbidden");
  if (!hasJsonContentType(request)) return authErrorResponse("validation");

  const session = await readCmsSessionCookies();
  if (!session.refreshToken) {
    const response = authErrorResponse("unauthorized");
    clearCmsSessionCookies(response);
    return response;
  }

  let rotatedTokens: CmsAuthTokens | null = null;
  try {
    rotatedTokens = await backendRefresh(session.refreshToken);
    const user = await backendMe(rotatedTokens.accessToken);
    if (user.status === "LOCKED") {
      const response = authErrorResponse("locked");
      clearCmsSessionCookies(response);
      return response;
    }
    const response = noStoreJson({ ok: true });
    writeCmsSessionCookies(response, rotatedTokens);
    return response;
  } catch (error) {
    const kind = error instanceof CmsAuthBackendError ? error.kind : "unavailable";
    const response = authErrorResponse(kind);
    if (kind === "unauthorized" || kind === "locked") {
      clearCmsSessionCookies(response);
    } else if (rotatedTokens) {
      // Rotation already succeeded; preserve the new pair even if /me is temporarily unavailable or forbidden.
      writeCmsSessionCookies(response, rotatedTokens);
    }
    return response;
  }
}
