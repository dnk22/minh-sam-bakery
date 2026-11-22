import type { ReactNode } from "react";

import { LandingFooter } from "@/landing/components/layout/landing-footer";
import { LandingHeader } from "@/landing/components/layout/landing-header";
import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { reportCatalogError } from "@/landing/features/catalog/diagnostics";

export default async function LandingLayout({ children }: { children: ReactNode }) {
  const categories = await getCatalogCategories().catch((error) => {
    reportCatalogError("categories", "/api/v1/public/categories", error);
    return [];
  });
  return (
    <>
      <LandingHeader categories={categories} />
      {children}
      <LandingFooter />
    </>
  );
}
