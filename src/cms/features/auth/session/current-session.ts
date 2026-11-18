import "server-only";

import { backendMe, CmsAuthBackendError } from "@/cms/features/auth/api/backend-auth-client";
import { isAccessTokenFresh, readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import type { CmsSessionResolution } from "@/cms/features/auth/types";

export async function resolveCmsSession(): Promise<CmsSessionResolution> {
  const session = await readCmsSessionCookies();
  if (!session.accessToken) return session.refreshToken ? { status: "needs_refresh" } : { status: "unauthenticated" };
  if (!isAccessTokenFresh(session) && session.refreshToken) return { status: "needs_refresh" };

  try {
    const user = await backendMe(session.accessToken);
    return user.status === "LOCKED" ? { status: "locked" } : { status: "authenticated", user };
  } catch (error) {
    if (!(error instanceof CmsAuthBackendError)) return { status: "unavailable", reason: "unavailable" };
    if (error.kind === "unauthorized") return session.refreshToken ? { status: "needs_refresh" } : { status: "unauthenticated" };
    if (error.kind === "locked") return { status: "locked" };
    if (error.kind === "forbidden") return { status: "forbidden" };
    if (error.kind === "timeout" || error.kind === "invalid_response" || error.kind === "unavailable") {
      return { status: "unavailable", reason: error.kind };
    }
    return { status: "unauthenticated" };
  }
}
