import { Suspense } from "react";
import { ProductsPage } from "@/cms/features/products/components/products-page/products-page";

export default function CmsProductsPage() {
  return <Suspense fallback={null}><ProductsPage /></Suspense>;
}
