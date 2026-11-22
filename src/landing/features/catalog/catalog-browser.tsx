"use client";

import {
  CakeSlice,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  Palette,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { CatalogFilterForm, CatalogToolbar } from "./catalog-controls";
import { boundedPagination, catalogQueryToSearchParams, updateCatalogQuery, type CatalogQuery } from "./query";
import type { CatalogCategory, CatalogPage, CatalogProduct } from "./types";

const quoteIcons = { calendar: CalendarDays, palette: Palette, cake: CakeSlice };

type CatalogBrowserProps = {
  basePath: string;
  categories: CatalogCategory[];
  categoryRouteSlug?: string;
  page: CatalogPage | null;
  query: CatalogQuery;
};

export function CatalogBrowser({ basePath, categories, categoryRouteSlug, page, query }: CatalogBrowserProps) {
  const router = useRouter();
  const typeOptions = categories.map(({ slug, name }) => ({ value: slug, label: name }));
  const includeCategory = categoryRouteSlug === undefined;

  const navigate = (path: string, next: CatalogQuery) => {
    const params = catalogQueryToSearchParams(next, { includeCategory: path === routes.products });
    router.push(`${path}${params.size ? `?${params}` : ""}`, { scroll: false });
  };
  const updateQuery = (patch: Partial<CatalogQuery>) => {
    const next = updateCatalogQuery(query, patch);
    navigate(basePath, next);
  };
  const changeCategory = (category: string | null) => {
    const next = { ...query, category, page: 1 };
    if (categoryRouteSlug !== undefined) navigate(category ? routes.category(category) : routes.products, next);
    else updateQuery({ category });
  };
  const resetQuery = () => {
    const next = { q: "", category: categoryRouteSlug ?? null, price: "all" as const, sort: "default" as const, page: 1 };
    navigate(basePath, next);
  };

  return <div className="flex flex-col items-start gap-gutter-desktop lg:flex-row">
    <aside className="w-full rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:sticky lg:top-28 lg:w-72 lg:shrink-0"><CatalogFilterForm onCategoryChange={changeCategory} onChange={updateQuery} onReset={resetQuery} query={query} typeOptions={typeOptions} /></aside>
    <div className="w-full min-w-0 flex-1">
      {page ? <>
        <CatalogToolbar currentCount={page.products.length} onChange={updateQuery} onReset={resetQuery} query={query} showCategoryChip={includeCategory} totalCount={page.pagination.total} typeOptions={typeOptions} />
        {page.products.length > 0 ? <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">{page.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <CatalogEmptyState hasFilters={Boolean(query.q || query.category || query.price !== "all")} onReset={resetQuery} />}
        <CatalogPagination onPage={(nextPage) => updateQuery({ page: nextPage })} pagination={page.pagination} />
      </> : <CatalogErrorState onRetry={() => router.refresh()} />}
    </div>
  </div>;
}

function CatalogEmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return <div className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm"><h3 className="font-headline-sm text-headline-sm text-primary">Chưa có sản phẩm phù hợp</h3><p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">Không tìm thấy sản phẩm khớp với tiêu chí hiện tại. Bạn có thể thử từ khóa hoặc bộ lọc khác.</p>{hasFilters ? <button className="mt-space-md rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-on-primary" onClick={onReset} type="button">Xóa bộ lọc</button> : null}</div>;
}

function CatalogErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm" role="alert"><h3 className="font-headline-sm text-headline-sm text-primary">Chưa thể tải danh sách sản phẩm</h3><p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau ít phút.</p><button className="mt-space-md rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-on-primary" onClick={onRetry} type="button">Thử lại</button></div>;
}

function CatalogPagination({ pagination, onPage }: { pagination: CatalogPage["pagination"]; onPage: (page: number) => void }) {
  if (pagination.totalPages <= 1) return pagination.total > 0 ? <div className="mt-space-xl text-center font-body-sm text-body-sm text-on-surface-variant">Trang 1 / 1</div> : null;
  const items = boundedPagination(pagination.page, pagination.totalPages);
  return <nav aria-label="Phân trang sản phẩm" className="mt-space-xl flex flex-col items-center gap-space-md pt-space-lg"><span className="font-body-sm text-body-sm text-on-surface-variant">Trang {pagination.page} / {pagination.totalPages}</span><div className="flex flex-wrap items-center justify-center gap-space-sm"><PageButton disabled={pagination.page === 1} label="Trang trước" onClick={() => onPage(pagination.page - 1)}><ChevronLeft className="size-[18px]" /></PageButton>{items.map((item) => typeof item === "number" ? <button aria-current={item === pagination.page ? "page" : undefined} className={`flex size-10 items-center justify-center rounded font-medium ${item === pagination.page ? "bg-primary text-secondary-fixed" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`} key={item} onClick={() => onPage(item)} type="button">{item}</button> : <span aria-hidden="true" className="px-1 text-outline" key={item}>…</span>)}<PageButton disabled={pagination.page === pagination.totalPages} label="Trang sau" onClick={() => onPage(pagination.page + 1)}><ChevronRight className="size-[18px]" /></PageButton></div></nav>;
}

function PageButton({ children, disabled, label, onClick }: { children: ReactNode; disabled: boolean; label: string; onClick: () => void }) {
  return <button aria-label={label} className={`flex size-10 items-center justify-center rounded ${disabled ? "cursor-not-allowed bg-surface-container-high text-outline" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  const pricing = product.pricing;
  const detailHref = routes.product(product.slug);
  const QuoteIcon = pricing.mode === "quote" ? quoteIcons[pricing.icon] : MessageSquare;
  return <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container"><SafeImage alt={product.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} />{product.badge && <span className={`absolute top-3 left-3 rounded px-2 py-0.5 font-label-eyebrow text-label-eyebrow uppercase shadow-sm ${product.badgeClassName}`}>{product.badge}</span>}</div>
    <div className="flex flex-1 flex-col justify-between p-space-md"><div><h3 className="mb-1 font-headline-sm text-headline-sm text-primary transition-colors group-hover:text-primary-container">{product.name}</h3><p className="mb-space-sm line-clamp-2 font-body-md text-body-md text-on-surface-variant">{product.description}</p></div><div className="mt-space-xs flex flex-col gap-space-sm pt-space-sm">
      {pricing.mode === "fixed" ? <div className="flex items-baseline justify-between"><span className="font-price-serif text-[18px] text-primary">{pricing.price}</span><span className="font-body-sm text-body-sm text-outline">{pricing.unit}</span></div> : <div className="flex items-center justify-between"><span className="flex items-center gap-1 font-label-ui text-label-ui font-semibold uppercase tracking-wider text-secondary"><QuoteIcon className="size-4" /> Liên hệ tư vấn</span><span className="font-body-sm text-body-sm text-outline">{pricing.detail}</span></div>}
      <div className="flex items-center gap-space-xs"><Link className={`flex flex-1 items-center justify-center gap-1 rounded px-space-sm py-2 font-label-ui text-label-ui uppercase tracking-wider transition-colors ${pricing.mode === "fixed" ? "bg-primary text-on-primary hover:bg-primary-container" : "bg-secondary text-on-secondary hover:bg-on-secondary-container"}`} href={detailHref}>{pricing.mode === "fixed" ? <ShoppingBag className="size-4" /> : <MessageSquare className="size-4" />}{pricing.mode === "fixed" ? "Mua ngay" : "Nhận tư vấn"}</Link><Link aria-label={`Xem chi tiết ${product.name}`} className="rounded p-2 text-primary transition-colors hover:bg-surface-container" href={detailHref}><Eye className="size-5" /></Link></div>
    </div></div>
  </article>;
}
