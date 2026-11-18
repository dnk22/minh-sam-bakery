import { NextResponse } from "next/server";

import type { CmsAuthErrorKind } from "@/cms/features/auth/types";

const messages: Record<CmsAuthErrorKind, string> = {
  validation: "Dữ liệu đăng nhập không hợp lệ.",
  unauthorized: "Email hoặc mật khẩu không chính xác.",
  forbidden: "Tài khoản không có quyền truy cập.",
  locked: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
  rate_limited: "Có quá nhiều yêu cầu. Vui lòng thử lại sau.",
  timeout: "Máy chủ phản hồi quá lâu. Vui lòng thử lại.",
  unavailable: "Hệ thống xác thực đang tạm thời gián đoạn.",
  invalid_response: "Hệ thống xác thực trả về dữ liệu không hợp lệ.",
};

const statuses: Record<CmsAuthErrorKind, number> = {
  validation: 400,
  unauthorized: 401,
  forbidden: 403,
  locked: 423,
  rate_limited: 429,
  timeout: 504,
  unavailable: 503,
  invalid_response: 502,
};

export function authErrorResponse(kind: CmsAuthErrorKind, init?: { fields?: { email?: string; password?: string }; status?: number }) {
  return noStoreJson({ ok: false, error: { code: kind.toUpperCase(), message: messages[kind], fields: init?.fields } }, { status: init?.status ?? statuses[kind] });
}

export function noStoreJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, private");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export function authMessage(kind: CmsAuthErrorKind) {
  return messages[kind];
}
