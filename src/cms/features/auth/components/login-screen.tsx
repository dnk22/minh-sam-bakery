import Image from "next/image";

import { CmsLoginForm } from "@/cms/features/auth/components/login-form";

export function CmsLoginScreen({ message, notice, redirectTo }: { message?: string; notice?: string; redirectTo: string }) {
  return (
    <main className="cms-auth-layout">
      <div className="cms-auth-brand">
        <Image alt="Minh Sâm Bakery" height={42} priority src="/images/minh-sam-logo.webp" width={42} />
        <div><strong>Minh Sâm Bakery</strong><span>CMS Workspace</span></div>
      </div>
      <section className="cms-login-card">
        <header>
          <h1>Đăng nhập</h1>
          <p>Nhập email và mật khẩu được cấp để truy cập hệ thống quản trị.</p>
        </header>
        {notice ? <p aria-live="polite" className="cms-login-alert cms-login-alert--success">{notice}</p> : null}
        {message ? <p aria-live="assertive" className="cms-login-alert cms-login-alert--error" role="alert">{message}</p> : null}
        <CmsLoginForm redirectTo={redirectTo} />
      </section>
      <p className="cms-auth-caption">Khu vực dành cho nhân sự được ủy quyền của Minh Sâm Bakery.</p>
    </main>
  );
}
