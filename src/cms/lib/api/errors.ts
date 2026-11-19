export type CmsApiErrorCode =
  | "NETWORK"
  | "TIMEOUT"
  | "INVALID_RESPONSE"
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "LOCKED"
  | "RATE_LIMITED"
  | "UNAVAILABLE"
  | string;

export class CmsApiError extends Error {
  readonly code: CmsApiErrorCode;
  readonly status?: number;
  readonly fields?: Record<string, string>;
  readonly details?: unknown;

  constructor(
    code: CmsApiErrorCode,
    message: string,
    options: { status?: number; fields?: Record<string, string>; details?: unknown } = {},
  ) {
    super(message);
    this.name = "CmsApiError";
    this.code = code;
    this.status = options.status;
    this.fields = options.fields;
    this.details = options.details;
  }
}
