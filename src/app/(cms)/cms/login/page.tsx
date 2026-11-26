import { redirect } from "next/navigation";

import { CmsLoginScreen } from "@/cms/features/auth/components/login-screen/login-screen";
import { sanitizeCmsRedirect } from "@/cms/features/auth/lib/redirect";
import { resolveCmsSession } from "@/cms/features/auth/session/current-session";

export const instant = false;

const errorMessages: Record<string, string> = {
  locked: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
  "session-expired": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  forbidden: "Tài khoản không có quyền truy cập CMS.",
  "session-recovery-failed": "Không thể khôi phục phiên đăng nhập. Vui lòng đăng nhập lại.",
};

const notices: Record<string, string> = {
  logout: "Bạn đã đăng xuất và phiên trên máy chủ đã được thu hồi.",
  "logout-local": "Phiên trên thiết bị đã được xóa, nhưng chưa thể xác nhận thu hồi token với máy chủ.",
};

export default async function CmsLoginPage({ searchParams }: PageProps<"/cms/login">) {
  const params = await searchParams;
  const redirectTo = sanitizeCmsRedirect(params.redirect);
  const errorKey = typeof params.error === "string" ? params.error : "";
  // Explicit recovery failures must not trigger login → refresh → login loops.
  if (["session-recovery-failed", "session-expired", "locked", "forbidden"].includes(errorKey)) {
    return <CmsLoginScreen message={errorMessages[errorKey]} redirectTo={redirectTo} />;
  }
  const session = await resolveCmsSession();
  if (session.status === "authenticated") redirect(redirectTo);
  if (session.status === "needs_refresh") {
    redirect(`/cms/session-refresh?redirect=${encodeURIComponent(redirectTo)}`);
  }

  const noticeKey = typeof params.notice === "string" ? params.notice : "";
  const sessionMessage = session.status === "locked"
    ? errorMessages.locked
    : session.status === "forbidden"
      ? errorMessages.forbidden
      : session.status === "unavailable"
        ? "Hệ thống xác thực đang tạm thời gián đoạn. Bạn vẫn có thể thử đăng nhập lại."
        : undefined;

  return <CmsLoginScreen message={errorMessages[errorKey] || sessionMessage} notice={notices[noticeKey]} redirectTo={redirectTo} />;
}
