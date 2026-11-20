import { Suspense } from "react";

import { CategoriesPage } from "@/cms/features/categories/components";

export default function CmsCategoriesPage() {
  return <Suspense fallback={null}><CategoriesPage /></Suspense>;
}
