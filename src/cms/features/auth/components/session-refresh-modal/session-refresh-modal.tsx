"use client";

import type { CSSProperties } from "react";
import { useStore } from "zustand";
import { PageLoading } from "@/shared/components/page-loading/page-loading";
import { usePageLoading } from "@/shared/hooks/use-page-loading";
import { MAX_REFRESH_ATTEMPTS } from "../../session/refresh-retry-policy";
import { sessionRefreshStore } from "../../stores/session-refresh.store";

const themeStyle = {
  "--page-loading-background": "var(--cms-card)",
  "--page-loading-foreground": "var(--cms-card-foreground)",
  "--page-loading-border": "var(--cms-border)",
  "--page-loading-radius": "var(--cms-radius)",
  "--page-loading-accent": "var(--cms-primary)",
} as CSSProperties;

/** One blocking dialog; session recovery always takes precedence. */
export function SessionRefreshModal() {
  const { status, attempt } = useStore(sessionRefreshStore);
  const loading = usePageLoading();
  const recovering = status !== "idle";
  const failed = status === "failed";

  return (
    <PageLoading
      open={recovering || loading}
      className="cms-portal"
      style={themeStyle}
      label={recovering ? failed ? "Chưa thể khôi phục phiên đăng nhập" : "Đang khôi phục phiên đăng nhập" : undefined}
      description={recovering ? failed ? "Đang chuyển đến trang đăng nhập…" : "Hệ thống đang tự động gia hạn phiên đăng nhập của bạn." : undefined}
    >
      {status === "refreshing" ? <p>{attempt ? `Lần thử ${attempt}/${MAX_REFRESH_ATTEMPTS}` : "Đang đồng bộ phiên đăng nhập…"}</p> : null}
    </PageLoading>
  );
}
