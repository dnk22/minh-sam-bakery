import Image from "next/image";

import { CmsLoginForm } from "../login-form/login-form";
import { LoginAlert } from "./login-alert";
import styles from "./login-screen.module.css";

export function LoginCard({ message, notice, redirectTo }: {
  message?: string;
  notice?: string;
  redirectTo: string;
}) {
  return (
    <section className={styles.card} aria-labelledby="cms-login-title">
      <header className={styles.cardHeader}>
        <div className={styles.logoFrame}>
          <Image alt="Minh Sâm Bakery" height={72} width={72} src="/images/minh-sam-logo.webp" />
        </div>
        <h1 id="cms-login-title">Đăng nhập quản trị</h1>
        <p>Hệ thống quản lý Minh Sâm Bakery</p>
      </header>
      {notice ? <LoginAlert kind="success">{notice}</LoginAlert> : null}
      {message ? <LoginAlert kind="error">{message}</LoginAlert> : null}
      <CmsLoginForm redirectTo={redirectTo} />
      <footer className={styles.footer}>© Minh Sâm Bakery. Tất cả quyền được bảo lưu.</footer>
    </section>
  );
}
