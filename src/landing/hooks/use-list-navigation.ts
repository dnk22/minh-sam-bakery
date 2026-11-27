"use client";

import { useTransition } from "react";

/** React owns the lifetime of the server navigation, including interruption. */
export function useListNavigation() {
  const [pending, startTransition] = useTransition();

  function run(action: () => void) {
    if (!pending) startTransition(action);
  }

  return { pending, run };
}
