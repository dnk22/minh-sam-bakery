"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";

import { useCmsPreferences } from "@/cms/context/cms-preferences";
import { cn } from "@/cms/lib/cn";

export const CmsDropdown = Dropdown.Root;
export const CmsDropdownTrigger = Dropdown.Trigger;
export const CmsDropdownGroup = Dropdown.Group;

export function CmsDropdownContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof Dropdown.Content>) {
  const { theme } = useCmsPreferences();
  return (
    <Dropdown.Portal>
      <Dropdown.Content className={cn("cms-portal cms-dropdown-content", className)} data-cms-theme={theme} sideOffset={sideOffset} {...props} />
    </Dropdown.Portal>
  );
}

export function CmsDropdownItem({ className, ...props }: ComponentProps<typeof Dropdown.Item>) {
  return <Dropdown.Item className={cn("cms-dropdown-item", className)} {...props} />;
}

export function CmsDropdownLabel({ className, ...props }: ComponentProps<typeof Dropdown.Label>) {
  return <Dropdown.Label className={cn("cms-dropdown-label", className)} {...props} />;
}

export function CmsDropdownSeparator(props: ComponentProps<typeof Dropdown.Separator>) {
  return <Dropdown.Separator className="cms-dropdown-separator" {...props} />;
}
