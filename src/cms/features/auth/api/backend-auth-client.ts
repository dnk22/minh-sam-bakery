import "server-only";

import { backendBaseUrl } from "@/lib/api/client";
import { CmsAuthBackendError, mapBackendError, mapBackendNetworkError } from "@/cms/features/auth/lib/backend-errors";
import type { CmsAuthTokens, CmsAuthUser, CmsLoginResult } from "@/cms/features/auth/types";
import {
  isCmsAuthTokens,
  isCmsAuthUser,
  isCmsLoginResult,
  isLogoutResult,
} from "@/cms/features/auth/lib/validation";

const AUTH_TIMEOUT_MS = 10_000;

export { CmsAuthBackendError } from "@/cms/features/auth/lib/backend-errors";

export async function backendLogin(credentials: { email: string; password: string }): Promise<CmsLoginResult> {
  return authRequest("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, isCmsLoginResult, "login");
}

export async function backendRefresh(refreshToken: string): Promise<CmsAuthTokens> {
  return authRequest("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  }, isCmsAuthTokens, "refresh");
}

export async function backendLogout(accessToken: string, refreshToken: string): Promise<{ revoked: boolean }> {
  return authRequest("/api/v1/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    headers: { Authorization: `Bearer ${accessToken}` },
  }, isLogoutResult, "logout");
}

export async function backendMe(accessToken: string): Promise<CmsAuthUser> {
  return authRequest("/api/v1/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  }, isCmsAuthUser, "me");
}

async function authRequest<T>(
  path: string,
  init: RequestInit,
  validate: (value: unknown) => value is T,
  operation: "login" | "refresh" | "logout" | "me",
): Promise<T> {
  const baseUrl = backendBaseUrl();
  if (process.env.NODE_ENV === "production" && !baseUrl.startsWith("https://")) {
    throw new CmsAuthBackendError("unavailable", 503);
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
      signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
    });
  } catch (error) {
    throw new CmsAuthBackendError(mapBackendNetworkError(error), 503);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new CmsAuthBackendError("invalid_response", 502);
  }
  if (!isAuthEnvelope(payload)) {
    throw new CmsAuthBackendError("invalid_response", 502);
  }
  if (!response.ok || payload.code < 200 || payload.code >= 300) {
    throw new CmsAuthBackendError(mapBackendError(response.status, payload.message, operation), response.status);
  }
  if (!validate(payload.data)) throw new CmsAuthBackendError("invalid_response", 502);
  return payload.data;
}

function isAuthEnvelope(value: unknown): value is { code: number; message: string; data: unknown } {
  return typeof value === "object" && value !== null && !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).code === "number" &&
    typeof (value as Record<string, unknown>).message === "string" &&
    "data" in value;
}

