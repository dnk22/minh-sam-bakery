"use client";

import { useEffect, useRef, useTransition } from "react";

/** Track explicit list updates until React finishes or interrupts the transition. */
export function useListNavigation() {
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);

  useEffect(() => {
    if (!pending) locked.current = false;
  }, [pending]);

  function run(action: () => void) {
    if (pending || locked.current) return;
    locked.current = true;
    startTransition(action);
  }

  return { pending, run };
}
