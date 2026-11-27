"use client";

import { withPageLoading } from "@/shared/stores/page-loading.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useFormValidationFeedback } from "@/cms/hooks/use-form-validation-feedback";
import { authApi, AuthClientError } from "@/cms/features/auth/api/auth.client";
import { migrateAndReadRememberedEmail, persistRememberedEmail } from "@/cms/features/auth/lib/remembered-email";
import {
  defaultLoginValues,
  loginSchema,
  type LoginCredentials,
  type LoginFormValues,
} from "@/cms/features/auth/schemas/login.schema";

export function useLogin(redirectTo: string) {
  const router = useRouter();
  const [rememberEmail, setRememberEmail] = useState(true);
  const form = useForm<LoginFormValues, unknown, LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const onInvalid = useFormValidationFeedback<LoginFormValues>({ formId: "cms-login-form" });

  useEffect(() => {
    let rememberedEmail: string | null = null;
    try { rememberedEmail = migrateAndReadRememberedEmail(window.localStorage); } catch { return; }
    if (!rememberedEmail || form.getFieldState("email").isDirty || form.getValues("email")) return;
    form.setValue("email", rememberedEmail, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [form]);

  const onValid = async (credentials: LoginCredentials) => {
    form.clearErrors("root.server");
    try {
      await withPageLoading(() => authApi.login(credentials));
      try { persistRememberedEmail(window.localStorage, credentials.email, rememberEmail); } catch { /* Login must succeed even if localStorage cannot be accessed. */ }
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      if (error instanceof AuthClientError) {
        if (error.fields?.email) form.setError("email", { type: "server", message: error.fields.email }, { shouldFocus: true });
        if (error.fields?.password) form.setError("password", { type: "server", message: error.fields.password }, { shouldFocus: !error.fields.email });
        form.setError("root.server", { type: error.code, message: error.message });
      } else {
        form.setError("root.server", {
          type: "network",
          message: "Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại.",
        });
      }
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (form.formState.isSubmitting) {
      event.preventDefault();
      return;
    }
    void form.handleSubmit(onValid, onInvalid)(event);
  };

  const clearServerError = () => form.clearErrors("root.server");
  return {
    email: form.register("email", { onChange: clearServerError }),
    password: form.register("password", { onChange: clearServerError }),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    rememberEmail,
    setRememberEmail,
    submit,
  };
}
