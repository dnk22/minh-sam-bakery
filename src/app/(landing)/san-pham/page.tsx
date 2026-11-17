import type { Metadata } from "next";

import { StorefrontPage } from "@/landing/features/catalog/storefront-page";
import { getCatalogSnapshot } from "@/landing/features/catalog/repository";

export const metadata: Metadata = {
  title: "Sản phẩm | Minh Sâm Bakery",
  description: "Khám phá các dòng bánh và quà tặng thủ công của Minh Sâm Bakery.",
};

export const instant = false;

export default async function ProductsStorefrontRoute() {
  const { categories, products } = await getCatalogSnapshot();
  return <StorefrontPage catalogCategories={categories} catalogProducts={products} />;
}
