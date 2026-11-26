"use client";

import { usePathname } from "next/navigation";
import { HeaderSkeleton, HomeSkeleton, CatalogSkeleton, ProductDetailSkeleton, JournalSkeleton, FormSkeleton, AboutSkeleton } from "./landing-skeletons";

export function LandingRouteSkeleton() {
  const path = usePathname() ?? "/";
  const segments = path.split("/").filter(Boolean);
  const content = path === "/" ? <HomeSkeleton />
    : segments[0] === "danh-muc" ? segments.length > 2 ? <ProductDetailSkeleton /> : <CatalogSkeleton />
    : segments[0] === "tim-kiem" ? <CatalogSkeleton search />
    : segments[0] === "tin-tuc" ? <JournalSkeleton detail={segments.length > 1} />
    : segments[0] === "ve-minh-sam" ? <AboutSkeleton />
    : segments[0] === "don-hang" || segments[0] === "thanh-toan" ? <FormSkeleton cart={segments[0] === "don-hang"} />
    : <CatalogSkeleton />;
  return content;
}

export function LandingShellSkeleton() {
  return <div className="min-h-screen bg-surface"><HeaderSkeleton /><LandingRouteSkeleton /></div>;
}
