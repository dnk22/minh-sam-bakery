/* eslint-disable @next/next/no-img-element */

import {
   CircleUserRound,
  // Search,
  // ShoppingBag,
} from "lucide-react";
import Image from "next/image";

const navigationItems = [
  { label: "Trang chủ", path: "trang-chu" },
  { label: "Sản phẩm", path: "san-pham" },
  { label: "Tin tức", path: "qua-tang" },
  { label: "Về Minh Sâm", path: "ve-minh-sam" },
];

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary/95 backdrop-blur-md shadow-[0_4px_24px_rgba(46,2,8,0.18)]">
      <div className="h-20 max-w-[1360px] mx-auto px-gutter-desktop flex items-center justify-between gap-space-lg">
        <a
          className="flex items-center gap-space-sm group text-left"
          data-path="trang-chu"
          href="#"
        >
          <Image
            src="/images/minh-sam-logo.webp"
            alt="Minh Sâm Bakery"
            width={64}
            height={64}
            priority
            className="size-14 object-contain transition-transform group-hover:scale-105 xs:w-16 xs:h-16"
          />
          <span className="font-headline-sm text-headline-sm text-secondary-fixed tracking-wide group-hover:text-secondary-fixed-dim transition-colors">
            MINH SÂM
          </span>
        </a>
        <nav
          className="hidden lg:flex items-center gap-space-lg"
          data-active-classes="text-secondary-fixed font-semibold"
        >
          {navigationItems.map(({ label, path }) => (
            <a
              className="font-label-ui text-label-ui text-secondary-fixed-dim/80 hover:text-secondary-fixed transition-colors py-space-xs tracking-wider uppercase"
              data-path={path}
              href="#"
              key={path}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-space-md">
          {/* <button
            aria-label="Tìm kiếm sản phẩm"
            className="w-9 h-9 rounded-full flex items-center justify-center text-secondary-fixed-dim hover:text-secondary-fixed hover:bg-primary-container transition-all"
            type="button"
          >
            <Search aria-hidden="true" className="size-5" />
          </button> */}
          <button
            aria-label="Tài khoản khách hàng"
            className="w-9 h-9 rounded-full flex items-center justify-center text-secondary-fixed-dim hover:text-secondary-fixed hover:bg-primary-container transition-all"
            type="button"
          >
            <CircleUserRound aria-hidden="true" className="size-5" />
          </button>
          {/* <button
            aria-label="Giỏ hàng quà tặng"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-secondary-fixed-dim hover:text-secondary-fixed hover:bg-primary-container transition-all"
            type="button"
          >
            <ShoppingBag aria-hidden="true" className="size-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-fixed" />
          </button> */}
        </div>
      </div>
    </header>
  );
}
