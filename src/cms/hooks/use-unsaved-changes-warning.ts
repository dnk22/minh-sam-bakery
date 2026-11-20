"use client";

import { useEffect } from "react";

const DEFAULT_MESSAGE = "Bỏ các thay đổi chưa lưu?";

export function useUnsavedChangesWarning(active: boolean, message = DEFAULT_MESSAGE) {
  useEffect(() => {
    if (!active) return;
    const beforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const linkNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement) || target.target === "_blank" || target.hasAttribute("download")) return;
      const next = new URL(target.href, window.location.href);
      if (next.href === window.location.href || next.origin !== window.location.origin) return;
      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", linkNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", linkNavigation, true);
    };
  }, [active, message]);
}
