"use client";

import { useToolbarSearchPending } from "@/cms/hooks/use-toolbar-search-pending";
import { ToolbarPendingContext } from "./toolbar-pending-context";
import { X } from "lucide-react";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsToolbarSearchButton } from "./cms-toolbar-search-button";
import type { ReactNode } from "react";

import styles from "./cms-toolbar.module.css";

type CmsToolbarProps = {
  label: string;
  onSearch: () => void;
  searchDisabled?: boolean;
  fetching?: boolean;
  onClear?: () => void;
  search: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  trailing?: ReactNode;
  feedback?: ReactNode;
};

export function CmsToolbar({ label, search, filters, actions, trailing, feedback, onSearch, searchDisabled, onClear, fetching = false }: CmsToolbarProps) {
  const state = useToolbarSearchPending(fetching);
  return (
    <ToolbarPendingContext value={state}>
    <form aria-label={label} className={styles.toolbar} aria-busy={state.pending} onSubmit={event => { event.preventDefault(); if (!searchDisabled && !state.pending) state.run(onSearch); }}>
      <div className={styles.row}>
        <fieldset disabled={state.pending} className={styles.controls}>
          <div className={styles.search}>{search}</div>
          {filters}
          <CmsToolbarSearchButton disabled={searchDisabled || state.pending} pending={state.pending} />
          {onClear ? <CmsButton type="button" className={styles.clear} variant="ghost" aria-label="Xóa tất cả bộ lọc" title="Xóa tất cả bộ lọc" onClick={() => state.run(onClear)}><X aria-hidden="true" size={16} /><span className={styles.submitLabel}>Xóa tất cả</span></CmsButton> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </fieldset>
        {trailing ? <fieldset disabled={state.pending} className={styles.trailing}>{trailing}</fieldset> : null}
      </div>
      {feedback ? <div className={styles.feedback}>{feedback}</div> : null}
    </form>
    </ToolbarPendingContext>
  );
}
