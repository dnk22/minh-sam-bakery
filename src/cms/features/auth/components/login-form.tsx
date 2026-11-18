"use client";

import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { validateLoginInput } from "@/cms/features/auth/lib/validation";

type FieldErrors = { email?: string; password?: string };

export function CmsLoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const validation = validateLoginInput({ email, password });
    if (!validation.ok) {
      setFieldErrors(validation.fields);
      setFormError(null);
      return;
    }

    setPending(true);
    setFieldErrors({});
    setFormError(null);
    try {
      const response = await fetch("/api/cms/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const payload = await response.json().catch(() => null) as {
        ok?: boolean;
        error?: { message?: string; fields?: FieldErrors };
      } | null;
      if (!response.ok || !payload?.ok) {
        if (payload?.error?.fields) setFieldErrors(payload.error.fields);
        setFormError(payload?.error?.message || "Không thể đăng nhập lúc này. Vui lòng thử lại.");
        return;
      }
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setFormError("Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="cms-login-form" noValidate onSubmit={submit}>
      <div className="cms-form-field">
        <label htmlFor="cms-email">Email</label>
        <input
          aria-describedby={fieldErrors.email ? "cms-email-error" : undefined}
          aria-invalid={Boolean(fieldErrors.email)}
          autoComplete="username"
          disabled={pending}
          id="cms-email"
          inputMode="email"
          onChange={(event) => { setEmail(event.target.value); if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: undefined })); }}
          placeholder="name@example.com"
          type="email"
          value={email}
        />
        {fieldErrors.email ? <p className="cms-field-error" id="cms-email-error">{fieldErrors.email}</p> : null}
      </div>

      <div className="cms-form-field">
        <label htmlFor="cms-password">Mật khẩu</label>
        <div className="cms-password-input">
          <input
            aria-describedby={fieldErrors.password ? "cms-password-error" : undefined}
            aria-invalid={Boolean(fieldErrors.password)}
            autoComplete="current-password"
            disabled={pending}
            id="cms-password"
            onChange={(event) => { setPassword(event.target.value); if (fieldErrors.password) setFieldErrors((current) => ({ ...current, password: undefined })); }}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            disabled={pending}
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? <Eye aria-hidden="true" size={17} /> : <EyeOff aria-hidden="true" size={17} />}
          </button>
        </div>
        {fieldErrors.password ? <p className="cms-field-error" id="cms-password-error">{fieldErrors.password}</p> : null}
      </div>

      {formError ? <p aria-live="assertive" className="cms-login-alert cms-login-alert--error" role="alert">{formError}</p> : null}
      <CmsButton className="cms-login-submit" disabled={pending} type="submit">
        {pending ? <LoaderCircle aria-hidden="true" className="cms-spin" size={17} /> : <LogIn aria-hidden="true" size={17} />}
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </CmsButton>
    </form>
  );
}
