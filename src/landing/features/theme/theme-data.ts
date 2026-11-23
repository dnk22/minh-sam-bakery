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

export type LandingThemeFetchFailure = {
  source: "classic-invalid-response" | "classic-api-error";
  fetchDiagnostic: LandingThemeFetchDiagnostic;
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

export type PublicThemeRequestOptions = {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

export async function requestPublicTheme(options: PublicThemeRequestOptions) {
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

/**
 * Cacheable success path: allow transport errors to propagate instead of
 * returning a Classic fallback that might be stored as a cache hit.
 */
export async function loadActiveLandingTheme(options: PublicThemeRequestOptions): Promise<ActiveLandingTheme> {
  return resolveLandingThemeData(await requestPublicTheme(options));
}

export type LandingThemeCacheRecord =
  | { state: "resolved"; value: ActiveLandingTheme }
  | { state: "fetch-error"; failure: LandingThemeFetchFailure };

/**
 * The cache can store a short-lived failure marker, never a successful Classic
 * fallback. This also keeps Next's prerender pipeline from seeing an uncaught IO
 * error while filling its cache.
 */
export async function loadLandingThemeCacheRecord(options: PublicThemeRequestOptions): Promise<LandingThemeCacheRecord> {
  try {
    return { state: "resolved", value: await loadActiveLandingTheme(options) };
  } catch (error) {
    return { state: "fetch-error", failure: describeLandingThemeFailure(error) };
  }
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

export function describeLandingThemeFailure(error: unknown): LandingThemeFetchFailure {
  const backendError = error instanceof BackendRequestError ? error : null;
  const invalidResponse = backendError !== null
    && ["invalid_json", "invalid_envelope", "invalid_data"].includes(backendError.kind);
  return {
    source: invalidResponse ? "classic-invalid-response" : "classic-api-error",
    fetchDiagnostic: {
      code: backendError?.kind ?? "unknown-error",
      status: backendError?.status ?? null,
      message: invalidResponse
        ? "Theme API trả dữ liệu không hợp lệ; Landing đang dùng Classic."
        : "Không thể tải active theme; Landing đang dùng Classic.",
    },
  };
}

export function resolveLandingThemeFetchFailure(failure: LandingThemeFetchFailure): ActiveLandingTheme {
  return classicResult(failure.source, failure.fetchDiagnostic);
}

export function resolveLandingThemeFailure(error: unknown): ActiveLandingTheme {
  return resolveLandingThemeFetchFailure(describeLandingThemeFailure(error));
}
