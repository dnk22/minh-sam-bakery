"use client";

import { useFormik, type FormikErrors } from "formik";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import {
  initialLoginFormValues,
  type LoginFormValues,
  validateLoginForm,
  validateLoginInput,
} from "@/cms/features/auth/lib/validation";

type LoginFormStatus = { message: string } | undefined;

export function CmsLoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik<LoginFormValues>({
    initialValues: initialLoginFormValues,
    validate: validateLoginForm,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setErrors, setStatus }) => {
      setErrors({});
      setStatus(undefined);
      const validation = validateLoginInput(values);
      if (!validation.ok) {
        setErrors(validation.fields);
        return;
      }

      try {
        const response = await fetch("/api/cms/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        });
        const payload = await response.json().catch(() => null) as {
          ok?: boolean;
          error?: { message?: string; fields?: FormikErrors<LoginFormValues> };
        } | null;
        if (!response.ok || !payload?.ok) {
          if (payload?.error?.fields) setErrors(payload.error.fields);
          setStatus({ message: payload?.error?.message || "Không thể đăng nhập lúc này. Vui lòng thử lại." });
          return;
        }
        router.replace(redirectTo);
        router.refresh();
      } catch {
        setStatus({ message: "Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại." });
      }
    },
  });

  const status = formik.status as LoginFormStatus;
  const emailError = formik.touched.email ? formik.errors.email : undefined;
  const passwordError = formik.touched.password ? formik.errors.password : undefined;

  const changeField = (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    if (formik.errors[field]) formik.setFieldError(field, undefined);
    if (formik.status) formik.setStatus(undefined);
    formik.handleChange(event);
  };

  return (
    <form className="cms-login-form" noValidate onSubmit={formik.handleSubmit}>
      <div className="cms-form-field">
        <label htmlFor="cms-email">Email</label>
        <input
          aria-describedby={emailError ? "cms-email-error" : undefined}
          aria-invalid={Boolean(emailError)}
          autoComplete="username"
          disabled={formik.isSubmitting}
          id="cms-email"
          inputMode="email"
          name="email"
          onBlur={formik.handleBlur}
          onChange={changeField("email")}
          placeholder="name@example.com"
          type="email"
          value={formik.values.email}
        />
        {emailError ? <p className="cms-field-error" id="cms-email-error">{emailError}</p> : null}
      </div>

      <div className="cms-form-field">
        <label htmlFor="cms-password">Mật khẩu</label>
        <div className="cms-password-input">
          <input
            aria-describedby={passwordError ? "cms-password-error" : undefined}
            aria-invalid={Boolean(passwordError)}
            autoComplete="current-password"
            disabled={formik.isSubmitting}
            id="cms-password"
            name="password"
            onBlur={formik.handleBlur}
            onChange={changeField("password")}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
          />
          <button
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            disabled={formik.isSubmitting}
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? <Eye aria-hidden="true" size={17} /> : <EyeOff aria-hidden="true" size={17} />}
          </button>
        </div>
        {passwordError ? <p className="cms-field-error" id="cms-password-error">{passwordError}</p> : null}
      </div>

      {status?.message ? <p aria-live="assertive" className="cms-login-alert cms-login-alert--error" role="alert">{status.message}</p> : null}
      <CmsButton className="cms-login-submit" disabled={formik.isSubmitting} type="submit">
        {formik.isSubmitting ? <LoaderCircle aria-hidden="true" className="cms-spin" size={17} /> : <LogIn aria-hidden="true" size={17} />}
        {formik.isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
      </CmsButton>
    </form>
  );
}
