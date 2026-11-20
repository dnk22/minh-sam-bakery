import { Suspense } from "react";

import { CategoriesPage } from "@/cms/features/categories/components/categories-page/categories-page";

export default function CmsCategoriesPage() {
  return <Suspense fallback={null}><CategoriesPage /></Suspense>;
}
