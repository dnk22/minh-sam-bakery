"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCmsConfirm } from "@/cms/context/cms-confirm";

const DEFAULT_MESSAGE = "Bỏ các thay đổi chưa lưu?";

export function useUnsavedChangesWarning(active: boolean, message = DEFAULT_MESSAGE) {
  const askConfirm = useCmsConfirm();
  const router = useRouter();
  const waiting = useRef(false);
  useEffect(() => {
    if (!active) return;
    let disposed = false;
    const beforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const linkNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement) || target.target === "_blank" || target.hasAttribute("download")) return;
      const next = new URL(target.href, window.location.href);
      if (next.href === window.location.href || next.origin !== window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      if (waiting.current) return;
      waiting.current = true;
      void askConfirm({ title: "Bỏ thay đổi?", message, confirmLabel: "Bỏ thay đổi", destructive: true }).then((accepted) => {
        if (accepted && !disposed) router.push(next.pathname + next.search + next.hash);
      }).finally(() => { waiting.current = false; });
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", linkNavigation, true);
    return () => {
      disposed = true;
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", linkNavigation, true);
    };
  }, [active, message, askConfirm, router]);
}
