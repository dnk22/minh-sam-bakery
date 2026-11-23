import { BackendRequestError, type BackendErrorKind } from "../../../lib/api/errors.ts";
import { requestApiEnvelope } from "../../../lib/api/transport.ts";
import type { ThemeResolutionResult } from "../../../theme/contracts/theme.types.ts";
import { createClassicThemeConfig } from "../../../theme/presets/classic.ts";
import { resolveTheme } from "../../../theme/runtime/resolve-theme.ts";

export type PublicThemeData = {
  id: string;
  name: string;
  code: string;
  config: unknown;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LandingThemeSource =
  | "active"
  | "classic-no-active"
  | "classic-invalid-config"
  | "classic-invalid-response"
  | "classic-api-error";

export type LandingThemeFetchDiagnostic = {
  code: BackendErrorKind | "no-active-theme" | "unknown-error";
  status: number | null;
  message: string;
};

export type ActiveLandingTheme = {
  theme: ThemeResolutionResult;
  source: LandingThemeSource;
  activeThemeId: string | null;
  fetchDiagnostic: LandingThemeFetchDiagnostic | null;
};

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isPublicThemeData(value: unknown): value is PublicThemeData | null {
  if (value === null) return true;
  if (typeof value !== "object" || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return nonEmptyString(data.id)
    && nonEmptyString(data.name)
    && nonEmptyString(data.code)
    && "config" in data
    && typeof data.isActive === "boolean"
    && nonEmptyString(data.createdAt)
    && Number.isFinite(Date.parse(data.createdAt))
    && nonEmptyString(data.updatedAt)
    && Number.isFinite(Date.parse(data.updatedAt));
}

export async function requestPublicTheme(options: {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}) {
  const response = await requestApiEnvelope({
    baseUrl: options.baseUrl,
    path: "/api/v1/public/theme",
    method: "GET",
    timeoutMs: options.timeoutMs ?? 5_000,
    fetchImpl: options.fetchImpl,
    validate: isPublicThemeData,
  });
  return response.data;
}

function classicResult(
  source: Exclude<LandingThemeSource, "active" | "classic-invalid-config">,
  fetchDiagnostic: LandingThemeFetchDiagnostic,
): ActiveLandingTheme {
  return {
    theme: { ...resolveTheme(createClassicThemeConfig()), fallbackUsed: true },
    source,
    activeThemeId: null,
    fetchDiagnostic,
  };
}

export function resolveLandingThemeData(data: PublicThemeData | null): ActiveLandingTheme {
  if (data === null || !data.isActive) {
    return classicResult("classic-no-active", {
      code: "no-active-theme",
      status: null,
      message: "Backend chưa có theme active; Landing đang dùng Classic.",
    });
  }

  const theme = resolveTheme(data.config);
  return {
    theme,
    source: theme.fallbackUsed ? "classic-invalid-config" : "active",
    activeThemeId: data.id,
    fetchDiagnostic: null,
  };
}

export function resolveLandingThemeFailure(error: unknown): ActiveLandingTheme {
  const backendError = error instanceof BackendRequestError ? error : null;
  const invalidResponse = backendError !== null
    && ["invalid_json", "invalid_envelope", "invalid_data"].includes(backendError.kind);
  return classicResult(invalidResponse ? "classic-invalid-response" : "classic-api-error", {
    code: backendError?.kind ?? "unknown-error",
    status: backendError?.status ?? null,
    message: invalidResponse
      ? "Theme API trả dữ liệu không hợp lệ; Landing đang dùng Classic."
      : "Không thể tải active theme; Landing đang dùng Classic.",
  });
}
