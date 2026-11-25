import type { ReactNode } from "react";

import styles from "./login-screen.module.css";

export function LoginAlert({ kind, children }: { kind: "success" | "error"; children: ReactNode }) {
  return <p className={styles.alert} data-kind={kind} role={kind === "error" ? "alert" : "status"} aria-live={kind === "error" ? "assertive" : "polite"}>{children}</p>;
}
