"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useForm } from "react-hook-form";

import { authApi, AuthClientError } from "@/cms/features/auth/api/auth.client";
import {
  defaultLoginValues,
  loginSchema,
  type LoginCredentials,
  type LoginFormValues,
} from "@/cms/features/auth/schemas/login.schema";

export function useLogin(redirectTo: string) {
  const router = useRouter();
  const form = useForm<LoginFormValues, unknown, LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onValid = async (credentials: LoginCredentials) => {
    form.clearErrors("root.server");
    try {
      await authApi.login(credentials);
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
    submit,
  };
}
