"use client";

import { LoaderCircle, RefreshCw, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CmsButton } from "@/cms/components/ui/button";

type RefreshState = "pending" | "unavailable" | "forbidden";

export function CmsSessionRefresh({ locked = false, redirectTo }: { locked?: boolean; redirectTo: string }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RefreshState>("pending");

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const performRefresh = async () => {
          const currentSession = await fetch("/api/cms/auth/me", { cache: "no-store", signal: controller.signal });
          if (currentSession.ok) {
            router.replace(redirectTo);
            router.refresh();
            return;
          }
          if (currentSession.status === 403) {
            setState("forbidden");
            return;
          }
          if (currentSession.status >= 500) {
            setState("unavailable");
            return;
          }

          const response = await fetch("/api/cms/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
            signal: controller.signal,
          });
          const payload = await response.json().catch(() => null) as { ok?: boolean; error?: { code?: string } } | null;
          if (response.ok && payload?.ok) {
            router.replace(redirectTo);
            router.refresh();
            return;
          }
          const code = payload?.error?.code;
          if (code === "FORBIDDEN") {
            setState("forbidden");
            return;
          }
          if (code === "UNAVAILABLE" || code === "TIMEOUT" || code === "INVALID_RESPONSE") {
            setState("unavailable");
            return;
          }
          const params = new URLSearchParams({ redirect: redirectTo, error: locked || code === "LOCKED" ? "locked" : "session-expired" });
          router.replace(`/cms/login?${params.toString()}`);
          router.refresh();
        };

        if (navigator.locks) {
          await navigator.locks.request("minhsam-cms-session-refresh", performRefresh);
        } else {
          await performRefresh();
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setState("unavailable");
      }
    };
    void refresh();
    return () => controller.abort();
  }, [attempt, locked, redirectTo, router]);

  return (
    <main className="cms-auth-layout">
      <section className="cms-session-card" role="status">
        {state === "pending" ? <LoaderCircle aria-hidden="true" className="cms-spin" size={28} /> : <ShieldX aria-hidden="true" size={28} />}
        <h1>{state === "pending" ? "Đang khôi phục phiên đăng nhập" : state === "forbidden" ? "Không có quyền truy cập" : "Chưa thể khôi phục phiên"}</h1>
        <p>{state === "pending" ? "Vui lòng chờ trong giây lát." : state === "forbidden" ? "Phiên đăng nhập hợp lệ nhưng tài khoản không được phép truy cập tài nguyên này." : "Hệ thống xác thực đang gián đoạn. Phiên của bạn chưa bị xóa."}</p>
        {state === "unavailable" ? <CmsButton onClick={() => { setState("pending"); setAttempt((value) => value + 1); }}><RefreshCw aria-hidden="true" size={16} />Thử lại</CmsButton> : null}
      </section>
    </main>
  );
}
