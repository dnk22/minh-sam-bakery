"use client";

import { usePathname } from "next/navigation";

import { resolveCmsBreadcrumbs } from "@/cms/config/navigation";

export function useCmsBreadcrumb() {
  const pathname = usePathname();
  return resolveCmsBreadcrumbs(pathname);
}
