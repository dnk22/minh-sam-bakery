"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactNode } from "react";

import { useCmsPreferences } from "@/cms/context/cms-preferences";

export function CmsTooltip({ children }: { children: ReactNode }) {
  return <Tooltip.Provider delayDuration={150}><Tooltip.Root>{children}</Tooltip.Root></Tooltip.Provider>;
}

export const CmsTooltipTrigger = Tooltip.Trigger;

export function CmsTooltipContent(props: ComponentProps<typeof Tooltip.Content>) {
  const { direction, theme } = useCmsPreferences();
  return <Tooltip.Portal><Tooltip.Content className="cms-portal cms-tooltip" data-cms-theme={theme} dir={direction} sideOffset={8} {...props} /></Tooltip.Portal>;
}
