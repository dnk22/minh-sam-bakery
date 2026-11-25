"use client";

import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { useLogin } from "@/cms/features/auth/hooks/use-login";
import { LoginAlert } from "../login-screen/login-alert";

import styles from "./login-form.module.css";

export function CmsLoginForm({ redirectTo }: { redirectTo: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const { email, errors, isSubmitting, password, submit } = useLogin(redirectTo);

  return (
    <form className={styles.form} id="cms-login-form" noValidate onSubmit={submit} aria-busy={isSubmitting}>
      <CmsFormField className={styles.field} label="Email" htmlFor="cms-email" error={errors.email?.message}>
        <CmsInput
          {...email}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isSubmitting}
          id="cms-email"
          inputMode="email"
          placeholder="name@example.com"
          type="email"
          leadingIcon={<Mail size={19} />}
          containerClassName={styles.control}
        />
      </CmsFormField>
      <CmsFormField className={styles.field} label="Mật khẩu" htmlFor="cms-password" error={errors.password?.message}>
        <div className={styles.passwordControl}>
          <CmsInput
            {...password}
            autoComplete="current-password"
            disabled={isSubmitting}
            id="cms-password"
            placeholder="Nhập mật khẩu"
            type={showPassword ? "text" : "password"}
            leadingIcon={<LockKeyhole size={19} />}
            containerClassName={styles.control}
            className={styles.passwordInput}
          />
          <button className={styles.passwordToggle} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showPassword} disabled={isSubmitting} onClick={() => setShowPassword(visible => !visible)} type="button">
            {showPassword ? <Eye aria-hidden="true" size={19} /> : <EyeOff aria-hidden="true" size={19} />}
          </button>
        </div>
      </CmsFormField>
      {errors.root?.server?.message ? <LoginAlert kind="error">{errors.root.server.message}</LoginAlert> : null}
      <CmsButton className={styles.submit} disabled={isSubmitting} type="submit">
        {isSubmitting ? <LoaderCircle aria-hidden="true" className="cms-spin" size={19} /> : <LogIn aria-hidden="true" size={19} />}
        {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
      </CmsButton>
    </form>
  );
}
