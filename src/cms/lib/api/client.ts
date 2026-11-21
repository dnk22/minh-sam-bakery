import { CmsApiError } from "./errors.ts";

type CmsRequestOptions = {
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
};

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  options: CmsRequestOptions = {},
): Promise<T> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new CmsApiError("INVALID_RESPONSE", "Không thể kết nối đến dịch vụ quản trị.");
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), options.timeoutMs ?? 10_000);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutController.signal])
    : timeoutController.signal;

  let response: Response;
  try {
    const isMultipart = options.body instanceof FormData;
    const requestBody = options.body === undefined ? undefined : isMultipart ? options.body as FormData : JSON.stringify(options.body);
    response = await fetch(`/api/cms${path}`, {
      method,
      body: requestBody,
      cache: "no-store",
      credentials: "same-origin",
      signal,
      headers: options.body === undefined || isMultipart ? undefined : { "Content-Type": "application/json" },
    });
  } catch {
    if (options.signal?.aborted) throw new CmsApiError("NETWORK", "Yêu cầu đã bị hủy.");
    if (timeoutController.signal.aborted) throw new CmsApiError("TIMEOUT", "Hệ thống phản hồi quá lâu. Vui lòng thử lại.");
    throw new CmsApiError("NETWORK", "Không thể kết nối tới hệ thống. Vui lòng thử lại.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 204) return undefined as T;

  let payload: unknown;
  try {
    payload = JSON.parse(await response.text());
  } catch {
    throw new CmsApiError("INVALID_RESPONSE", "Hệ thống trả về dữ liệu không hợp lệ.", { status: response.status });
  }
  if (!response.ok) throw cmsErrorFromResponse(response.status, payload);
  return payload as T;
}

function cmsErrorFromResponse(status: number, payload: unknown) {
  const record = isRecord(payload) ? payload : {};
  const error = isRecord(record.error) ? record.error : {};
  const code = typeof error.code === "string" ? error.code : statusCode(status);
  const message = typeof error.message === "string" ? error.message : statusMessage(status);
  const fields = isRecord(error.fields)
    ? Object.fromEntries(Object.entries(error.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
    : undefined;
  return new CmsApiError(code, message, { status, fields, details: payload });
}

function statusCode(status: number): CmsApiError["code"] {
  if (status === 400) return "VALIDATION";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 423) return "LOCKED";
  if (status === 429) return "RATE_LIMITED";
  if (status === 504) return "TIMEOUT";
  return status >= 500 ? "UNAVAILABLE" : "INVALID_RESPONSE";
}

function statusMessage(status: number) {
  if (status === 401) return "Phiên đăng nhập không hợp lệ.";
  if (status === 403) return "Tài khoản không có quyền truy cập.";
  if (status === 429) return "Có quá nhiều yêu cầu. Vui lòng thử lại sau.";
  return "Không thể hoàn tất yêu cầu lúc này.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const cmsApiClient = {
  get: <T>(path: string, options?: Omit<CmsRequestOptions, "body">) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<CmsRequestOptions, "body">) => request<T>("POST", path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Omit<CmsRequestOptions, "body">) => request<T>("PUT", path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<CmsRequestOptions, "body">) => request<T>("PATCH", path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<CmsRequestOptions, "body">) => request<T>("DELETE", path, options),
};
