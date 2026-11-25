import Image from "next/image";

import styles from "./login-screen.module.css";

export function LoginBrandPanel() {
  return (
    <aside className={styles.brand} aria-label="Minh Sâm Bakery">
      <div className={styles.brandContent}>
        <Image
          alt=""
          className={styles.brandLogo}
          height={96}
          width={96}
          priority
          src="/images/minh-sam-logo.webp"
        />
        <p className={styles.brandName}>Minh Sâm Bakery</p>
        <p className={styles.tagline}>
          <span />
          Bánh ngon · Lan tỏa yêu thương
          <span />
        </p>
        <p className={styles.welcome}>Chào mừng trở lại!</p>
        <p className={styles.brandDescription}>
          Không gian quản trị cửa hàng Minh Sâm Bakery.
        </p>
      </div>
      <div className={styles.photography} aria-hidden="true">
        <Image
          alt=""
          src="/images/auth/login-background.webp"
          loading="eager"
          fill
          sizes="(min-width: 1024px) 55vw, (min-width: 768px) 100vw, 1px"
          className={styles.photo}
          unoptimized
        />
      </div>
    </aside>
  );
}
