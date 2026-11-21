"use client";

import type { ReactNode } from "react";

import { CmsHeader } from "@/cms/components/layout/cms-header";
import { CmsSidebar } from "@/cms/components/layout/cms-sidebar";
import { CmsNotifications } from "@/cms/components/notifications/notifications";
import type { CmsProfileUser } from "@/cms/features/auth/types";
import { CmsSessionUserProvider } from "@/cms/context/cms-session-user";

export function CmsShell({ children, user }: { children: ReactNode; user: CmsProfileUser }) {
  return (
    <CmsSessionUserProvider user={user}>
      <div className="cms-shell">
        <a className="cms-skip-link" href="#cms-main-content">Bỏ qua đến nội dung chính</a>
        <CmsSidebar />
        <div className="cms-inset">
          <CmsHeader user={user} />
          <div className="cms-content">{children}</div>
        </div>
      </div>
      <CmsNotifications />
    </CmsSessionUserProvider>
  );
}
