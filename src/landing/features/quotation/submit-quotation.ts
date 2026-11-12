import type { QuotationRequestDraft, QuotationSubmissionResult } from "./types";

export async function submitQuotation(request: QuotationRequestDraft): Promise<QuotationSubmissionResult> {
  if (process.env.NODE_ENV !== "development") {
    return {
      ok: false,
      message: "Hệ thống tiếp nhận báo giá trực tuyến chưa được kết nối. Thông tin của bạn chưa được gửi đi.",
    };
  }

  await new Promise((resolve) => window.setTimeout(resolve, 650));

  if (process.env.NEXT_PUBLIC_QUOTATION_DEMO_RESULT === "error") {
    return { ok: false, message: "Không thể hoàn tất yêu cầu demo. Vui lòng thử lại." };
  }

  const demoSuffix = crypto.randomUUID().slice(0, 8).toUpperCase();
  return {
    ok: true,
    receipt: {
      referenceId: `DEMO-${demoSuffix}`,
      submittedAt: new Date().toISOString(),
      request,
    },
  };
}
