"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { browserRefresh, redirectAfterRecovery, refreshVersion } from "../session/browser-refresh";
import { sessionScope } from "../session/refresh-coordinator";

export function useSessionRefresh({ locked, redirectTo }: { locked: boolean; redirectTo: string }) {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const scope = sessionScope();
    // StrictMode/remounts share one flight. Unmounting must not cancel rotation.
    void browserRefresh.refresh(refreshVersion(), true).then(result => {
      if (!active) return;
      if (scope !== sessionScope()) {
        redirectAfterRecovery({ ok: false, reason: "session-changed" }, redirectTo);
        return;
      }
      if (result.ok) {
        router.replace(redirectTo);
        router.refresh();
      } else {
        redirectAfterRecovery(result, redirectTo, locked);
      }
    });
    return () => { active = false; };
  }, [locked, redirectTo, router]);
}
