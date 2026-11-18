"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";

import { useCmsPreferences } from "@/cms/context/cms-preferences";
import { cn } from "@/cms/lib/cn";

export const CmsSheet = Dialog.Root;
export const CmsSheetTrigger = Dialog.Trigger;
export const CmsSheetClose = Dialog.Close;

export function CmsSheetContent({ className, children, side = "right", ...props }: ComponentProps<typeof Dialog.Content> & { side?: "left" | "right" }) {
  const { direction, theme } = useCmsPreferences();
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="cms-sheet-overlay" />
      <Dialog.Content className={cn("cms-portal cms-sheet", `cms-sheet--${side}`, className)} data-cms-theme={theme} dir={direction} {...props}>
        {children}
        <Dialog.Close className="cms-sheet-close" aria-label="Đóng bảng điều khiển">
          <X aria-hidden="true" size={18} />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export const CmsSheetTitle = Dialog.Title;
export const CmsSheetDescription = Dialog.Description;
