"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useLandingPortalContainer } from "@/landing/features/theme/landing-portal-provider";

export function CheckoutDialog({ title, description, children, onClose, busy = false }: {
  title: string; description?: string; children: ReactNode; onClose: () => void; busy?: boolean;
}) {
  const portal = useLandingPortalContainer();
  return <Dialog.Root open onOpenChange={open => { if (!open && !busy) onClose(); }}>
    <Dialog.Portal container={portal ?? undefined}>
      <Dialog.Overlay className="fixed inset-0 z-[90] bg-primary/60 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[91] max-h-[90dvh] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-surface-container-lowest p-space-md [overflow-wrap:anywhere] sm:p-space-lg text-on-surface shadow-2xl" {...(description ? {} : { "aria-describedby": undefined })} onEscapeKeyDown={e => { if (busy) e.preventDefault(); }} onPointerDownOutside={e => e.preventDefault()}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1"><Dialog.Title className="font-headline-md text-headline-sm text-primary sm:text-[24px] sm:leading-8 lg:text-headline-md lg:leading-9">{title}</Dialog.Title>
          {description ? <Dialog.Description className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{description}</Dialog.Description> : null}</div>
          <Dialog.Close disabled={busy} aria-label="Đóng" className="shrink-0 rounded p-2 text-primary disabled:opacity-40"><X className="size-5" /></Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
