import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

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
    <Suspense fallback={<LandingShellLoading />}>
      <LandingRuntimeLayout>{children}</LandingRuntimeLayout>
    </Suspense>
  );
}

function LandingShellLoading() {
  return (
    <div aria-busy="true" className="min-h-screen bg-surface text-on-surface" role="status">
      <div aria-hidden="true" className="h-20 border-b border-outline-variant/30 bg-surface-container-lowest" />
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-gutter">
        <p className="font-body-md text-body-md text-on-surface-variant">Đang tải Minh Sâm Bakery…</p>
      </div>
    </div>
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
      </CartHydration>
    </LandingThemeRoot>
  );
}
