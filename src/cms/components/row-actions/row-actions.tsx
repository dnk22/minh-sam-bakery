"use client";

import { Eye, MoreHorizontal } from "lucide-react";
import { Fragment, type MouseEvent, type ReactNode } from "react";

import {
  CmsDropdown,
  CmsDropdownContent,
  CmsDropdownItem,
  CmsDropdownSeparator,
  CmsDropdownTrigger,
} from "@/cms/components/ui/dropdown-menu";
import { cn } from "@/cms/lib/cn";

import styles from "./row-actions.module.css";

export type CmsRowAction = {
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  key: string;
  label: ReactNode;
  onSelect: () => void;
  separatorBefore?: boolean;
};

export type CmsRowActionsProps = {
  actions: readonly CmsRowAction[];
  className?: string;
  moreLabel: string;
  onView: () => void;
  viewLabel: string;
};

export function CmsRowActions({
  actions,
  className,
  moreLabel,
  onView,
  viewLabel,
}: CmsRowActionsProps) {
  const stopAndView = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onView();
  };

  return (
    <div className={cn(styles.actions, className)} onClick={(event) => event.stopPropagation()}>
      <button
        aria-label={viewLabel}
        className={styles.view}
        onClick={stopAndView}
        title={viewLabel}
        type="button"
      >
        <Eye aria-hidden="true" />
      </button>
      <CmsDropdown>
        <CmsDropdownTrigger asChild>
          <button
            aria-label={moreLabel}
            className={styles.more}
            onClick={(event) => event.stopPropagation()}
            title={moreLabel}
            type="button"
          >
            <MoreHorizontal aria-hidden="true" />
          </button>
        </CmsDropdownTrigger>
        <CmsDropdownContent align="end" className={styles.menu}>
          {actions.map((action) => (
            <Fragment key={action.key}>
              {action.separatorBefore ? <CmsDropdownSeparator /> : null}
              <CmsDropdownItem
                className={action.destructive ? styles.destructive : undefined}
                disabled={action.disabled}
                onSelect={action.onSelect}
              >
                {action.icon}
                {action.label}
              </CmsDropdownItem>
            </Fragment>
          ))}
        </CmsDropdownContent>
      </CmsDropdown>
    </div>
  );
}
