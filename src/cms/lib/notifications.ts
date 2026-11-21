"use client";

import { toast } from "sonner";

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

export const notify = createNotifier(toast);
