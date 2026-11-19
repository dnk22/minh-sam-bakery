"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { authApi, AuthClientError } from "@/cms/features/auth/api/auth.client";
import { decideRefreshFailure } from "@/cms/features/auth/lib/refresh-policy";

export type RefreshState = "pending" | "unavailable" | "forbidden" | "rate_limited";

export function useSessionRefresh({ locked, redirectTo }: { locked: boolean; redirectTo: string }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RefreshState>("pending");

  useEffect(() => {
    const controller = new AbortController();
    const performRefresh = async () => {
      try {
        // Reaching this route means the server freshness policy requested rotation.
        // A successful /me check is insufficient because the token may have <10s left.
        await authApi.refresh(controller.signal);
        router.replace(redirectTo);
        router.refresh();
      } catch (error) {
        if (controller.signal.aborted) return;
        const code = error instanceof AuthClientError ? error.code : "NETWORK";
        const decision = decideRefreshFailure(code, locked);
        if (decision.action === "login") {
          const params = new URLSearchParams({
            redirect: redirectTo,
            error: decision.error,
          });
          router.replace(`/cms/login?${params.toString()}`);
          router.refresh();
          return;
        }
        setState(decision.state);
      }
    };

    const coordinateRefresh = async () => {
      if (navigator.locks) {
        await navigator.locks.request("minhsam-cms-session-refresh", performRefresh);
      } else {
        await performRefresh();
      }
    };
    void coordinateRefresh();
    return () => controller.abort();
  }, [attempt, locked, redirectTo, router]);

  const retry = useCallback(() => {
    setState("pending");
    setAttempt((value) => value + 1);
  }, []);

  return { retry, state };
}
