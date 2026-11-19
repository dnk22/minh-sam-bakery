"use client";

import { LoaderCircle, RefreshCw, ShieldX } from "lucide-react";

import { CmsButton } from "@/cms/components/ui/button";
import { useSessionRefresh } from "@/cms/features/auth/hooks/use-session-refresh";

export function CmsSessionRefresh({ locked = false, redirectTo }: { locked?: boolean; redirectTo: string }) {
  const { retry, state } = useSessionRefresh({ locked, redirectTo });
  const pending = state === "pending";
  const forbidden = state === "forbidden";
  const rateLimited = state === "rate_limited";

  return (
    <main className="cms-auth-layout">
      <section className="cms-session-card" role="status">
        {pending ? <LoaderCircle aria-hidden="true" className="cms-spin" size={28} /> : <ShieldX aria-hidden="true" size={28} />}
        <h1>{pending ? "Đang khôi phục phiên đăng nhập" : forbidden ? "Không có quyền truy cập" : rateLimited ? "Vui lòng thử lại sau" : "Chưa thể khôi phục phiên"}</h1>
        <p>{pending ? "Vui lòng chờ trong giây lát." : forbidden ? "Phiên đăng nhập hợp lệ nhưng tài khoản không được phép truy cập tài nguyên này." : rateLimited ? "Có quá nhiều yêu cầu khôi phục phiên. Hệ thống chưa xóa thông tin đăng nhập của bạn." : "Hệ thống xác thực đang gián đoạn. Phiên của bạn chưa bị xóa."}</p>
        {state === "unavailable" || rateLimited ? <CmsButton onClick={retry}><RefreshCw aria-hidden="true" size={16} />Thử lại</CmsButton> : null}
      </section>
    </main>
  );
}
