"use client";

import { Toaster } from "sonner";
import styles from "./landing-notifications.module.css";

export function LandingNotifications() {
  return (
    <Toaster
      className={styles.root}
      containerAriaLabel="Thông báo"
      duration={2_000}
      position="top-center"
      richColors
    />
  );
}
