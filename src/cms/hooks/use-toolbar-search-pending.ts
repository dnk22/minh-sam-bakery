"use client";

import { useEffect, useRef, useState, useTransition } from "react";

/** Track only explicit toolbar submissions, through URL transition and list fetch. */
export function useToolbarSearchPending(fetching: boolean) {
  const [active, setActive] = useState(false);
  const [transitioning, startTransition] = useTransition();
  const locked = useRef(false);

  useEffect(() => {
    if (!active || transitioning || fetching) return;
    // Allow the new query observer to publish its fetching snapshot first.
    const timer = window.setTimeout(() => {
      locked.current = false;
      setActive(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [active, transitioning, fetching]);

  function run(action: () => void) {
    if (locked.current) return;
    locked.current = true;
    setActive(true);
    startTransition(action);
  }

  return { pending: active, run };
}
