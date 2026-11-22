import type { Metadata } from "next";

import { StorefrontPage } from "@/landing/features/catalog/storefront-page";
import { getCatalogSnapshot } from "@/landing/features/catalog/repository";
import { getPublicLandingBanners } from "@/landing/features/banners/public-banners.server";

export const metadata: Metadata = {
  title: "Sản phẩm | Minh Sâm Bakery",
  description: "Khám phá các dòng bánh và quà tặng thủ công của Minh Sâm Bakery.",
};

export const instant = false;

export default async function ProductsStorefrontRoute() {
  const [catalog, banners] = await Promise.all([
    getCatalogSnapshot(),
    getPublicLandingBanners("products_hero").catch(() => []),
  ]);
  return <StorefrontPage catalogCategories={catalog.categories} catalogProducts={catalog.products} heroBanners={banners} />;
}
