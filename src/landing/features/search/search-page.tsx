"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductCard, CatalogPagination } from "@/landing/features/catalog/catalog-browser";
import { CatalogSearchForm } from "@/landing/features/catalog/catalog-controls";
import type { CatalogCategory } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";

import {
  searchQueryToSearchParams,
  updateSearchQuery,
  type SearchPrice,
  type SearchQuery,
  type SearchSort,
} from "./query";
import type { GlobalSearchResults } from "./repository";

const PRICE_OPTIONS: Array<{ value: SearchPrice; label: string }> = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-200", label: "Dưới 200.000đ" },
  { value: "200-500", label: "200.000đ – 500.000đ" },
  { value: "over-500", label: "Trên 500.000đ" },
];

const SORT_OPTIONS: Array<{ value: SearchSort; label: string }> = [
  { value: "recent", label: "Mới đăng" },
  { value: "price-asc", label: "Giá niêm yết tăng dần" },
  { value: "price-desc", label: "Giá niêm yết giảm dần" },
];

type SearchPageProps = {
  categories: CatalogCategory[];
  query: SearchQuery;
  results: GlobalSearchResults | null;
};

export function GlobalSearchPage({ categories, query, results }: SearchPageProps) {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const navigate = (next: SearchQuery) => {
    const params = searchQueryToSearchParams(next);
    router.push(routes.search + (params.size ? "?" + params.toString() : ""), { scroll: false });
  };
  const update = (patch: Partial<SearchQuery>) => {
    navigate(updateSearchQuery(query, patch));
  };
  const reset = () => {
    navigate({ q: "", category: null, price: "all", sort: "recent", page: 1 });
  };
  const updateAndClose = (patch: Partial<SearchQuery>) => {
    setFiltersOpen(false);
    update(patch);
  };
  const resetAndClose = () => {
    setFiltersOpen(false);
    reset();
  };

  const products = results?.page.products ?? [];
  const pagination = results?.page.pagination;
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
          <CatalogSearchForm
            ariaLabel="Tìm kiếm sản phẩm và danh mục"
            placeholder="Tìm bánh, hộp quà..."
            value={query.q}
            onSearch={(q) => update({ q })}
          />
        </div>

        {matchedCategories.length > 0 && (
          <section aria-label="Danh mục phù hợp" className="mb-space-xl rounded-xl bg-surface-container-low p-space-md">
            <h2 className="mb-space-sm font-headline-sm text-headline-sm text-primary">Danh mục phù hợp</h2>
            <div className="flex flex-wrap gap-space-sm">
              {matchedCategories.map((category) => (
                <Link
                  className="rounded-full border border-outline-variant bg-surface-container-lowest px-space-md py-2 font-label-ui text-label-ui text-primary transition-colors hover:bg-surface-container-high"
                  href={routes.category(category.slug)}
                  key={category.slug}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col items-start gap-gutter-desktop lg:flex-row">
          <aside aria-label="Bộ lọc sản phẩm" className="hidden w-72 shrink-0 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <SearchFilterPanel categories={categories} query={query} onChange={update} onReset={reset} />
          </aside>

          <div className="w-full min-w-0 flex-1">
            <div className="mb-space-md flex justify-end lg:hidden">
              <Dialog.Root open={filtersOpen} onOpenChange={setFiltersOpen}>
                <Dialog.Trigger asChild>
                  <button
                    className="inline-flex min-h-11 items-center justify-end gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-2 font-label-ui text-label-ui text-primary shadow-sm"
                    type="button"
                  >
                    <SlidersHorizontal className="size-5" aria-hidden="true" />
                    Bộ lọc
                    {(query.category || query.price !== "all") ? (
                      <span className="rounded-full bg-secondary-container px-2 text-body-sm text-primary">Đang lọc</span>
                    ) : null}
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60" />
                  <Dialog.Content className="fixed inset-y-0 right-0 z-[71] flex w-[min(90vw,370px)] flex-col bg-surface-container-lowest shadow-2xl">
                    <div className="flex items-center justify-between border-b border-outline-variant px-space-lg py-space-md">
                      <Dialog.Title className="font-headline-sm text-headline-sm text-primary">Bộ lọc sản phẩm</Dialog.Title>
                      <Dialog.Close aria-label="Đóng bộ lọc" className="rounded-lg p-2 text-primary hover:bg-surface-container" type="button">
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Description className="sr-only">Chọn danh mục và khoảng giá để lọc sản phẩm.</Dialog.Description>
                    <div className="min-h-0 flex-1 overflow-y-auto p-space-lg">
                      <SearchFilterPanel categories={categories} query={query} onChange={updateAndClose} onReset={resetAndClose} hideHeading />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>

            {results ? (
              <>
                <SearchResultsToolbar
                  query={query}
                  categories={categories}
                  currentCount={products.length}
                  totalCount={pagination?.total ?? 0}
                  onChange={update}
                  onReset={reset}
                />
                {products.length ? (
                  <div aria-label="Sản phẩm tìm thấy" className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                  </div>
                ) : (
                  <SearchEmptyState hasFilters={Boolean(query.q || query.category || query.price !== "all")} onReset={reset} />
                )}
                {pagination ? <CatalogPagination pagination={pagination} onPage={(page) => update({ page })} /> : null}
              </>
            ) : (
              <div role="alert" className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm">
                <h2 className="font-headline-sm text-headline-sm text-primary">Chưa thể tải kết quả tìm kiếm</h2>
                <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">Vui lòng thử lại sau ít phút.</p>
                <button className="mt-space-md rounded-lg bg-primary px-space-lg py-2.5 font-label-ui text-on-primary" onClick={() => router.refresh()} type="button">Thử lại</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function SearchFilterPanel({
  categories, query, onChange, onReset, hideHeading = false,
}: {
  categories: CatalogCategory[];
  query: SearchQuery;
  onChange: (patch: Partial<SearchQuery>) => void;
  onReset: () => void;
  hideHeading?: boolean;
}) {
  return (
    <div className="min-w-0">
      {!hideHeading && (
        <div className="flex items-center justify-between gap-space-sm pb-space-md">
          <div className="flex items-center gap-space-xs">
            <SlidersHorizontal className="size-5 text-secondary" aria-hidden="true" />
            <h2 className="font-headline-sm text-headline-sm text-primary">Bộ lọc</h2>
          </div>
          <button className="font-body-sm text-body-sm text-secondary underline" onClick={onReset} type="button">Đặt lại</button>
        </div>
      )}
      <fieldset className="flex flex-col gap-space-sm border-b border-outline-variant py-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Danh mục</legend>
        <FilterRadio label="Tất cả loại bánh" checked={query.category === null} name="search-category" onChange={() => onChange({ category: null })} />
        {categories.map((category) => (
          <FilterRadio
            key={category.slug}
            label={category.name}
            checked={query.category === category.slug}
            name="search-category"
            onChange={() => onChange({ category: category.slug })}
          />
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-space-sm py-space-md mt-space-md">
        <legend className="mb-space-sm font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-primary">Khoảng giá niêm yết</legend>
        {PRICE_OPTIONS.map((item) => (
          <FilterRadio key={item.value} label={item.label} checked={query.price === item.value} name="search-price" onChange={() => onChange({ price: item.value })} />
        ))}
      </fieldset>
      <button className="mt-space-md w-full rounded-lg bg-surface-container px-space-md py-2.5 font-label-ui text-label-ui text-primary hover:bg-surface-container-high" type="button" onClick={onReset}>
        Thiết lập lại bộ lọc
      </button>
    </div>
  );
}

function FilterRadio({ label, name, checked, onChange }: {
  label: string; name: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer items-center gap-space-sm">
      <input className="size-4 shrink-0 accent-primary" name={name} type="radio" checked={checked} onChange={onChange} />
      <span className="min-w-0 break-words font-body-md text-body-md text-on-surface">{label}</span>
    </label>
  );
}

function SearchResultsToolbar({ query, categories, currentCount, totalCount, onChange, onReset }: {
  query: SearchQuery;
  categories: CatalogCategory[];
  currentCount: number;
  totalCount: number;
  onChange: (patch: Partial<SearchQuery>) => void;
  onReset: () => void;
}) {
  const selectedCategory = categories.find((item) => item.slug === query.category);
  const chips = [
    query.q ? { key: "q", label: "“" + query.q + "”", clear: () => onChange({ q: "" }) } : null,
    selectedCategory ? { key: "category", label: selectedCategory.name, clear: () => onChange({ category: null }) } : null,
    query.price !== "all" ? {
      key: "price",
      label: PRICE_OPTIONS.find((item) => item.value === query.price)?.label ?? query.price,
      clear: () => onChange({ price: "all" }),
    } : null,
  ].filter((chip): chip is { key: string; label: string; clear: () => void } => chip !== null);

  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm md:flex-row md:items-center">
      <div className="flex min-w-0 flex-col gap-space-sm">
        <span className="font-body-md text-body-md font-semibold text-primary">
          Hiển thị {currentCount} trên {totalCount} sản phẩm phù hợp
        </span>
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-space-xs">
            {chips.map((chip) => (
              <span className="inline-flex max-w-full items-center gap-1 rounded bg-surface-container-high px-2.5 py-1 font-body-sm text-body-sm text-primary" key={chip.key}>
                <span className="min-w-0 break-all">{chip.label}</span>
                <button aria-label={"Xóa " + chip.label} className="shrink-0" onClick={chip.clear} type="button"><X className="size-3.5" /></button>
              </span>
            ))}
            <button className="font-label-ui text-body-sm text-secondary underline" onClick={onReset} type="button">Xóa tất cả</button>
          </div>
        )}
      </div>
      <label className="flex shrink-0 items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
        Sắp xếp:
        <span className="relative">
          <select
            aria-label="Sắp xếp sản phẩm"
            className="cursor-pointer appearance-none rounded-lg bg-surface-container-low py-2 pr-8 pl-3 font-body-sm text-body-sm text-on-surface"
            value={query.sort}
            onChange={(event) => onChange({ sort: event.target.value as SearchSort })}
          >
            {SORT_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-outline" />
        </span>
      </label>
    </div>
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
