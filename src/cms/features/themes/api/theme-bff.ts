import "server-only";

import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";
import { backendThemeFieldErrors } from "../lib/theme-data";

export function requireThemeAccess() {
  return requireCmsApiAccess(themeError);
}

export function themeError(status: number, error?: unknown, override?: string) {
  const backend = error instanceof BackendRequestError ? error : null;
  const httpStatus = backend?.code && backend.code >= 400 && backend.code <= 599
    ? backend.code : backend?.status ?? status;
  const messages: Record<number, string> = {
    400: "Dữ liệu theme không hợp lệ.",
    401: "Phiên đăng nhập đã hết hạn.",
    403: "Bạn không có quyền quản lý giao diện website.",
    404: "Không tìm thấy theme.",
    409: "Thao tác xung đột với trạng thái hiện tại của theme.",
    423: "Tài khoản đã bị khóa.",
    503: "Dịch vụ quản trị đang tạm gián đoạn.",
  };
  return noStoreJson({
    ok: false,
    error: {
      code: "THEME_" + httpStatus,
      message: override ?? messages[httpStatus] ?? "Không thể xử lý theme lúc này.",
      fields: backendThemeFieldErrors(backend?.data),
    },
  }, { status: httpStatus });
}

export const themeJson = (data: unknown, status = 200) => noStoreJson(data, { status });
export function validThemeId(id: string) {
  return id.length > 0 && id.length <= 200 && !id.includes("/");
}
