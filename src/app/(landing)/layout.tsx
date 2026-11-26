import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

import { LandingShellSkeleton } from "@/landing/components/skeletons/landing-shell-skeleton";
import { HeaderSkeleton } from "@/landing/components/skeletons/landing-skeletons";
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

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LandingShellSkeleton />}>
      <LandingRuntimeLayout>{children}</LandingRuntimeLayout>
    </Suspense>
  );
}

async function LandingRuntimeLayout({ children }: { children: ReactNode }) {
  // Request-time boundary: do not populate backend-dependent shell data during next build.
  // Keep tagged fetch/theme caches at runtime; loading shell is safe to prerender.
  await connection();
  const landingTheme = await getActiveLandingTheme();
  reportLandingThemeDiagnostics(landingTheme);
  return (
    <LandingThemeRoot theme={landingTheme.theme}>
      <CartHydration>
        <Suspense fallback={<HeaderSkeleton />}><RuntimeHeader /></Suspense>
        {children}
        <LandingFooter />
      </CartHydration>
    </LandingThemeRoot>
  );
}

async function RuntimeHeader() {
  await connection();
  const categories = await getCatalogCategories().catch(error => {
    reportCatalogError("categories", "/api/v1/public/categories", error);
    return [];
  });
  return <LandingHeader categories={categories} />;
}
