"use client";

import { useSessionRefresh } from "@/cms/features/auth/hooks/use-session-refresh";

export function CmsSessionRefresh({ locked = false, redirectTo }: { locked?: boolean; redirectTo: string }) {
  useSessionRefresh({ locked, redirectTo });

  return <main aria-busy="true" className="cms-auth-layout" />;
}
