"use client";

import Link from "next/link";

import { SearchForm } from "@/landing/components/ui/search-form";
import type { CatalogCategory } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";

import { SearchFilterDrawer } from "./components/search-filter-drawer";
import { SearchFilterPanel } from "./components/search-filter-panel";
import { SearchMatchedCategories } from "./components/search-matched-categories";
import { SearchResults } from "./components/search-results";
import { useSearchNavigation } from "./hooks/use-search-navigation";
import type { SearchQuery } from "./query";
import type { GlobalSearchResults } from "./repository";

type SearchPageProps = {
  categories: CatalogCategory[];
  query: SearchQuery;
  results: GlobalSearchResults | null;
};

export function GlobalSearchPage({ categories, query, results }: SearchPageProps) {
  const { change, reset, retry } = useSearchNavigation(query);
  const matchedCategories = query.q ? results?.matchedCategories ?? [] : [];

  return (
    <main className="min-h-screen bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto w-full max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop" id="tim-kiem">
        <nav aria-label="Đường dẫn trang" className="mb-space-md flex gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link className="hover:text-primary" href={routes.home}>Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-primary">Tìm kiếm</span>
        </nav>
        <div className="mb-space-lg">
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">KHÁM PHÁ MINH SÂM BAKERY</span>
          <h1 className="mt-space-xs font-headline-lg text-headline-md text-primary lg:text-headline-lg">Tìm bánh theo cách của bạn</h1>
          <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
            Tìm theo tên, hương vị hoặc danh mục bánh yêu thích.
          </p>
        </div>
        <div className="mb-space-xl max-w-3xl">
          <SearchForm
            ariaLabel="Tìm kiếm sản phẩm và danh mục"
            placeholder="Tìm bánh, hộp quà..."
            value={query.q}
            onSearch={(q) => change({ q })}
          />
        </div>

        <SearchMatchedCategories categories={matchedCategories} />

        <div className="flex flex-col items-start gap-gutter-desktop lg:flex-row">
          <aside aria-label="Bộ lọc sản phẩm" className="hidden w-72 shrink-0 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <SearchFilterPanel
              categories={categories}
              query={query}
              onChange={change}
              onReset={reset}
              radioPrefix="desktop"
            />
          </aside>
          <div className="w-full min-w-0 flex-1">
            <SearchFilterDrawer categories={categories} query={query} onChange={change} onReset={reset} />
            <SearchResults
              categories={categories}
              query={query}
              results={results}
              onChange={change}
              onReset={reset}
              onRetry={retry}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
