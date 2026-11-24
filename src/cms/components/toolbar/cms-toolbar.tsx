import type { ReactNode } from "react";

import styles from "./cms-toolbar.module.css";

type CmsToolbarProps = {
  label: string;
  search: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  trailing?: ReactNode;
  feedback?: ReactNode;
};

export function CmsToolbar({ label, search, filters, actions, trailing, feedback }: CmsToolbarProps) {
  return (
    <section aria-label={label} className={styles.toolbar}>
      <div className={styles.row}>
        <div className={styles.controls}>
          <div className={styles.search}>{search}</div>
          {filters}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
        {trailing ? <div className={styles.trailing}>{trailing}</div> : null}
      </div>
      {feedback ? <div className={styles.feedback}>{feedback}</div> : null}
    </section>
  );
}
