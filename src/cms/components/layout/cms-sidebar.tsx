"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  CmsCollapsible,
  CmsCollapsibleContent,
  CmsCollapsibleTrigger,
} from "@/cms/components/ui/collapsible";
import {
  CmsDropdown,
  CmsDropdownContent,
  CmsDropdownItem,
  CmsDropdownLabel,
  CmsDropdownSeparator,
  CmsDropdownTrigger,
} from "@/cms/components/ui/dropdown-menu";
import {
  CmsTooltip,
  CmsTooltipContent,
  CmsTooltipTrigger,
} from "@/cms/components/ui/tooltip";
import {
  cmsNavigation,
  isCmsRouteActive,
  type CmsNavItem,
  type CmsNavLink,
} from "@/cms/config/navigation";
import { useCmsPreferences } from "@/cms/context/cms-preferences";
import { useCmsIsMobile } from "@/cms/hooks/use-mobile";

export function CmsSidebar() {
  const pathname = usePathname();
  const isMobile = useCmsIsMobile();
  const sidebarRef = useRef<HTMLElement>(null);
  const {
    mobileSidebarOpen,
    offcanvasSidebarOpen,
    setMobileSidebarOpen,
    setOffcanvasSidebarOpen,
    setSidebarLayout,
    sidebarLayout,
  } = useCmsPreferences();
  const collapsed = sidebarLayout === "icon";

  useEffect(() => {
    const locked = mobileSidebarOpen || offcanvasSidebarOpen;
    if (!locked) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    if (mobileSidebarOpen) {
      requestAnimationFrame(() => sidebarRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus());
    }
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
        setOffcanvasSidebarOpen(false);
        return;
      }
      if (event.key !== "Tab" || !mobileSidebarOpen || !sidebarRef.current) return;
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
      previousFocus?.focus();
    };
  }, [mobileSidebarOpen, offcanvasSidebarOpen, setMobileSidebarOpen, setOffcanvasSidebarOpen]);

  const closeTemporarySidebar = () => {
    setMobileSidebarOpen(false);
    setOffcanvasSidebarOpen(false);
  };

  return (
    <>
      <button
        aria-label="Đóng menu CMS"
        className="cms-sidebar-overlay"
        data-open={mobileSidebarOpen || offcanvasSidebarOpen || undefined}
        onClick={closeTemporarySidebar}
        type="button"
      />
      <aside
        aria-hidden={(isMobile ? !mobileSidebarOpen : sidebarLayout === "offcanvas" && !offcanvasSidebarOpen) || undefined}
        aria-label="Điều hướng CMS"
        aria-modal={isMobile && mobileSidebarOpen ? true : undefined}
        className="cms-sidebar"
        data-mobile-open={mobileSidebarOpen || undefined}
        inert={isMobile ? !mobileSidebarOpen : sidebarLayout === "offcanvas" && !offcanvasSidebarOpen}
        ref={sidebarRef}
        role={isMobile ? "dialog" : undefined}
      >
        <div className="cms-sidebar-header">
          <Link className="cms-brand" href="/cms" onClick={closeTemporarySidebar}>
            <Image alt="Minh Sâm Bakery" className="cms-brand-logo" height={34} src="/images/minh-sam-logo.webp" width={34} />
            <span className="cms-brand-copy">
              <strong>Minh Sâm Bakery</strong>
              <small>CMS Workspace</small>
            </span>
          </Link>
        </div>

        <nav className="cms-sidebar-content">
          {cmsNavigation.map((group) => (
            <div className="cms-nav-group" key={group.title}>
              <div className="cms-nav-group-label">{group.title}</div>
              <div className="cms-nav-list">
                {group.items.map((item) => (
                  <CmsSidebarItem
                    collapsed={collapsed}
                    item={item}
                    key={item.title}
                    onNavigate={closeTemporarySidebar}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <button
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          className="cms-sidebar-rail"
          onClick={() => setSidebarLayout(collapsed ? "default" : "icon")}
          type="button"
        />
      </aside>
    </>
  );
}

function CmsSidebarItem({
  collapsed,
  item,
  onNavigate,
  pathname,
}: {
  collapsed: boolean;
  item: CmsNavItem;
  onNavigate: () => void;
  pathname: string;
}) {
  if (!("items" in item)) {
    return <CmsSidebarLink collapsed={collapsed} item={item} onNavigate={onNavigate} pathname={pathname} />;
  }

  const active = item.items.some((child) => isCmsRouteActive(pathname, child.href));
  if (collapsed) {
    const Icon = item.icon;
    return (
      <CmsDropdown>
        <CmsTooltip>
          <CmsTooltipTrigger asChild>
            <CmsDropdownTrigger asChild>
              <button className="cms-nav-link cms-nav-link--icon" data-active={active || undefined} type="button">
                {Icon ? <Icon aria-hidden="true" size={18} /> : null}
                <span className="sr-only">{item.title}</span>
              </button>
            </CmsDropdownTrigger>
          </CmsTooltipTrigger>
          <CmsTooltipContent side="right">{item.title}</CmsTooltipContent>
        </CmsTooltip>
        <CmsDropdownContent align="start" side="right">
          <CmsDropdownLabel>{item.title}</CmsDropdownLabel>
          <CmsDropdownSeparator />
          {item.items.map((child) => {
            const ChildIcon = child.icon;
            return (
              <CmsDropdownItem asChild key={child.href}>
                <Link href={child.href} onClick={onNavigate}>
                  {ChildIcon ? <ChildIcon aria-hidden="true" size={16} /> : null}
                  {child.title}
                </Link>
              </CmsDropdownItem>
            );
          })}
        </CmsDropdownContent>
      </CmsDropdown>
    );
  }

  return <CmsSidebarCollapsible active={active} item={item} onNavigate={onNavigate} pathname={pathname} />;
}

function CmsSidebarCollapsible({
  active,
  item,
  onNavigate,
  pathname,
}: {
  active: boolean;
  item: Extract<CmsNavItem, { items: CmsNavLink[] }>;
  onNavigate: () => void;
  pathname: string;
}) {
  const [open, setOpen] = useState(active);
  const Icon = item.icon;
  return (
    <CmsCollapsible className="cms-nav-collapsible" onOpenChange={setOpen} open={active || open}>
      <CmsCollapsibleTrigger asChild>
        <button className="cms-nav-link" data-active={active || undefined} type="button">
          {Icon ? <Icon aria-hidden="true" size={18} /> : null}
          <span>{item.title}</span>
          <ChevronRight aria-hidden="true" className="cms-nav-chevron" size={16} />
        </button>
      </CmsCollapsibleTrigger>
      <CmsCollapsibleContent className="cms-nav-sub-content">
        <div className="cms-nav-sub-list">
          {item.items.map((child) => (
            <Link
              className="cms-nav-sub-link"
              data-active={isCmsRouteActive(pathname, child.href) || undefined}
              href={child.href}
              key={child.href}
              onClick={onNavigate}
            >
              {child.title}
            </Link>
          ))}
        </div>
      </CmsCollapsibleContent>
    </CmsCollapsible>
  );
}

function CmsSidebarLink({
  collapsed,
  item,
  onNavigate,
  pathname,
}: {
  collapsed: boolean;
  item: CmsNavLink;
  onNavigate: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      aria-current={isCmsRouteActive(pathname, item.href) ? "page" : undefined}
      className="cms-nav-link"
      data-active={isCmsRouteActive(pathname, item.href) || undefined}
      href={item.href}
      onClick={onNavigate}
    >
      {Icon ? <Icon aria-hidden="true" size={18} /> : null}
      <span>{item.title}</span>
    </Link>
  );

  if (!collapsed) return link;
  return (
    <CmsTooltip>
      <CmsTooltipTrigger asChild>{link}</CmsTooltipTrigger>
      <CmsTooltipContent side="right">{item.title}</CmsTooltipContent>
    </CmsTooltip>
  );
}
