"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./page-loading.module.css";

type PageLoadingProps = {
  open: boolean;
  label?: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PageLoading({ open, label = "Đang tải...", description, children, className, style }: PageLoadingProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={[styles.dialog, className].filter(Boolean).join(" ")}
      style={style}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={event => event.preventDefault()}
    >
      <div className={styles.content} role="status" aria-live="polite">
        <LoaderCircle aria-hidden="true" className={styles.spinner} size={32} />
        <h2 id={titleId}>{label}</h2>
        {description ? <p id={descriptionId}>{description}</p> : null}
        {children}
      </div>
    </dialog>
  );
}
