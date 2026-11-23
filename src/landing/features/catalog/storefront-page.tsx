"use client";

import { BadgeCheck } from "lucide-react";
import Link from "next/link";

import { routes } from "@/landing/lib/routes";

import { CatalogBrowser } from "./catalog-browser";
import { CatalogSearchForm } from "./catalog-controls";
import { CatalogSectionHeading } from "./components/catalog-section-heading";
import { CrossCategoryDiscovery } from "./components/cross-category-discovery";
import { useCatalogNavigation } from "./hooks/use-catalog-navigation";
import type { CatalogCategory, CatalogPage, CatalogProduct } from "./types";
import type { CatalogQuery } from "./query";

/** Preserve the public cross-category component export. */
export { CrossCategoryDiscovery } from "./components/cross-category-discovery";

export function CategoryStorefrontPage({
  category,
  page,
  query,
  crossCategoryProducts,
}: {
  category: CatalogCategory;
  page: CatalogPage | null;
  query: CatalogQuery;
  crossCategoryProducts: CatalogProduct[];
}) {
  const basePath = routes.category(category.slug);
  const navigation = useCatalogNavigation(basePath, query, "#danh-muc");

  return (
    <main className="min-h-[calc(100vh-500px)] w-full bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto w-full max-w-[1360px] scroll-mt-[var(--landing-header-height)] px-gutter py-space-xl lg:px-gutter-desktop" id="danh-muc">
        <nav aria-label="Đường dẫn trang" className="mb-space-md flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link className="transition-colors hover:text-primary" href={routes.home}>Trang chủ</Link>
          <span className="text-outline-variant">/</span>
          <span aria-current="page" className="font-semibold text-primary">{category.name}</span>
        </nav>
        <CatalogSectionHeading
          description={category.description || "Khám phá các sản phẩm được làm thủ công trong dòng bánh này."}
          eyebrow="DANH MỤC SẢN PHẨM MINH SÂM"
          title={`Khám phá ${category.name}`}
        />
        <div className="mb-space-lg max-w-3xl">
          <CatalogSearchForm
            ariaLabel={`Tìm sản phẩm trong ${category.name}`}
            onSearch={(q) => navigation.change({ q })}
            placeholder={`Tìm sản phẩm trong ${category.name}...`}
            value={query.q}
          />
        </div>
        <CatalogBrowser basePath={basePath} page={page} query={query} />
      </section>

      <CrossCategoryDiscovery products={crossCategoryProducts} />

      <div className="w-full bg-surface-container-highest/80 px-gutter py-space-sm text-center shadow-inner backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] items-center justify-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <BadgeCheck className="size-[18px] shrink-0 text-secondary" />
          <span>Cam kết nguyên liệu thuần khiết, không chất bảo quản công nghiệp • Giao nhanh 2h tại nội thành Hà Nội</span>
        </div>
      </div>
    </main>
  );
}
