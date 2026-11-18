import type { LucideIcon } from "lucide-react";

import { CmsMain } from "@/cms/components/layout/cms-main";

export function ModulePlaceholder({ description, icon: Icon, title }: { description: string; icon: LucideIcon; title: string }) {
  return (
    <CmsMain>
      <div className="cms-page-heading"><h1>{title}</h1><p>{description}</p></div>
      <section className="cms-placeholder">
        <div>
          <span className="cms-placeholder-icon"><Icon aria-hidden="true" size={22} /></span>
          <h2>Module sẽ được phát triển ở phase tiếp theo</h2>
          <p>Phase 1 chỉ cung cấp application shell và điểm gắn nội dung; chưa có dữ liệu giả, thao tác nghiệp vụ hoặc kết nối backend.</p>
        </div>
      </section>
    </CmsMain>
  );
}
