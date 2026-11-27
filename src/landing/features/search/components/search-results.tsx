import { Search } from "lucide-react";

import { Pagination } from "@/landing/components/ui/pagination";
import { ProductGridSkeleton } from "@/landing/features/catalog/components/product/product-card-skeleton";
import { ProductListGrid } from "@/landing/features/catalog/components/product/product-list-grid";
import type { CatalogCategory } from "@/landing/features/catalog/types";

import type { SearchQuery } from "../query";
import type { GlobalSearchResults } from "../repository";
import type { SearchFilterActions } from "./search-filter-panel";
import { SearchResultsToolbar } from "./search-results-toolbar";

type SearchResultsProps = SearchFilterActions & {
  categories: CatalogCategory[];
  query: SearchQuery;
  results: GlobalSearchResults | null;
  onRetry: () => void;
  pending?: boolean;
};

export function SearchResults({
  categories, query, results, onChange, onReset, onRetry, pending = false,
}: SearchResultsProps) {
  if (!results) {
    if (pending) return <ProductGridSkeleton />;
    return (
      <div role="alert" className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-primary">Chưa thể tải kết quả tìm kiếm</h2>
        <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">Vui lòng thử lại sau ít phút.</p>
        <button className="mt-space-md rounded-lg bg-primary px-space-lg py-2.5 font-label-ui text-on-primary" onClick={onRetry} type="button">
          Thử lại
        </button>
      </div>
    );
  }

  const products = results.page.products;
  const pagination = results.page.pagination;
  const hasFilters = Boolean(query.q || query.category || query.price !== "all");

  return (
    <>
      <div inert={pending}>
        <SearchResultsToolbar
          query={query}
          categories={categories}
          currentCount={products.length}
          totalCount={pagination.total}
          onChange={onChange}
          onReset={onReset}
        />
      </div>
      {pending || products.length ? (
        <ProductListGrid products={products} pending={pending} />
      ) : (
        <SearchEmptyState hasFilters={hasFilters} onReset={onReset} />
      )}
      <div inert={pending}><Pagination pagination={pagination} onPage={(page) => onChange({ page })} /></div>
    </>
  );
}

function SearchEmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm">
      <Search aria-hidden="true" className="mx-auto mb-space-sm size-7 text-secondary" />
      <h2 className="font-headline-sm text-headline-sm text-primary">Chưa có sản phẩm phù hợp</h2>
      <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">Bạn có thể thử từ khóa hoặc điều chỉnh bộ lọc khác.</p>
      {hasFilters && (
        <button className="mt-space-md rounded-lg bg-primary px-space-lg py-2.5 font-label-ui text-on-primary" type="button" onClick={onReset}>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
