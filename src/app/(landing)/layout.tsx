import type { ReactNode } from "react";

import { LandingFooter } from "@/landing/components/layout/landing-footer";
import { LandingHeader } from "@/landing/components/layout/landing-header";
import { getCatalogCategories } from "@/landing/features/catalog/repository";

export default async function LandingLayout({ children }: { children: ReactNode }) {
  const categories = await getCatalogCategories().catch(() => []);
  return (
    <>
      <LandingHeader categories={categories} />
      {children}
      <LandingFooter />
    </>
  );
}
