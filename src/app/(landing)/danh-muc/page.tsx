import { redirect } from "next/navigation";

import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { reportCatalogError } from "@/landing/features/catalog/diagnostics";
import { routes } from "@/landing/lib/routes";

export default async function CategoriesIndexRoute() {
  const categories = await getCatalogCategories().catch((error) => {
    reportCatalogError("categories", "/api/v1/public/categories", error);
    throw error;
  });
  const firstCategory = categories[0];
  if (firstCategory) redirect(routes.category(firstCategory.slug));

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-surface px-margin pt-[var(--landing-header-height)]">
      <div className="max-w-lg rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-md">
        <h1 className="font-headline-md text-headline-md text-primary">Chưa có danh mục sản phẩm</h1>
        <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">Minh Sâm đang cập nhật các dòng bánh. Vui lòng quay lại sau.</p>
      </div>
    </main>
  );
}
