import "server-only";
import { noStoreJson } from "@/cms/features/auth/api/browser-response";
import { requireCmsApiAccess } from "@/cms/features/auth/api/require-cms-api-access";
import { BackendRequestError } from "@/lib/api/errors";

export function dashboardError(status: number, error?: unknown) {
  const backend = error instanceof BackendRequestError ? error : null;
  const code = backend?.code && backend.code >= 400 && backend.code <= 599 ? backend.code : backend?.status;
  const resolved = code && code >= 400 && code <= 599 ? code : status;
  const message = resolved === 400 ? "Khoảng thời gian hoặc tham số báo cáo không hợp lệ." : resolved === 403 ? "Tài khoản không có quyền xem báo cáo." : resolved === 401 ? "Phiên đăng nhập không hợp lệ." : "Không thể tải báo cáo. Vui lòng thử lại.";
  return noStoreJson({ ok: false, error: { code: `DASHBOARD_${resolved}`, message } }, { status: resolved });
}
export const requireDashboardAccess = () => requireCmsApiAccess(dashboardError);
export const dashboardJson = (data: unknown) => noStoreJson(data);
