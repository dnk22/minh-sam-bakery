import "server-only";

import { backendRequest } from "@/lib/api/backend-client";
import { toCmsAuthBackendError, type AuthOperation } from "@/cms/features/auth/lib/auth-errors";
import type { LoginCredentials } from "@/cms/features/auth/schemas/login.schema";
import type { CmsAuthTokens, CmsAuthUser, CmsLoginResult } from "@/cms/features/auth/types";
import { isCmsAuthTokens, isCmsAuthUser, isCmsLoginResult, isLogoutResult } from "@/cms/features/auth/lib/validation";

const AUTH_TIMEOUT_MS = 10_000;

export function backendLogin(credentials: LoginCredentials): Promise<CmsLoginResult> {
  return authRequest("login", {
    method: "POST",
    path: "/api/v1/auth/login",
    body: credentials,
    validate: isCmsLoginResult,
  });
}

export function backendRefresh(refreshToken: string): Promise<CmsAuthTokens> {
  return authRequest("refresh", {
    method: "POST",
    path: "/api/v1/auth/refresh",
    body: { refreshToken },
    validate: isCmsAuthTokens,
  });
}

export function backendLogout(accessToken: string, refreshToken: string): Promise<{ revoked: boolean }> {
  return authRequest("logout", {
    method: "POST",
    path: "/api/v1/auth/logout",
    body: { refreshToken },
    accessToken,
    validate: isLogoutResult,
  });
}

export function backendMe(accessToken: string): Promise<CmsAuthUser> {
  return authRequest("me", {
    method: "GET",
    path: "/api/v1/auth/me",
    accessToken,
    validate: isCmsAuthUser,
  });
}

async function authRequest<T>(
  operation: AuthOperation,
  options: Parameters<typeof backendRequest<T>>[0],
): Promise<T> {
  try {
    const response = await backendRequest({
      ...options,
      cache: "no-store",
      requireHttps: true,
      timeoutMs: AUTH_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw toCmsAuthBackendError(error, operation);
  }
}
