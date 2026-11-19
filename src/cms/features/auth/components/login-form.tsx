"use client";

import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { useState } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { useLogin } from "@/cms/features/auth/hooks/use-login";

export function CmsLoginForm({ redirectTo }: { redirectTo: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const { email, errors, isSubmitting, password, rememberLogin, setRememberLogin, submit } = useLogin(redirectTo);

  return (
    <form className="cms-login-form" noValidate onSubmit={submit}>
      <div className="cms-form-field">
        <label htmlFor="cms-email">Email</label>
        <input
          {...email}
          aria-describedby={errors.email ? "cms-email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="username"
          disabled={isSubmitting}
          id="cms-email"
          inputMode="email"
          placeholder="name@example.com"
          type="email"
        />
        {errors.email?.message ? <p className="cms-field-error" id="cms-email-error">{errors.email.message}</p> : null}
      </div>

      <div className="cms-form-field">
        <label htmlFor="cms-password">Mật khẩu</label>
        <div className="cms-password-input">
          <input
            {...password}
            aria-describedby={errors.password ? "cms-password-error" : undefined}
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            disabled={isSubmitting}
            id="cms-password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            disabled={isSubmitting}
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? <Eye aria-hidden="true" size={17} /> : <EyeOff aria-hidden="true" size={17} />}
          </button>
        </div>
        {errors.password?.message ? <p className="cms-field-error" id="cms-password-error">{errors.password.message}</p> : null}
      </div>

      <label className="cms-login-remember">
        <input
          checked={rememberLogin}
          disabled={isSubmitting}
          onChange={(event) => setRememberLogin(event.target.checked)}
          type="checkbox"
        />
        <span>Ghi nhớ email và mật khẩu</span>
      </label>

      {errors.root?.server?.message ? <p aria-live="assertive" className="cms-login-alert cms-login-alert--error" role="alert">{errors.root.server.message}</p> : null}
      <CmsButton className="cms-login-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? <LoaderCircle aria-hidden="true" className="cms-spin" size={17} /> : <LogIn aria-hidden="true" size={17} />}
        {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
      </CmsButton>
    </form>
  );
}
