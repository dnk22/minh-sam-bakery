import { CakeSlice, Croissant, Wheat } from "lucide-react";

import { LoginBrandPanel } from "./login-brand-panel";
import { LoginCard } from "./login-card";
import styles from "./login-screen.module.css";

export function CmsLoginScreen({ message, notice, redirectTo }: {
  message?: string;
  notice?: string;
  redirectTo: string;
}) {
  return (
    <main className={styles.screen}>
      <div className={styles.layout}>
        <div aria-hidden="true" className={styles.decorations}>
          <Croissant className={styles.croissant} strokeWidth={1} />
          <CakeSlice className={styles.cake} strokeWidth={1} />
          <Wheat className={styles.wheat} strokeWidth={1} />
        </div>
        <LoginBrandPanel />
        <div className={styles.authArea}>
          <LoginCard message={message} notice={notice} redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
