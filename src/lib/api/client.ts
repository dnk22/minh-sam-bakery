import "server-only";

import { resolveBackendAssetUrl } from "./asset-url";
import { backendBaseUrl, backendRequest } from "./backend-client";
import { BackendRequestError, type BackendErrorKind } from "./errors";

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: number,
    readonly kind?: BackendErrorKind,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export { backendBaseUrl };

export function backendAssetUrl(path: string | null | undefined) {
  return resolveBackendAssetUrl(path, backendBaseUrl());
}

export async function apiGet<T>(
  path: string,
  validate: (value: unknown) => value is T,
  options: { revalidate?: number; tags?: string[] } = {},
) {
  try {
    return await backendRequest({
      method: "GET",
      path,
      validate,
      next: { revalidate: options.revalidate ?? 300, tags: options.tags },
    });
  } catch (error) {
    if (!(error instanceof BackendRequestError)) throw error;
    const message = error.kind === "invalid_json"
      ? "Backend returned an invalid JSON response"
      : error.kind === "invalid_envelope"
        ? "Backend response does not match ApiResponse"
        : error.kind === "invalid_data"
          ? "Backend data does not match the documented schema"
          : error.backendMessage || "Backend request failed";
    throw new ApiClientError(message, error.status, error.code, error.kind);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
