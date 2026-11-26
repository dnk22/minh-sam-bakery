import { X } from "lucide-react";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsToolbarSearchButton } from "./cms-toolbar-search-button";
import type { ReactNode } from "react";

import styles from "./cms-toolbar.module.css";

type CmsToolbarProps = {
  label: string;
  onSearch: () => void;
  searchDisabled?: boolean;
  onClear?: () => void;
  search: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  trailing?: ReactNode;
  feedback?: ReactNode;
};

export function CmsToolbar({ label, search, filters, actions, trailing, feedback, onSearch, searchDisabled, onClear }: CmsToolbarProps) {
  return (
    <form aria-label={label} className={styles.toolbar} onSubmit={event => { event.preventDefault(); if (!searchDisabled) onSearch(); }}>
      <div className={styles.row}>
        <div className={styles.controls}>
          <div className={styles.search}>{search}</div>
          {filters}
          <CmsToolbarSearchButton disabled={searchDisabled} />
          {onClear ? <CmsButton type="button" className={styles.clear} variant="ghost" aria-label="Xóa tất cả bộ lọc" title="Xóa tất cả bộ lọc" onClick={onClear}><X aria-hidden="true" size={16} /><span className={styles.submitLabel}>Xóa tất cả</span></CmsButton> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
        {trailing ? <div className={styles.trailing}>{trailing}</div> : null}
      </div>
      {feedback ? <div className={styles.feedback}>{feedback}</div> : null}
    </form>
  );
}
