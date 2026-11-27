"use client";

import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { pageLoading } from "../stores/page-loading.store";

export function usePageLoading(delayMs = 150) {
  const busy = useStore(pageLoading.store, state => state.activeCount > 0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setVisible(true), delayMs);
    return () => {
      window.clearTimeout(timer);
      setVisible(false);
    };
  }, [busy, delayMs]);

  return busy && visible;
}
