export type BackendErrorKind =
  | "network"
  | "timeout"
  | "aborted"
  | "invalid_json"
  | "invalid_envelope"
  | "invalid_data"
  | "http"
  | "application"
  | "configuration";

export class BackendRequestError extends Error {
  readonly kind: BackendErrorKind;
  readonly status?: number;
  readonly code?: number;
  readonly backendMessage?: string;
  readonly data?: unknown;
  readonly retryAfter?: string;

  constructor(kind: BackendErrorKind, options: { status?: number; code?: number; backendMessage?: string; data?: unknown; retryAfter?: string } = {}) {
    super(kind);
    this.name = "BackendRequestError";
    this.kind = kind;
    this.status = options.status;
    this.code = options.code;
    this.backendMessage = options.backendMessage;
    this.data = options.data;
    this.retryAfter = options.retryAfter;
  }
}
