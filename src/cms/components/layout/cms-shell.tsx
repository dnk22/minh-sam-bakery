"use client";

import type { ReactNode } from "react";

import { CmsHeader } from "@/cms/components/layout/cms-header";
import { CmsSidebar } from "@/cms/components/layout/cms-sidebar";

export function CmsShell({ children }: { children: ReactNode }) {
  return (
    <div className="cms-shell">
      <a className="cms-skip-link" href="#cms-main-content">Bỏ qua đến nội dung chính</a>
      <CmsSidebar />
      <div className="cms-inset">
        <CmsHeader />
        {children}
      </div>
    </div>
  );
}
