import "@/landing/styles/interactive-cursors.css";

import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

import { CartHydration } from "@/landing/features/cart/components/cart-hydration";
import { LandingPageLoading } from "@/landing/components/loading/landing-page-loading";
import { LandingNotifications } from "@/landing/components/notifications/landing-notifications";
import { LandingFooter } from "@/landing/components/layout/landing-footer";
import { LandingHeader } from "@/landing/components/layout/landing-header";
import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { reportCatalogError } from "@/landing/features/catalog/diagnostics";
import { LandingThemeRoot } from "@/landing/features/theme/landing-theme";
import {
  getActiveLandingTheme,
  reportLandingThemeDiagnostics,
} from "@/landing/features/theme/public-theme.server";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LandingRuntimeLayout>{children}</LandingRuntimeLayout>
    </Suspense>
  );
}

async function LandingRuntimeLayout({ children }: { children: ReactNode }) {
  // Request-time boundary: do not populate backend-dependent shell data during next build.
  // Keep tagged fetch/theme caches at runtime; loading shell is safe to prerender.
  await connection();
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
        <LandingNotifications />
        <LandingPageLoading />
      </CartHydration>
    </LandingThemeRoot>
  );
}
