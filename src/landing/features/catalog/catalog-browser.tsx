"use client";

import { CatalogToolbar } from "./catalog-controls";
import { CatalogEmptyState, CatalogErrorState } from "./components/catalog-feedback";
import { CatalogPagination } from "./components/catalog-pagination";
import { ProductCard } from "./components/product-card";
import { useCatalogNavigation } from "./hooks/use-catalog-navigation";
import type { CatalogPage } from "./types";
import type { CatalogQuery } from "./query";

/** Keep the established public imports for Search and Product Detail. */
export { CatalogPagination } from "./components/catalog-pagination";
export { ProductCard } from "./components/product-card";

type CatalogBrowserProps = {
  basePath: string;
  page: CatalogPage | null;
  query: CatalogQuery;
};

export function CatalogBrowser({ basePath, page, query }: CatalogBrowserProps) {
  const navigation = useCatalogNavigation(basePath, query);

  return (
    <div className="w-full min-w-0">
      {page ? (
        <>
          <CatalogToolbar
            currentCount={page.products.length}
            totalCount={page.pagination.total}
            onChange={navigation.change}
            onReset={navigation.reset}
            query={query}
          />
          {page.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
              {page.products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <CatalogEmptyState hasFilters={Boolean(query.q)} onReset={navigation.reset} />
          )}
          <CatalogPagination
            onPage={(pageNumber) => navigation.change({ page: pageNumber })}
            pagination={page.pagination}
          />
        </>
      ) : (
        <CatalogErrorState onRetry={navigation.retry} />
      )}
    </div>
  );
}
