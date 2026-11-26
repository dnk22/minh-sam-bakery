"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useStore } from "zustand";

import { MAX_REFRESH_ATTEMPTS } from "../../session/refresh-retry-policy";
import { sessionRefreshStore } from "../../stores/session-refresh.store";
import styles from "./session-refresh-modal.module.css";

export function SessionRefreshModal() {
  const { status, attempt } = useStore(sessionRefreshStore);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = status !== "idle";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [open]);

  return (
    <dialog
      aria-describedby="cms-refresh-description"
      aria-labelledby="cms-refresh-title"
      className={`cms-portal ${styles.dialog}`}
      onCancel={event => event.preventDefault()}
      ref={dialogRef}
    >
      <div className={styles.content} role="status" aria-live="polite">
        <LoaderCircle aria-hidden="true" className={styles.spinner} size={32} />
        <h2 id="cms-refresh-title">{status === "failed" ? "Chưa thể khôi phục phiên đăng nhập" : "Đang khôi phục phiên đăng nhập"}</h2>
        <p id="cms-refresh-description">{status === "failed" ? "Đang chuyển đến trang đăng nhập…" : "Hệ thống đang tự động gia hạn phiên đăng nhập của bạn."}</p>
        {status === "refreshing" ? <p className={styles.attempt}>{attempt ? `Lần thử ${attempt}/${MAX_REFRESH_ATTEMPTS}` : "Đang đồng bộ phiên đăng nhập…"}</p> : null}
      </div>
    </dialog>
  );
}
