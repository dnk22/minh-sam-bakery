"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";

import { useCmsPreferences } from "@/cms/context/cms-preferences";
import { cn } from "@/cms/lib/cn";

import styles from "./responsive-modal.module.css";

export type ResponsiveModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBeforeClose?: () => boolean | Promise<boolean>;
  title: ReactNode;
  description?: ReactNode;
  trigger?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  className?: string;
  variant?: "default" | "confirm";
};

export function ResponsiveModal({
  open,
  defaultOpen,
  onOpenChange,
  onBeforeClose,
  title,
  description,
  trigger,
  children,
  footer,
  closeLabel = "Đóng",
  className,
  variant = "default",
}: ResponsiveModalProps) {
  const { direction, theme } = useCmsPreferences();
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const resolvedOpen = open ?? internalOpen;
  const descriptionId = useId();
  const closing = useRef(false);
  const requestOpenChange = async (nextOpen: boolean) => {
    if (!nextOpen) {
      if (closing.current) return;
      closing.current = true;
      try { if (await onBeforeClose?.() === false) return; }
      finally { closing.current = false; }
    }
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <Dialog.Root open={resolvedOpen} onOpenChange={requestOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className={cn("cms-portal", styles.overlay)} data-cms-theme={theme} />
        <Dialog.Content
          className={cn("cms-portal", styles.content, className)}
          data-cms-theme={theme}
          data-variant={variant}
          dir={direction}
          aria-describedby={description ? descriptionId : undefined}
        >
          <header className={styles.header}>
            <div className={styles.heading}>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              {description ? <Dialog.Description id={descriptionId} className={styles.description}>{description}</Dialog.Description> : null}
            </div>
            <Dialog.Close asChild>
              <button type="button" className={styles.close} aria-label={closeLabel}>
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </header>
          <div className={styles.body}>{children}</div>
          {footer ? <footer className={styles.footer}>{footer}</footer> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
