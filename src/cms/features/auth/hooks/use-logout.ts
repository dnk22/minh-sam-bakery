"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { authApi, AuthClientError } from "@/cms/features/auth/api/auth.client";

export function useLogout() {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await authApi.logout();
      if (result.localSessionCleared) {
        queryClient.clear();
        window.location.replace(result.revoked ? "/cms/login?notice=logout" : "/cms/login?notice=logout-local");
        return;
      }
      setError("Không thể đăng xuất lúc này. Vui lòng thử lại.");
    } catch (caught) {
      if (caught instanceof AuthClientError && caught.localSessionCleared) {
        queryClient.clear();
        window.location.replace(caught.revoked ? "/cms/login?notice=logout" : "/cms/login?notice=logout-local");
        return;
      }
      setError(caught instanceof AuthClientError ? caught.message : "Không thể kết nối tới máy chủ để đăng xuất.");
    } finally {
      setPending(false);
    }
  }, [pending, queryClient]);

  return { error, logout, pending };
}
