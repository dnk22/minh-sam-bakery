import type { ReactNode } from "react";

import { CartHydration } from "@/landing/features/cart/components/cart-hydration";
import { LandingFooter } from "@/landing/components/layout/landing-footer";
import { LandingHeader } from "@/landing/components/layout/landing-header";
import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { reportCatalogError } from "@/landing/features/catalog/diagnostics";
import { LandingThemeRoot } from "@/landing/features/theme/landing-theme";
import {
  getActiveLandingTheme,
  reportLandingThemeDiagnostics,
} from "@/landing/features/theme/public-theme.server";

export default async function LandingLayout({ children }: { children: ReactNode }) {
  const [categories, landingTheme] = await Promise.all([
    getCatalogCategories().catch((error) => {
      reportCatalogError("categories", "/api/v1/public/categories", error);
      return [];
    }),
    getActiveLandingTheme(),
  ]);
  reportLandingThemeDiagnostics(landingTheme);
  return (
    <LandingThemeRoot theme={landingTheme.theme}>
      <CartHydration>
        <LandingHeader categories={categories} />
        {children}
        <LandingFooter />
      </CartHydration>
    </LandingThemeRoot>
  );
}
