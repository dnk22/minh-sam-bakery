import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CartHydration } from "@/landing/features/cart/components/cart-hydration";
import { LandingFooter } from "@/landing/components/layout/landing-footer";
import { LandingHeader } from "@/landing/components/layout/landing-header";
import { LandingThemeRoot } from "@/landing/features/theme/landing-theme";
import HomePage from "@/app/(landing)/page";
import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { backendThemeDetail } from "@/cms/features/themes/api/themes.server";
import { requireThemeAccess, validThemeId } from "@/cms/features/themes/api/theme-bff";
import { parseThemeConfig } from "@/theme/contracts/theme-config.schema";
import { resolveTheme } from "@/theme/runtime/resolve-theme";

export const metadata: Metadata = {
  title: "Preview theme | Minh Sâm CMS",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ThemePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validThemeId(id)) notFound();
  // CMS session resolution invokes connection(); this page is never prerendered.
  const access = await requireThemeAccess();
  if ("response" in access) notFound();

  let theme;
  try {
    theme = await backendThemeDetail(access.accessToken, id);
  } catch {
    notFound();
  }
  const parsed = parseThemeConfig(theme.config);
  if (!parsed.success) notFound();
  const categories = await getCatalogCategories().catch(() => []);

  return (
    <LandingThemeRoot theme={resolveTheme(parsed.data)}>
      <CartHydration>
        <LandingHeader categories={categories} />
        <HomePage />
        <LandingFooter />
      </CartHydration>
      <aside aria-label="Chế độ xem trước theme" className="fixed bottom-4 right-4 z-[100] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-primary p-3 text-on-primary shadow-xl">
        <span className="text-sm font-semibold">Preview: {theme.name}</span>
        <a href="/cms/themes" className="rounded border border-on-primary/40 px-3 py-1 text-sm hover:bg-on-primary/10">Về CMS</a>
      </aside>
    </LandingThemeRoot>
  );
}
