"use client";

import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FocusEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { useCartHydrated } from "@/landing/features/cart/components/cart-hydration";
import { useCartStore } from "@/landing/features/cart/store/cart-store";
import type { CatalogCategory } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";
import { categorySlugFromPathname, isProductsPath } from "./landing-header-routing";

const navigationItems = [
  { label: "Trang chủ", path: "trang-chu", href: routes.homeHero },
  { label: "Tin tức", path: "tin-tuc", href: routes.journal },
  { label: "Về Minh Sâm", path: "ve-minh-sam", href: routes.about },
];

export function LandingHeader({ categories }: { categories: CatalogCategory[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDesktopProductsOpen, setIsDesktopProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const cartHydrated = useCartHydrated();
  const cartCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
  const activeCategorySlug = categorySlugFromPathname(pathname);
  const productsActive = isProductsPath(pathname);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const productsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktopProductsOpen) return;
    const closeMenu = (event: PointerEvent) => {
      if (!productsMenuRef.current?.contains(event.target as Node)) setIsDesktopProductsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDesktopProductsOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isDesktopProductsOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsMobileProductsOpen(false);
  };
  const navigateToHero = (event: MouseEvent<HTMLAnchorElement>) => {
    closeDrawer();
    if (pathname !== routes.home || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hero = document.getElementById("trang-chu");
    if (!hero) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hero.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", routes.homeHero);
  };
  const closeProductsOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDesktopProductsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-primary/95 shadow-[0_4px_24px_rgba(46,2,8,0.18)] backdrop-blur-md">
      <div className="mx-auto flex h-[var(--landing-header-height)] max-w-[1360px] items-center justify-between gap-space-md px-6 md:gap-space-lg md:px-12 lg:px-gutter-desktop">
        <BrandLink onNavigate={navigateToHero} />
        <div className="flex items-center gap-space-lg">
          <nav className="hidden items-center gap-space-lg lg:flex" data-active-classes="text-secondary-fixed font-semibold">
            <NavigationLink active={pathname === routes.home} href={routes.homeHero} label="Trang chủ" onNavigate={navigateToHero} path="trang-chu" />
            <div className="relative" onBlur={closeProductsOnBlur} onFocus={() => setIsDesktopProductsOpen(true)} onMouseEnter={() => setIsDesktopProductsOpen(true)} onMouseLeave={() => setIsDesktopProductsOpen(false)} ref={productsMenuRef}>
              <Link aria-current={productsActive ? "page" : undefined} aria-expanded={isDesktopProductsOpen} aria-haspopup="true" className={`flex items-center gap-1 py-space-xs font-label-ui text-label-ui uppercase tracking-wider transition-colors hover:text-secondary-fixed ${productsActive ? "font-semibold text-secondary-fixed" : "text-secondary-fixed-dim/80"}`} href={routes.categories}>
                Sản phẩm <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${isDesktopProductsOpen ? "rotate-180" : ""}`} />
              </Link>
              {isDesktopProductsOpen && categories.length > 0 ? (
                <div aria-label="Danh mục sản phẩm" className="absolute top-full left-1/2 max-h-[min(70vh,32rem)] w-64 -translate-x-1/2 overflow-y-auto rounded-lg border border-secondary-fixed/15 bg-primary py-2 shadow-2xl">
                  {categories.map((category) => <Link aria-current={activeCategorySlug === category.slug ? "page" : undefined} className={`block px-4 py-3 font-label-ui text-label-ui transition-colors hover:bg-primary-container hover:text-secondary-fixed ${activeCategorySlug === category.slug ? "bg-primary-container font-semibold text-secondary-fixed" : "text-secondary-fixed-dim"}`} href={routes.category(category.slug)} key={category.id ?? category.slug} onClick={() => setIsDesktopProductsOpen(false)}>{category.name}</Link>)}
                </div>
              ) : null}
            </div>
            {navigationItems.slice(1).map(({ label, path, href }) => <NavigationLink active={isNavigationItemActive(pathname, href)} href={href} key={path} label={label} path={path} />)}
          </nav>
          <Link aria-label="Tìm kiếm sản phẩm" aria-current={pathname === routes.search ? "page" : undefined} title="Tìm kiếm sản phẩm" href={routes.search} className={"flex size-11 items-center justify-center rounded transition-colors hover:bg-primary-container " + (pathname === routes.search ? "bg-primary-container text-secondary-fixed" : "text-secondary-fixed-dim")}><Search aria-hidden="true" className="size-5" /></Link>
          <Link
            aria-label={cartHydrated && cartCount > 0 ? `Giỏ hàng, ${cartCount} sản phẩm` : "Giỏ hàng"}
            aria-current={pathname === routes.cart ? "page" : undefined}
            className={`relative flex size-11 items-center justify-center rounded transition-colors hover:bg-primary-container ${pathname === routes.cart ? "bg-primary-container text-secondary-fixed" : "text-secondary-fixed-dim"}`}
            href={routes.cart}
            title="Giỏ hàng"
          >
            <ShoppingCart aria-hidden="true" className="size-5" />
            {cartHydrated && cartCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 font-label-eyebrow text-[10px] font-bold text-on-secondary">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
          <button aria-controls="mobile-navigation-drawer" aria-expanded={isDrawerOpen} aria-label="Mở menu điều hướng" className="flex size-11 items-center justify-center rounded text-secondary-fixed transition-colors hover:bg-primary-container lg:hidden" onClick={() => setIsDrawerOpen(true)} type="button"><Menu aria-hidden="true" className="size-6" /></button>
        </div>
      </div>

      <div aria-hidden={!isDrawerOpen} className={`fixed inset-0 z-[60] lg:hidden ${isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button aria-label="Đóng menu điều hướng" className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`} onClick={closeDrawer} tabIndex={isDrawerOpen ? 0 : -1} type="button" />
        <aside aria-label="Menu điều hướng mobile" aria-modal="true" className={`absolute top-0 right-0 flex h-dvh w-[min(86vw,360px)] flex-col bg-primary shadow-2xl transition-transform duration-300 ease-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`} id="mobile-navigation-drawer" inert={!isDrawerOpen} ref={drawerRef} role="dialog">
          <div className="flex h-[var(--landing-header-height)] items-center justify-between border-b border-secondary-fixed/15 px-6"><BrandLink compact onNavigate={navigateToHero} /><button aria-label="Đóng menu điều hướng" className="flex size-11 items-center justify-center rounded text-secondary-fixed transition-colors hover:bg-primary-container" onClick={closeDrawer} ref={closeButtonRef} type="button"><X aria-hidden="true" className="size-6" /></button></div>
          <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
            <MobileNavigationLink active={pathname === routes.home} href={routes.homeHero} label="Trang chủ" onClick={navigateToHero} />
            <button aria-controls="mobile-product-categories" aria-expanded={isMobileProductsOpen} className={`flex w-full items-center justify-between border-b border-secondary-fixed/15 py-5 text-left font-headline-sm text-headline-sm transition-colors hover:text-secondary-fixed-dim ${productsActive ? "font-semibold text-secondary-fixed" : "text-secondary-fixed"}`} onClick={() => setIsMobileProductsOpen((open) => !open)} type="button"><span>Sản phẩm</span><ChevronDown aria-hidden="true" className={`size-5 transition-transform ${isMobileProductsOpen ? "rotate-180" : ""}`} /></button>
            {isMobileProductsOpen ? (
              <div className="border-b border-secondary-fixed/15 bg-primary-container/35 py-2 pl-4" id="mobile-product-categories">
                <Link className="block py-3 font-label-ui text-label-ui text-secondary-fixed-dim hover:text-secondary-fixed" href={routes.search} onClick={closeDrawer}>Tất cả sản phẩm</Link>
                {categories.map((category) => <Link aria-current={activeCategorySlug === category.slug ? "page" : undefined} className={`block py-3 font-label-ui text-label-ui hover:text-secondary-fixed ${activeCategorySlug === category.slug ? "font-semibold text-secondary-fixed" : "text-secondary-fixed-dim"}`} href={routes.category(category.slug)} key={category.id ?? category.slug} onClick={closeDrawer}>{category.name}</Link>)}
              </div>
            ) : null}
            {navigationItems.slice(1).map(({ label, href }) => <MobileNavigationLink active={isNavigationItemActive(pathname, href)} href={href} key={href} label={label} onClick={closeDrawer} />)}
          </nav>
          <div className="border-t border-secondary-fixed/15 px-6 py-6"><p className="font-label-eyebrow text-label-eyebrow uppercase tracking-[0.2em] text-secondary-fixed-dim/60">Hà Nội • Hương vị di sản</p></div>
        </aside>
      </div>
    </header>
  );
}

function MobileNavigationLink({ active, href, label, onClick }: { active: boolean; href: string; label: string; onClick: ((event: MouseEvent<HTMLAnchorElement>) => void) | (() => void) }) {
  return <Link aria-current={active ? "page" : undefined} className={`flex items-center justify-between border-b border-secondary-fixed/15 py-5 font-headline-sm text-headline-sm transition-colors hover:text-secondary-fixed-dim ${active ? "font-semibold text-secondary-fixed" : "text-secondary-fixed"}`} href={href} onClick={onClick}>{label}</Link>;
}

function BrandLink({ compact = false, onNavigate }: { compact?: boolean; onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return <Link className="group flex items-center gap-space-sm text-left" data-path="trang-chu" href={routes.homeHero} onClick={onNavigate}><Image alt="Minh Sâm Bakery" className={`${compact ? "size-8 md:size-10" : "size-8 md:size-10 lg:size-12"} object-contain transition-transform group-hover:scale-105`} height={48} priority={!compact} src="/images/minh-sam-logo.webp" width={48} /><span className={`${compact ? "text-[15px] md:text-subheading" : "text-[16px] md:text-[18px] lg:text-headline-sm"} font-headline-sm tracking-wide text-secondary-fixed transition-colors group-hover:text-secondary-fixed-dim`}>MINH SÂM</span></Link>;
}

function NavigationLink({ active, href, label, onNavigate, path }: { active: boolean; href: string; label: string; onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void; path: string }) {
  return <Link aria-current={active ? "page" : undefined} className={`py-space-xs font-label-ui text-label-ui uppercase tracking-wider transition-colors hover:text-secondary-fixed ${active ? "font-semibold text-secondary-fixed" : "text-secondary-fixed-dim/80"}`} data-path={path} href={href} onClick={onNavigate}>{label}</Link>;
}

function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
