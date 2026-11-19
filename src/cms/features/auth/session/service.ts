import "server-only";

import { backendLogout, backendMe, backendRefresh } from "@/cms/features/auth/api/auth.server";
import { CmsAuthBackendError } from "@/cms/features/auth/lib/auth-errors";
import { isAccessTokenFresh, type CmsSessionCookies } from "@/cms/features/auth/session/cookies";
import type { CmsAuthErrorKind, CmsAuthTokens, CmsAuthUser } from "@/cms/features/auth/types";

export async function refreshCmsSession(refreshToken: string): Promise<{ tokens: CmsAuthTokens; user: CmsAuthUser }> {
  const tokens = await backendRefresh(refreshToken);
  try {
    const user = await backendMe(tokens.accessToken);
    if (user.status === "LOCKED") throw new CmsAuthBackendError("locked", 423);
    return { tokens, user };
  } catch (error) {
    if (error instanceof CmsAuthBackendError && error.kind !== "locked") {
      throw new CmsRotatedSessionError(error.kind, error.status, tokens);
    }
    throw error;
  }
}

export class CmsRotatedSessionError extends CmsAuthBackendError {
  readonly tokens: CmsAuthTokens;

  constructor(kind: CmsAuthErrorKind, status: number, tokens: CmsAuthTokens) {
    super(kind, status);
    this.name = "CmsRotatedSessionError";
    this.tokens = tokens;
  }
}

export async function revokeCmsSession(session: CmsSessionCookies): Promise<{
  revoked: boolean;
  failure: CmsAuthErrorKind | null;
}> {
  if (!session.accessToken || !session.refreshToken) return { revoked: false, failure: null };

  let accessToken = session.accessToken;
  let refreshToken = session.refreshToken;
  let refreshed = false;

  const rotateOnce = async () => {
    const tokens = await backendRefresh(refreshToken);
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
    refreshed = true;
  };

  try {
    if (!isAccessTokenFresh(session, Date.now())) await rotateOnce();
    return { revoked: (await backendLogout(accessToken, refreshToken)).revoked, failure: null };
  } catch (error) {
    if (error instanceof CmsAuthBackendError && error.kind === "unauthorized" && !refreshed) {
      try {
        await rotateOnce();
        return { revoked: (await backendLogout(accessToken, refreshToken)).revoked, failure: null };
      } catch (retryError) {
        return { revoked: false, failure: authFailureKind(retryError) };
      }
    }
    return { revoked: false, failure: authFailureKind(error) };
  }
}

function authFailureKind(error: unknown): CmsAuthErrorKind {
  return error instanceof CmsAuthBackendError ? error.kind : "unavailable";
}
