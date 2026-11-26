"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useState, type ReactNode } from "react";

export function CmsQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 10 * 60_000,
            retry: (count, error) => count < 1 && !(error instanceof CmsApiError && (error.status === 401 || error.status === 423 || error.code === "SESSION_RECOVERY_FAILED")),
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
