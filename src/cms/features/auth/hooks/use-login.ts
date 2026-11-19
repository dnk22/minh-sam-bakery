"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { authApi, AuthClientError } from "@/cms/features/auth/api/auth.client";
import {
  defaultLoginValues,
  loginSchema,
  type LoginCredentials,
  type LoginFormValues,
} from "@/cms/features/auth/schemas/login.schema";

const REMEMBERED_LOGIN_KEY = "minhsam-cms-remembered-login";

export function useLogin(redirectTo: string) {
  const router = useRouter();
  const [rememberLogin, setRememberLogin] = useState(false);
  const form = useForm<LoginFormValues, unknown, LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- Saved credentials are intentionally restored after the client component mounts. */
    try {
      const stored = localStorage.getItem(REMEMBERED_LOGIN_KEY);
      if (!stored) return;
      const value = JSON.parse(stored) as Partial<Record<"email" | "password", unknown>>;
      if (typeof value.email !== "string" || typeof value.password !== "string") return;
      form.reset({ email: value.email, password: value.password });
      setRememberLogin(true);
    } catch {
      localStorage.removeItem(REMEMBERED_LOGIN_KEY);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [form]);

  const onValid = async (credentials: LoginCredentials) => {
    form.clearErrors("root.server");
    try {
      await authApi.login(credentials);
      if (rememberLogin) {
        localStorage.setItem(REMEMBERED_LOGIN_KEY, JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }));
      } else {
        localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      if (error instanceof AuthClientError) {
        if (error.fields?.email) form.setError("email", { type: "server", message: error.fields.email });
        if (error.fields?.password) form.setError("password", { type: "server", message: error.fields.password });
        form.setError("root.server", { type: error.code, message: error.message });
      } else {
        form.setError("root.server", {
          type: "network",
          message: "Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại.",
        });
      }
    }
  };

  const setRememberLoginPreference = (value: boolean) => {
    setRememberLogin(value);
    if (!value) localStorage.removeItem(REMEMBERED_LOGIN_KEY);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (form.formState.isSubmitting) {
      event.preventDefault();
      return;
    }
    void form.handleSubmit(onValid)(event);
  };

  const clearServerError = () => form.clearErrors("root.server");
  return {
    email: form.register("email", { onChange: clearServerError }),
    password: form.register("password", { onChange: clearServerError }),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    rememberLogin,
    setRememberLogin: setRememberLoginPreference,
    submit,
  };
}
