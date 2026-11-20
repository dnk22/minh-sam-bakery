import type { ComponentProps } from "react";

import { cn } from "@/cms/lib/cn";

import styles from "./badge.module.css";

export type CmsBadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive";

export type CmsBadgeProps = ComponentProps<"span"> & {
  variant?: CmsBadgeVariant;
};

export function CmsBadge({
  className,
  variant = "default",
  ...props
}: CmsBadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    />
  );
}
