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
          <p>Chức năng này đang được hoàn thiện và sẽ sớm sẵn sàng.</p>
        </div>
      </section>
    </CmsMain>
  );
}
