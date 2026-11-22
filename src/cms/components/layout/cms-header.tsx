"use client";

import { PanelLeft } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

import { ProfileDropdown } from "@/cms/components/layout/profile-dropdown";
import { CmsButton } from "@/cms/components/ui/button";
import { useCmsPreferences } from "@/cms/context/cms-preferences";
import type { CmsProfileUser } from "@/cms/features/auth/types";
import { useCmsBreadcrumb } from "@/cms/hooks/use-cms-breadcrumb";

export function CmsHeader({ user, notificationSlot }: { user: CmsProfileUser; notificationSlot?: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const { toggleSidebar } = useCmsPreferences();
  const breadcrumbs = useCmsBreadcrumb();

  useEffect(() => {
    const content = document.querySelector<HTMLElement>(".cms-content");
    const onScroll = () =>
      setScrolled(window.scrollY > 10 || (content?.scrollTop ?? 0) > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    content?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      content?.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="cms-header" data-scrolled={scrolled || undefined}>
      <div className="cms-header-inner">
        <CmsButton aria-label="Bật hoặc tắt sidebar" onClick={toggleSidebar} size="icon" variant="outline">
          <PanelLeft aria-hidden="true" size={18} />
        </CmsButton>
        <span className="cms-header-separator" />
        <nav aria-label="Breadcrumb" className="cms-header-context">
          {breadcrumbs.map((breadcrumb, index) => (
            <span className="cms-breadcrumb-item" key={`${breadcrumb.href}-${breadcrumb.title}`}>
              {index > 0 ? <span aria-hidden="true" className="cms-breadcrumb-separator">/</span> : null}
              {breadcrumb.active ? (
                <span aria-current="page" className="cms-breadcrumb-current">{breadcrumb.title}</span>
              ) : (
                <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
              )}
            </span>
          ))}
        </nav>
        <div className="cms-header-actions">
          {notificationSlot}
          <ProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
