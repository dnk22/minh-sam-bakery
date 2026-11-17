"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { routes } from "@/landing/lib/routes";

const navigationItems = [
  { label: "Trang chủ", path: "trang-chu", href: routes.homeHero },
  { label: "Sản phẩm", path: "san-pham", href: routes.products },
  { label: "Tin tức", path: "tin-tuc", href: routes.journal },
  { label: "Về Minh Sâm", path: "ve-minh-sam", href: routes.about },
];

export function LandingHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleDrawerKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
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
    window.addEventListener("keydown", handleDrawerKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleDrawerKeys);
      previousFocus?.focus();
    };
  }, [isDrawerOpen]);

  const closeDrawer = () => setIsDrawerOpen(false);
  const navigateToHero = (event: MouseEvent<HTMLAnchorElement>) => {
    closeDrawer();
    if (
      pathname !== routes.home ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const hero = document.getElementById("trang-chu");
    if (!hero) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hero.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", routes.homeHero);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-primary/95 shadow-[0_4px_24px_rgba(46,2,8,0.18)] backdrop-blur-md">
      <div className="mx-auto flex h-[var(--landing-header-height)] max-w-[1360px] items-center justify-between gap-space-md px-6 md:gap-space-lg md:px-12 lg:px-gutter-desktop">
        <BrandLink onNavigate={navigateToHero} />

        <div className="flex items-center gap-space-lg">
          <nav
            className="hidden items-center gap-space-lg lg:flex"
            data-active-classes="text-secondary-fixed font-semibold"
          >
            {navigationItems.map(({ label, path, href }) => (
              <NavigationLink
                active={isNavigationItemActive(pathname, href)}
                href={href}
                key={path}
                label={label}
                onNavigate={href === routes.homeHero ? navigateToHero : undefined}
                path={path}
              />
            ))}
          </nav>

          <button
            aria-controls="mobile-navigation-drawer"
            aria-expanded={isDrawerOpen}
            aria-label="Mở menu điều hướng"
            className="flex size-11 items-center justify-center rounded text-secondary-fixed transition-colors hover:bg-primary-container lg:hidden"
            onClick={() => setIsDrawerOpen(true)}
            ref={menuButtonRef}
            type="button"
          >
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isDrawerOpen}
        className={`fixed inset-0 z-[60] lg:hidden ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          aria-label="Đóng menu điều hướng"
          className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeDrawer}
          tabIndex={isDrawerOpen ? 0 : -1}
          type="button"
        />
        <aside
          aria-label="Menu điều hướng mobile"
          aria-modal="true"
          className={`absolute top-0 right-0 flex h-dvh w-[min(86vw,360px)] flex-col bg-primary shadow-2xl transition-transform duration-300 ease-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
          id="mobile-navigation-drawer"
          inert={!isDrawerOpen}
          ref={drawerRef}
          role="dialog"
        >
          <div className="flex h-[var(--landing-header-height)] items-center justify-between border-b border-secondary-fixed/15 px-6">
            <BrandLink onNavigate={navigateToHero} compact />
            <button
              aria-label="Đóng menu điều hướng"
              className="flex size-11 items-center justify-center rounded text-secondary-fixed transition-colors hover:bg-primary-container"
              onClick={closeDrawer}
              ref={closeButtonRef}
              type="button"
            >
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col px-6 py-8">
            {navigationItems.map(({ label, path, href }) => (
              <Link
                aria-current={isNavigationItemActive(pathname, href) ? "page" : undefined}
                className={`flex items-center justify-between border-b border-secondary-fixed/15 py-5 font-headline-sm text-headline-sm transition-colors hover:text-secondary-fixed-dim ${isNavigationItemActive(pathname, href) ? "font-semibold text-secondary-fixed" : "text-secondary-fixed"}`}
                data-path={path}
                href={href}
                key={path}
                onClick={href === routes.homeHero ? navigateToHero : closeDrawer}
                tabIndex={isDrawerOpen ? 0 : -1}
              >
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t border-secondary-fixed/15 px-6 py-6">
            <p className="font-label-eyebrow text-label-eyebrow uppercase tracking-[0.2em] text-secondary-fixed-dim/60">
              Hà Nội • Hương vị di sản
            </p>
          </div>
        </aside>
      </div>
    </header>
  );
}

function BrandLink({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      className="group flex items-center gap-space-sm text-left"
      data-path="trang-chu"
      href={routes.homeHero}
      onClick={onNavigate}
    >
      <Image
        alt="Minh Sâm Bakery"
        className={`${compact ? "size-8 md:size-10" : "size-8 md:size-10 lg:size-12"} object-contain transition-transform group-hover:scale-105`}
        width={48}
        height={48}
        priority={!compact}
        src="/images/minh-sam-logo.webp"
      />
      <span
        className={`${compact ? "text-[15px] md:text-subheading" : "text-[16px] md:text-[18px] lg:text-headline-sm"} font-headline-sm tracking-wide text-secondary-fixed transition-colors group-hover:text-secondary-fixed-dim`}
      >
        MINH SÂM
      </span>
    </Link>
  );
}

function NavigationLink({
  active,
  href,
  label,
  onNavigate,
  path,
}: {
  active: boolean;
  href: string;
  label: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
  path: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`py-space-xs font-label-ui text-label-ui uppercase tracking-wider transition-colors hover:text-secondary-fixed ${active ? "font-semibold text-secondary-fixed" : "text-secondary-fixed-dim/80"}`}
      data-path={path}
      href={href}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}

function isNavigationItemActive(pathname: string, href: string) {
  return href === routes.homeHero
    ? pathname === routes.home
    : pathname === href || pathname.startsWith(`${href}/`);
}
