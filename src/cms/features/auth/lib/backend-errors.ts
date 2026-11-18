import type { CmsAuthErrorKind } from "@/cms/features/auth/types";

export class CmsAuthBackendError extends Error {
  readonly kind: CmsAuthErrorKind;
  readonly status: number;

  constructor(kind: CmsAuthErrorKind, status: number) {
    super(kind);
    this.name = "CmsAuthBackendError";
    this.kind = kind;
    this.status = status;
  }
}

export function mapBackendError(status: number, message: string, operation: "login" | "refresh" | "logout" | "me"): CmsAuthErrorKind {
  const normalized = message.toLocaleLowerCase("vi");
  if (status === 403 && /(locked|khóa|khoá)/i.test(normalized)) return "locked";
  if (status === 401 || (status === 404 && (operation === "login" || operation === "refresh"))) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 400) return "validation";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "unavailable";
  return "invalid_response";
}

export function mapBackendNetworkError(error: unknown): CmsAuthErrorKind {
  const name = error instanceof Error ? error.name : "";
  return name === "TimeoutError" || name === "AbortError" ? "timeout" : "unavailable";
}
