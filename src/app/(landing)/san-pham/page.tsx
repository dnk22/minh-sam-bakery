import type { Metadata } from "next";

import { StorefrontPage } from "@/landing/features/catalog/storefront-page";

export const metadata: Metadata = {
  title: "Sản phẩm | Minh Sâm Bakery",
  description: "Khám phá các dòng bánh và quà tặng thủ công của Minh Sâm Bakery.",
};

export default function ProductsStorefrontRoute() {
  return <StorefrontPage />;
}
