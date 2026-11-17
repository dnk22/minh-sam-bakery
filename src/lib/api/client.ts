import "server-only";

import type { ApiResponse } from "./types";

const DEFAULT_BACKEND_URL = "https://minh-sam-backend.onrender.com";
const API_TIMEOUT_MS = 12_000;

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function backendBaseUrl() {
  return (process.env.BACKEND_BASE_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export function backendAssetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${backendBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiGet<T>(
  path: string,
  validate: (value: unknown) => value is T,
  options: { revalidate?: number; tags?: string[] } = {},
) {
  const response = await fetch(`${backendBaseUrl()}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    next: { revalidate: options.revalidate ?? 300, tags: options.tags },
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiClientError("Backend returned an invalid JSON response", response.status);
  }

  if (!isApiEnvelope(payload)) {
    throw new ApiClientError("Backend response does not match ApiResponse");
  }
  if (!response.ok || payload.code < 200 || payload.code >= 300) {
    throw new ApiClientError(payload.message || "Backend request failed", response.status, payload.code);
  }
  if (!validate(payload.data)) {
    throw new ApiClientError("Backend data does not match the documented schema", response.status, payload.code);
  }
  return payload as ApiResponse<T>;
}

function isApiEnvelope(value: unknown): value is ApiResponse<unknown> {
  if (!isRecord(value)) return false;
  return typeof value.code === "number" && typeof value.message === "string" && "data" in value;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
