"use client";

import Link from "next/link";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { ProductActions } from "./product-actions";
import { ProductPrice } from "./product-price";
import type { CatalogProduct } from "../types";

export function CrossCategoryDiscovery({ products }: { products: CatalogProduct[] }) {
  const primaryProduct = products.find((product) => product.isFeatured) ?? products[0];
  if (!primaryProduct) return null;
  const supportingProducts = products.filter((product) => product.id !== primaryProduct.id).slice(0, 3);
  return (
    <section className="w-full bg-surface-container-low px-gutter py-space-xl lg:px-gutter-desktop">
      <div className="mx-auto max-w-[1360px] px-gutter lg:px-gutter-desktop">
        <div className="mb-space-lg"><h2 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">Khám phá thêm hương vị</h2></div>
        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
          <article className={`group relative flex flex-col justify-between overflow-hidden rounded bg-surface-container-lowest shadow-md ${supportingProducts.length ? "lg:col-span-6" : "lg:col-span-12"}`}>
            <Link aria-label={`Xem chi tiết ${primaryProduct.name}`} className="absolute inset-0 z-10" href={routes.product(primaryProduct.categorySlug, primaryProduct.slug)} />
            <div className="relative h-[340px] overflow-hidden bg-primary lg:h-[380px]">
              <SafeImage alt={primaryProduct.imageAlt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={primaryProduct.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              {primaryProduct.isBestSeller || primaryProduct.isFeatured ? <div className="absolute top-4 left-4"><span className="rounded bg-secondary px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-secondary shadow">{primaryProduct.isBestSeller ? "SẢN PHẨM BÁN CHẠY" : "SẢN PHẨM NỔI BẬT"}</span></div> : null}
              <div className="absolute right-4 bottom-4 left-4 text-surface-bright"><span className="font-label-eyebrow text-[10px] uppercase tracking-widest text-secondary-fixed">{primaryProduct.sku ? `MÃ SP: ${primaryProduct.sku}` : "MINH SÂM BAKERY"}</span></div>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-space-md p-space-lg">
              <div><h3 className="mt-1 font-headline-lg text-headline-sm text-primary lg:text-headline-md">{primaryProduct.name}</h3>{primaryProduct.description ? <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{primaryProduct.description}</p> : null}</div>
              <div className="flex flex-col justify-between gap-space-sm pt-space-md sm:flex-row sm:items-center">
                <div><span className="block font-label-eyebrow text-[11px] uppercase text-outline">GIÁ HIỆN TẠI</span><ProductPrice pricing={primaryProduct.pricing} /></div>
                <div className="relative z-20 w-full sm:max-w-[240px]"><ProductActions product={primaryProduct} compact /></div>
              </div>
            </div>
          </article>
          {supportingProducts.length ? <div className="flex flex-col justify-between gap-space-md lg:col-span-6">
            {supportingProducts.map((product) => <article className="group relative flex flex-col items-center gap-space-md rounded bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md sm:flex-row" key={product.id}>
              <Link aria-label={`Xem chi tiết ${product.name}`} className="absolute inset-0 z-10" href={routes.product(product.categorySlug, product.slug)} />
              <div className="h-36 w-full shrink-0 overflow-hidden rounded bg-surface-container sm:w-36"><SafeImage alt={product.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} /></div>
              <div className="flex w-full flex-1 flex-col justify-between"><div><div className="flex items-center justify-between gap-2"><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase text-secondary">{product.isBestSeller ? "BÁN CHẠY" : product.isFeatured ? "NỔI BẬT" : "SẢN PHẨM MINH SÂM"}</span><ProductPrice pricing={product.pricing} compact /></div><h3 className="mt-0.5 font-headline-sm text-subheading text-primary group-hover:text-secondary">{product.name}</h3>{product.description ? <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{product.description}</p> : null}</div><div className="mt-space-xs flex items-center justify-between pt-space-sm"><span className="font-body-sm text-body-sm text-outline">{product.sku ? `Mã SP: ${product.sku}` : "Minh Sâm Bakery"}</span><div className="relative z-20 w-full max-w-[235px]"><ProductActions product={product} compact /></div></div></div>
            </article>)}
          </div> : null}
        </div>
      </div>
    </section>
  );
}
