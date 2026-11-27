"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { pageLoading } from "@/shared/stores/page-loading.store";

/** Observe the mutation lifecycle, including asynchronous onSuccess/onSettled callbacks. */
export function CmsMutationLoading() {
  const client = useQueryClient();

  useEffect(() => {
    const cache = client.getMutationCache();
    let release: (() => void) | undefined;
    const synchronize = () => {
      const busy = cache.getAll().some(mutation =>
        mutation.meta?.pageLoading === true && mutation.state.status === "pending",
      );
      if (busy && !release) release = pageLoading.begin();
      if (!busy && release) {
        release();
        release = undefined;
      }
    };

    const unsubscribe = cache.subscribe(synchronize);
    synchronize();
    return () => {
      unsubscribe();
      release?.();
    };
  }, [client]);

  return null;
}
