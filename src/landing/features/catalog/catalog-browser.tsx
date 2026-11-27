"use client";

import { CatalogToolbar } from "./catalog-controls";
import { CatalogEmptyState, CatalogErrorState } from "./components/listing/catalog-feedback";
import { Pagination as CatalogPagination } from "@/landing/components/ui/pagination";
import { ProductListGrid } from "./components/product/product-list-grid";
import { ProductGridSkeleton } from "./components/product/product-card-skeleton";
import type { useCatalogNavigation } from "./hooks/use-catalog-navigation";
import type { CatalogPage } from "./types";
import type { CatalogQuery } from "./query";

/** Keep the established public imports for Search and Product Detail. */
export { Pagination as CatalogPagination } from "@/landing/components/ui/pagination";
export { ProductCard } from "./components/product/product-card";

type CatalogBrowserProps = {
  navigation: ReturnType<typeof useCatalogNavigation>;
  page: CatalogPage | null;
  query: CatalogQuery;
};

export function CatalogBrowser({ navigation, page, query }: CatalogBrowserProps) {
  return (
    <div className="w-full min-w-0">
      {page ? (
        <>
          <div inert={navigation.pending}>
            <CatalogToolbar
              currentCount={page.products.length}
              totalCount={page.pagination.total}
              onChange={navigation.change}
              onReset={navigation.reset}
              query={query}
            />
          </div>
          {navigation.pending || page.products.length > 0 ? (
            <ProductListGrid products={page.products} pending={navigation.pending} />
          ) : (
            <CatalogEmptyState hasFilters={Boolean(query.q)} onReset={navigation.reset} />
          )}
          <div inert={navigation.pending}>
            <CatalogPagination
              onPage={(pageNumber) => navigation.change({ page: pageNumber })}
              pagination={page.pagination}
            />
          </div>
        </>
      ) : (
        navigation.pending ? <ProductGridSkeleton /> : <CatalogErrorState onRetry={navigation.retry} />
      )}
    </div>
  );
}
