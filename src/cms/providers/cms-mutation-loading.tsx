"use client";

import { useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { pageLoading } from "@/shared/stores/page-loading.store";

export function CmsMutationLoading() {
  const busy = useIsMutating({ predicate: mutation => mutation.meta?.pageLoading === true }) > 0;
  useEffect(() => {
    if (busy) return pageLoading.begin();
  }, [busy]);
  return null;
}
