import { BackendRequestError } from "./errors.ts";
import type { ApiResponse } from "./types";

export type BackendQueryValue = string | number | boolean | null | undefined;

export type BackendRequestOptions<T> = {
  baseUrl: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, BackendQueryValue | BackendQueryValue[]>;
  body?: unknown;
  accessToken?: string;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  validate: (value: unknown) => value is T;
  fetchImpl?: typeof fetch;
};

export async function requestApiEnvelope<T>(options: BackendRequestOptions<T>): Promise<ApiResponse<T>> {
  const url = buildBackendUrl(options.baseUrl, options.path, options.query);
  const timeoutSignal = AbortSignal.timeout(options.timeoutMs ?? 12_000);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutSignal])
    : timeoutSignal;

  let response: Response;
  try {
    response = await (options.fetchImpl ?? fetch)(url, {
      method: options.method ?? "GET",
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: options.cache,
      next: options.next,
      signal,
      headers: {
        Accept: "application/json",
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    if (options.signal?.aborted) throw new BackendRequestError("aborted");
    if (timeoutSignal.aborted) throw new BackendRequestError("timeout");
    throw new BackendRequestError("network");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(await response.text());
  } catch {
    throw new BackendRequestError("invalid_json", { status: response.status });
  }
  if (!isApiEnvelope(payload)) {
    throw new BackendRequestError("invalid_envelope", { status: response.status });
  }
  if (!response.ok) {
    throw new BackendRequestError("http", {
      status: response.status,
      code: payload.code,
      backendMessage: payload.message,
    });
  }
  if (payload.code < 200 || payload.code >= 300) {
    throw new BackendRequestError("application", {
      status: response.status,
      code: payload.code,
      backendMessage: payload.message,
    });
  }
  if (!options.validate(payload.data)) {
    throw new BackendRequestError("invalid_data", { status: response.status, code: payload.code });
  }
  return payload as ApiResponse<T>;
}

export function buildBackendUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, BackendQueryValue | BackendQueryValue[]>,
) {
  const normalizedBase = `${baseUrl.replace(/\/$/, "")}/`;
  const url = new URL(path.replace(/^\//, ""), normalizedBase);
  Object.entries(query ?? {}).forEach(([key, rawValue]) => {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    values.forEach((value) => {
      if (value !== null && value !== undefined) url.searchParams.append(key, String(value));
    });
  });
  return url;
}

export function isApiEnvelope(value: unknown): value is ApiResponse<unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).code === "number" &&
    typeof (value as Record<string, unknown>).message === "string" &&
    "data" in value;
}
