import "server-only";

import { ApiClientError } from "@/lib/api/client";

export type CatalogOperation =
  | "categories"
  | "category-products"
  | "related-other";

export function reportCatalogError(
  operation: CatalogOperation,
  endpoint: string,
  error: unknown,
) {
  const detail = error instanceof ApiClientError
    ? {
        kind: error.kind ?? "api",
        status: error.status ?? null,
        code: error.code ?? null,
        validationFailure: error.kind === "invalid_data" || error.kind === "invalid_envelope",
      }
    : {
        kind: error instanceof Error ? error.name : "unknown",
        status: null,
        code: null,
        validationFailure: false,
      };

  console.error("[catalog] Backend request failed", {
    operation,
    endpoint,
    ...detail,
  });
}
