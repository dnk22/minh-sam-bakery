"use client";

import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { CatalogBrowser } from "./catalog-browser";
import { CatalogSearchForm } from "./catalog-controls";
import { catalogQueryToSearchParams, type CatalogQuery } from "./query";
import type { CatalogCategory, CatalogPage, CatalogProduct } from "./types";

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
  const router = useRouter();
  const basePath = routes.category(category.slug);
  const updateSearch = (q: string) => {
    const next = { ...query, q, page: 1 };
    const params = catalogQueryToSearchParams(next);
    router.push(`${basePath}${params.size ? `?${params}` : ""}#danh-muc`, { scroll: false });
  };

  return (
    <main className="min-h-[calc(100vh-500px)] w-full bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto w-full max-w-[1360px] scroll-mt-[var(--landing-header-height)] px-gutter py-space-xl lg:px-gutter-desktop" id="danh-muc">
        <nav aria-label="Đường dẫn trang" className="mb-space-md flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <Link className="transition-colors hover:text-primary" href={routes.home}>Trang chủ</Link>
          <span className="text-outline-variant">/</span>
          <span aria-current="page" className="font-semibold text-primary">{category.name}</span>
        </nav>
        <SectionHeading
          description={category.description || "Khám phá các sản phẩm được làm thủ công trong dòng bánh này."}
          eyebrow="DANH MỤC SẢN PHẨM MINH SÂM"
          title={`Khám phá ${category.name}`}
        />
        <div className="mb-space-lg max-w-3xl">
          <CatalogSearchForm ariaLabel={`Tìm sản phẩm trong ${category.name}`} onSearch={updateSearch} placeholder={`Tìm sản phẩm trong ${category.name}...`} value={query.q} />
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

function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-xs md:flex-row md:items-end">
      <div>
        {eyebrow ? <div className="mb-1 flex items-center gap-2 text-secondary"><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-[0.2em]">{eyebrow}</span></div> : null}
        <h1 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">{title}</h1>
      </div>
      {description ? <p className="max-w-md font-body-md text-body-md text-on-surface-variant">{description}</p> : null}
    </div>
  );
}

export function CrossCategoryDiscovery({ products }: { products: CatalogProduct[] }) {
  const primaryProduct = products.find((product) => product.isFeatured) ?? products[0];
  if (!primaryProduct) return null;
  const supportingProducts = products.filter((product) => product.id !== primaryProduct.id).slice(0, 3);
  return (
    <section className="w-full bg-surface-container-low px-gutter py-space-xl lg:px-gutter-desktop">
      <div className="mx-auto max-w-[1360px] px-gutter lg:px-gutter-desktop">
        <div className="mb-space-lg"><h2 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">Khám phá thêm hương vị</h2></div>
        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
          <article className={`group flex flex-col justify-between overflow-hidden rounded bg-surface-container-lowest shadow-md ${supportingProducts.length ? "lg:col-span-6" : "lg:col-span-12"}`}>
            <div className="relative h-[340px] overflow-hidden bg-primary lg:h-[380px]">
              <SafeImage alt={primaryProduct.imageAlt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={primaryProduct.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              {primaryProduct.isBestSeller || primaryProduct.isFeatured ? <div className="absolute top-4 left-4"><span className="rounded bg-secondary px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-secondary shadow">{primaryProduct.isBestSeller ? "SẢN PHẨM BÁN CHẠY" : "SẢN PHẨM NỔI BẬT"}</span></div> : null}
              <div className="absolute right-4 bottom-4 left-4 text-surface-bright"><span className="font-label-eyebrow text-[10px] uppercase tracking-widest text-secondary-fixed">{primaryProduct.sku ? `MÃ SP: ${primaryProduct.sku}` : "MINH SÂM BAKERY"}</span></div>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-space-md p-space-lg">
              <div><h3 className="mt-1 font-headline-lg text-headline-sm text-primary lg:text-headline-md">{primaryProduct.name}</h3>{primaryProduct.description ? <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{primaryProduct.description}</p> : null}</div>
              <div className="flex flex-col justify-between gap-space-sm pt-space-md sm:flex-row sm:items-center">
                <div><span className="block font-label-eyebrow text-[11px] uppercase text-outline">GIÁ HIỆN TẠI</span><span className="font-headline-sm text-subheading font-semibold text-secondary">{catalogPrice(primaryProduct)}</span></div>
                <Link className="rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-secondary-fixed shadow-sm hover:bg-primary-container" href={routes.product(primaryProduct.categorySlug, primaryProduct.slug)}>Xem chi tiết</Link>
              </div>
            </div>
          </article>
          {supportingProducts.length ? <div className="flex flex-col justify-between gap-space-md lg:col-span-6">
            {supportingProducts.map((product) => <article className="group flex flex-col items-center gap-space-md rounded bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md sm:flex-row" key={product.id}>
              <div className="h-36 w-full shrink-0 overflow-hidden rounded bg-surface-container sm:w-36"><SafeImage alt={product.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} /></div>
              <div className="flex w-full flex-1 flex-col justify-between"><div><div className="flex items-center justify-between gap-2"><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase text-secondary">{product.isBestSeller ? "BÁN CHẠY" : product.isFeatured ? "NỔI BẬT" : "SẢN PHẨM MINH SÂM"}</span><span className="font-price-serif text-price-serif font-bold text-primary">{catalogPrice(product)}</span></div><h3 className="mt-0.5 font-headline-sm text-subheading text-primary group-hover:text-secondary">{product.name}</h3>{product.description ? <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{product.description}</p> : null}</div><div className="mt-space-xs flex items-center justify-between pt-space-sm"><span className="font-body-sm text-body-sm text-outline">{product.sku ? `Mã SP: ${product.sku}` : "Minh Sâm Bakery"}</span><Link className="flex items-center gap-1 rounded bg-primary px-space-md py-1.5 font-label-ui text-label-ui text-secondary-fixed" href={routes.product(product.categorySlug, product.slug)}>Xem chi tiết <ArrowRight className="size-4" /></Link></div></div>
            </article>)}
          </div> : null}
        </div>
      </div>
    </section>
  );
}

function catalogPrice(product: CatalogProduct) {
  return product.pricing.mode === "fixed" ? product.pricing.price : "Liên hệ tư vấn";
}
