"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

export function useCmsIsMobile() {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(MOBILE_QUERY);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
