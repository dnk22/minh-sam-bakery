"use client";

import { usePathname } from "next/navigation";
import { HeaderSkeleton, HomeSkeleton, CatalogSkeleton, ProductDetailSkeleton, JournalSkeleton, FormSkeleton, HeroSkeleton } from "./landing-skeletons";

export function LandingShellSkeleton() {
  const path = usePathname() ?? "/";
  const segments = path.split("/").filter(Boolean);
  const content = path === "/" ? <HomeSkeleton />
    : segments[0] === "danh-muc" ? segments.length > 2 ? <ProductDetailSkeleton /> : <CatalogSkeleton />
    : segments[0] === "tim-kiem" ? <CatalogSkeleton search />
    : segments[0] === "tin-tuc" ? <JournalSkeleton detail={segments.length > 1} />
    : segments[0] === "ve-minh-sam" ? <main aria-busy="true" className="pt-[var(--landing-header-height)]"><HeroSkeleton /></main>
    : segments[0] === "don-hang" || segments[0] === "thanh-toan" ? <FormSkeleton cart={segments[0] === "don-hang"} />
    : <CatalogSkeleton />;
  return <div className="min-h-screen bg-surface"><HeaderSkeleton />{content}</div>;
}
