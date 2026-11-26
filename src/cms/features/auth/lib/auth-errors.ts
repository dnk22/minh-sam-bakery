import { BackendRequestError } from "../../../../lib/api/errors.ts";
import type { CmsAuthErrorKind } from "@/cms/features/auth/types";

export type AuthOperation = "login" | "refresh" | "logout" | "me";

export class CmsAuthBackendError extends Error {
  readonly kind: CmsAuthErrorKind;
  readonly status: number;
  readonly retryAfter?: string;

  constructor(kind: CmsAuthErrorKind, status: number, retryAfter?: string) {
    super(kind);
    this.name = "CmsAuthBackendError";
    this.kind = kind;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export function mapBackendError(status: number, message: string, operation: AuthOperation): CmsAuthErrorKind {
  const normalized = message.toLocaleLowerCase("vi");
  if (status === 423) return "locked";
  if (status === 403 && /(locked|khóa|khoá)/i.test(normalized)) return "locked";
  if (status === 401 || (status === 404 && (operation === "login" || operation === "refresh"))) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 400) return "validation";
  if (status === 429) return "rate_limited";
  if (status === 504) return "timeout";
  if (status >= 500) return "unavailable";
  return "invalid_response";
}

export function toCmsAuthBackendError(error: unknown, operation: AuthOperation) {
  if (!(error instanceof BackendRequestError)) return new CmsAuthBackendError("unavailable", 503);
  if (error.kind === "timeout") return new CmsAuthBackendError("timeout", 504);
  if (error.kind === "network" || error.kind === "aborted" || error.kind === "configuration") {
    return new CmsAuthBackendError("unavailable", 503);
  }
  if (error.kind === "invalid_json" || error.kind === "invalid_envelope" || error.kind === "invalid_data") {
    return new CmsAuthBackendError("invalid_response", 502);
  }
  const status = error.code && error.code >= 400 && error.code <= 599 ? error.code : error.status ?? 502;
  return new CmsAuthBackendError(mapBackendError(status, error.backendMessage ?? "", operation), status, error.retryAfter);
}
