"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/cms/lib/cn";

export const cmsButtonVariants = cva("cms-button", {
  variants: {
    variant: {
      default: "cms-button--default",
      destructive: "cms-button--destructive",
      outline: "cms-button--outline",
      secondary: "cms-button--secondary",
      ghost: "cms-button--ghost",
    },
    size: {
      default: "cms-button--size-default",
      sm: "cms-button--size-sm",
      icon: "cms-button--size-icon",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export function CmsButton({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof cmsButtonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(cmsButtonVariants({ size, variant }), className)} {...props} />;
}
