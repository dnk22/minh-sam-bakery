"use client";

import { PageLoading } from "@/shared/components/page-loading/page-loading";
import { usePageLoading } from "@/shared/hooks/use-page-loading";

export function LandingPageLoading() {
  const open = usePageLoading(0);
  return <PageLoading open={open} />;
}
