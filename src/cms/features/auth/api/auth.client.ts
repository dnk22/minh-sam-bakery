import { cmsApiClient } from "@/cms/lib/api/client";
import { CmsApiError } from "@/cms/lib/api/errors";
import type { CmsProfileUser } from "@/cms/features/auth/types";
import type { LoginCredentials } from "@/cms/features/auth/schemas/login.schema";

export class AuthClientError extends Error {
  readonly code: string;
  readonly fields?: Partial<Record<keyof LoginCredentials, string>>;
  readonly localSessionCleared: boolean;
  readonly revoked: boolean;

  constructor(error: CmsApiError) {
    super(error.message);
    this.name = "AuthClientError";
    this.code = error.code;
    this.fields = error.fields;
    const details = isRecord(error.details) ? error.details : {};
    this.localSessionCleared = details.localSessionCleared === true;
    this.revoked = details.revoked === true;
  }
}

export const authApi = {
  login: (credentials: LoginCredentials, signal?: AbortSignal) =>
    authRequest(() => cmsApiClient.post("/auth/login", credentials, { signal }), isLoginResponse),
  logout: (signal?: AbortSignal) =>
    authRequest(() => cmsApiClient.post("/auth/logout", {}, { signal }), isLogoutResponse),
  me: (signal?: AbortSignal) =>
    authRequest(() => cmsApiClient.get("/auth/me", { signal }), isLoginResponse),
  refresh: (signal?: AbortSignal) =>
    authRequest(() => cmsApiClient.post("/auth/refresh", {}, { signal }), isRefreshResponse),
};

async function authRequest<T>(operation: () => Promise<unknown>, validate: (value: unknown) => value is T) {
  try {
    const result = await operation();
    if (!validate(result)) {
      throw new CmsApiError("INVALID_RESPONSE", "Hệ thống xác thực trả về dữ liệu không hợp lệ.");
    }
    return result;
  } catch (error) {
    if (error instanceof CmsApiError) throw new AuthClientError(error);
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLoginResponse(value: unknown): value is { ok: true; user: CmsProfileUser } {
  if (!isRecord(value) || value.ok !== true || !isRecord(value.user) || !isRecord(value.user.role)) return false;
  return typeof value.user.id === "string" && typeof value.user.email === "string" &&
    typeof value.user.fullName === "string" && typeof value.user.role.name === "string";
}

function isLogoutResponse(value: unknown): value is { ok: boolean; revoked: boolean; localSessionCleared: boolean } {
  return isRecord(value) && typeof value.ok === "boolean" && typeof value.revoked === "boolean" &&
    typeof value.localSessionCleared === "boolean";
}

function isRefreshResponse(value: unknown): value is { ok: true } {
  return isRecord(value) && value.ok === true;
}
