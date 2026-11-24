"use client";

import { ListFilter, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsPopover, CmsPopoverClose, CmsPopoverContent, CmsPopoverTrigger } from "@/cms/components/ui/popover";
import { useCmsIsMobile } from "@/cms/hooks/use-mobile";
import { cn } from "@/cms/lib/cn";

import styles from "./filter-group.module.css";

export function CmsFilterGroup({
  activeCount,
  children,
  className,
  layout = "legacy",
  label,
  onClear,
}: {
  activeCount: number;
  children: ReactNode;
  className?: string;
  layout?: "legacy" | "toolbar";
  label: string;
  onClear?: () => void;
}) {
  const isMobile = useCmsIsMobile();
  const titleId = useId();
  const count = Math.max(0, Math.trunc(activeCount));
  const [popoverState, setPopoverState] = useState({ mobile: false, open: false });
  const open = popoverState.mobile === isMobile ? popoverState.open : false;
  if (popoverState.mobile !== isMobile) setPopoverState({ mobile: isMobile, open: false });

  if (!isMobile) return <div className={cn(styles.desktop, className)} data-layout={layout}>{children}</div>;

  const accessibleLabel = count > 0 ? `${label}, ${count} bộ lọc đang áp dụng` : label;
  return <CmsPopover open={open} onOpenChange={(nextOpen) => setPopoverState({ mobile: true, open: nextOpen })}>
    <CmsPopoverTrigger asChild>
      <CmsButton aria-label={accessibleLabel} className={styles.trigger} size="icon" title={accessibleLabel} type="button" variant={count ? "secondary" : "outline"}>
        <ListFilter aria-hidden="true" size={18} />
        {count ? <span className={styles.badge} aria-hidden="true">{count}</span> : null}
      </CmsButton>
    </CmsPopoverTrigger>
    <CmsPopoverContent align="end" aria-labelledby={titleId} className={styles.panel} role="dialog">
      <header className={styles.header}>
        <h2 id={titleId}>{label}</h2>
        <CmsPopoverClose asChild>
          <CmsButton aria-label="Đóng bộ lọc" className={styles.close} size="icon" title="Đóng" type="button" variant="ghost">
            <X aria-hidden="true" size={17} />
          </CmsButton>
        </CmsPopoverClose>
      </header>
      <div className={styles.body} data-layout={layout}>{children}</div>
      {onClear && count > 0 ? <footer className={styles.footer}>
        <CmsButton type="button" size="sm" variant="ghost" onClick={onClear}><X aria-hidden="true" size={15} /> Xóa bộ lọc</CmsButton>
      </footer> : null}
    </CmsPopoverContent>
  </CmsPopover>;
}
