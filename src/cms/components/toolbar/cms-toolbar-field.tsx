import type { ReactNode } from "react";

import styles from "./cms-toolbar.module.css";

export function CmsToolbarField({ children, size = "default", label }: {
  children: ReactNode;
  size?: "compact" | "default" | "wide";
  label?: ReactNode;
}) {
  return (
    <div className={styles.field} data-toolbar-field={size}>
      {label}
      {children}
    </div>
  );
}
