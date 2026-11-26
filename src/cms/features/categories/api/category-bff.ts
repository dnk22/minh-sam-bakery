import "server-only";

import { BackendRequestError } from "@/lib/api/errors";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";

import { backendFieldErrors } from "../lib/category-data";
import { categoryErrorMessage } from "../lib/category-errors";

export function requireCategoryAccess() {
  return requireCmsApiAccess(categoryError);
}

export function categoryError(status: number, error?: unknown, fallback?: string, operation: "general" | "delete" = "general") {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  const fields = backendFieldErrors(backend?.data);
  const message = fallback ?? categoryErrorMessage(resolvedStatus, operation);
  return noStoreJson({ ok: false, error: { code: `CATEGORY_${resolvedStatus}`, message, fields } }, { status: resolvedStatus });
}

export const categoryJson = (data: unknown, status = 200) => noStoreJson(data, { status });

export function validCategoryId(id: string) {
  return id.length > 0 && id.length <= 200 && !id.includes("/");
}
