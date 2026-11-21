"use client";

import * as Popover from "@radix-ui/react-popover";
import type { ComponentProps } from "react";

import { useCmsPreferences } from "@/cms/context/cms-preferences";
import { cn } from "@/cms/lib/cn";

export const CmsPopover = Popover.Root;
export const CmsPopoverAnchor = Popover.Anchor;
export const CmsPopoverTrigger = Popover.Trigger;
export const CmsPopoverClose = Popover.Close;

export function CmsPopoverContent({ className, collisionPadding = 12, sideOffset = 8, ...props }: ComponentProps<typeof Popover.Content>) {
  const { direction, theme } = useCmsPreferences();
  return <Popover.Portal>
    <Popover.Content
      className={cn("cms-portal", className)}
      collisionPadding={collisionPadding}
      data-cms-theme={theme}
      dir={direction}
      sideOffset={sideOffset}
      {...props}
    />
  </Popover.Portal>;
}
