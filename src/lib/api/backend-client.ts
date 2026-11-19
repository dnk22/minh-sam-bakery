import "server-only";

import { BackendRequestError } from "./errors";
import { requestApiEnvelope, type BackendRequestOptions } from "./transport";

const DEFAULT_BACKEND_URL = "https://minh-sam-backend.onrender.com";

export function backendBaseUrl() {
  return (process.env.BACKEND_BASE_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export async function backendRequest<T>(
  options: Omit<BackendRequestOptions<T>, "baseUrl" | "fetchImpl"> & { requireHttps?: boolean },
) {
  const baseUrl = backendBaseUrl();
  const { requireHttps, ...requestOptions } = options;
  if (requireHttps && process.env.NODE_ENV === "production" && !baseUrl.startsWith("https://")) {
    throw new BackendRequestError("configuration");
  }
  return requestApiEnvelope({ ...requestOptions, baseUrl });
}
