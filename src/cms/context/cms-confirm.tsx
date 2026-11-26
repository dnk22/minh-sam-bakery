"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";

type ConfirmOptions = { title?: string; message: string; confirmLabel?: string; destructive?: boolean };
type AskConfirm = (options: ConfirmOptions) => Promise<boolean>;
type Request = ConfirmOptions & { resolve: (accepted: boolean) => void };
const ConfirmContext = createContext<AskConfirm | null>(null);

export function CmsConfirmProvider({ children }: { children: ReactNode }) {
  const current = useRef<Request | null>(null);
  const [request, setRequest] = useState<Request | null>(null);
  const ask = useCallback<AskConfirm>((options) => {
    if (current.current) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      const next = { ...options, resolve };
      current.current = next;
      setRequest(next);
    });
  }, []);
  const finish = (accepted: boolean) => {
    const active = current.current;
    if (!active) return;
    current.current = null;
    setRequest(null);
    active.resolve(accepted);
  };
  useEffect(() => () => {
    current.current?.resolve(false);
    current.current = null;
  }, []);
  return <ConfirmContext value={ask}>{children}
    {request ? <ResponsiveModal open elevated variant="confirm" title={request.title ?? "Xác nhận thao tác"}
      onOpenChange={(open) => { if (!open) finish(false); }}
      footer={<><CmsButton type="button" variant="outline" autoFocus onClick={() => finish(false)}>Hủy</CmsButton>
        <CmsButton type="button" variant={request.destructive ? "destructive" : "default"} onClick={() => finish(true)}>{request.confirmLabel ?? "Xác nhận"}</CmsButton></>}>
      <p style={{ margin: 0 }}>{request.message}</p>
    </ResponsiveModal> : null}
  </ConfirmContext>;
}

export function useCmsConfirm() {
  const ask = useContext(ConfirmContext);
  if (!ask) throw new Error("useCmsConfirm must be used inside CmsConfirmProvider");
  return ask;
}
