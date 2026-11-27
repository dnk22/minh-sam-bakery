"use client";

import { toast } from "sonner";
import { pageLoading } from "../../shared/stores/page-loading.store.ts";

export type NotificationDriver = {
  success: (message: string, options: { id: string }) => unknown;
  error: (message: string, options: { id: string }) => unknown;
  info: (message: string, options: { id: string }) => unknown;
};

function notificationId(type: "success" | "error" | "info", message: string, key?: string) {
  return `cms:${key ?? `${type}:${message}`}`;
}

export function createNotifier(driver: NotificationDriver) {
  return {
    success(message: string, key?: string) {
      return driver.success(message, { id: notificationId("success", message, key) });
    },
    error(message: string, key?: string) {
      return driver.error(message, { id: notificationId("error", message, key) });
    },
    info(message: string, key?: string) {
      return driver.info(message, { id: notificationId("info", message, key) });
    },
  };
}

// A native modal occupies the browser top layer. Start toast timers only
// after the blocking action settles, so slow concurrent writes cannot hide them.
const deferred = new Map<string, () => unknown>();
let unsubscribe: (() => void) | undefined;

function deliver(type: "success" | "error" | "info", message: string, options: { id: string }) {
  const show = () => toast[type](message, options);
  if (pageLoading.store.getState().activeCount === 0) return show();

  deferred.set(options.id, show);
  if (!unsubscribe) {
    unsubscribe = pageLoading.store.subscribe(({ activeCount }) => {
      if (activeCount > 0) return;
      unsubscribe?.();
      unsubscribe = undefined;
      const pending = [...deferred.values()];
      deferred.clear();
      pending.forEach(callback => callback());
    });
  }
  return options.id;
}

export const notify = createNotifier({
  success: (message, options) => deliver("success", message, options),
  error: (message, options) => deliver("error", message, options),
  info: (message, options) => deliver("info", message, options),
});
