"use client";

import { Toaster } from "sonner";

import { useCmsPreferences } from "@/cms/context/cms-preferences";

import styles from "./notifications.module.css";

export function CmsNotifications() {
  const { direction, theme } = useCmsPreferences();

  return (
    <Toaster
      className={styles.root}
      closeButton
      containerAriaLabel="Thông báo"
      dir={direction}
      duration={4_000}
      position="top-right"
      richColors
      theme={theme}
      toastOptions={{ closeButtonAriaLabel: "Đóng thông báo" }}
    />
  );
}
