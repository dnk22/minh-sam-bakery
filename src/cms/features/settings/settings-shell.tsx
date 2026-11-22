import type { ReactNode } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";

export function SettingsShell({ children }: { children: ReactNode }) {
  return (
    <CmsMain>
      <div className="cms-page-heading">
        <h1>Cài đặt</h1>
        <p>Quản lý giao diện và bố cục hiển thị riêng cho khu vực CMS.</p>
      </div>
      <div className="cms-settings-divider" />
      <div className="cms-settings-content">{children}</div>
    </CmsMain>
  );
}
