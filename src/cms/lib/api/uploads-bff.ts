import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";

export function requireUploadAccess() {
  return requireCmsApiAccess(uploadError);
}

export function uploadError(status: number, error?: unknown, fallback?: string) {
  const backend = error instanceof BackendRequestError ? error : null;
  const resolvedStatus = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status ?? status;
  const message = fallback ?? (resolvedStatus === 401 ? "Phiên đăng nhập không còn hợp lệ." : resolvedStatus === 403 ? "Bạn không có quyền tải ảnh." : "Dịch vụ hình ảnh đang tạm thời gián đoạn.");
  return noStoreJson({ ok: false, error: { code: `UPLOAD_${resolvedStatus}`, message } }, { status: resolvedStatus });
}

export const uploadJson = (data: unknown, status = 200) => noStoreJson(data, { status });
