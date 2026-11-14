/* eslint-disable @next/next/no-img-element */
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import type { FixedPriceProductDetail, PresentationCard } from "../types";
import { FixedPricePurchaseExperience } from "./fixed-price-purchase-experience";
import { ProductBreadcrumb } from "./product-breadcrumb";

export function FixedPriceProductPage({ product }: { product: FixedPriceProductDetail }) {
  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface pt-[var(--landing-header-height)]">
      <ProductBreadcrumb categoryHref={`/danh-muc/${product.catalog.categorySlug}`} categoryLabel={product.categoryLabel} productName={product.catalog.name} />
      <FixedPricePurchaseExperience product={product} />

      <section className="mx-auto w-full max-w-[1360px] px-margin py-space-xl md:px-margin-tablet lg:px-margin-desktop">
        <div className="mb-space-md flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">{product.presentation.pairingEyebrow}</span><h2 className="mt-1 font-headline-lg text-headline-md text-primary">{product.presentation.pairingTitle}</h2></div><p className="max-w-md font-body-sm text-body-sm text-on-surface-variant">{product.presentation.pairingDescription}</p></div>
        <div className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-3">{product.complementaryProducts.map((card) => <ComplementaryCard card={card} key={card.title} />)}</div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-margin pb-space-xl md:px-margin-tablet lg:px-margin-desktop">
        <div className="mb-space-md flex items-center justify-between"><div><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">BỘ SƯU TẬP TƯƠNG ĐỒNG</span><h2 className="mt-1 font-headline-md text-headline-md text-primary">Có Thể Bạn Cũng Thích</h2></div><Link className="flex items-center gap-1 font-label-ui text-body-sm font-semibold text-primary hover:text-on-primary-container" href="/san-pham">Xem tất cả sản phẩm <ChevronRight className="size-[18px]" /></Link></div>
        <div className="grid grid-cols-2 gap-gutter-desktop md:grid-cols-4">{product.relatedProducts.map((card) => <RelatedProductCard card={card} key={card.title} />)}</div>
      </section>
    </main>
  );
}

function ComplementaryCard({ card }: { card: PresentationCard }) {
  return <article className="group flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md"><div><div className="relative mb-space-sm aspect-[16/10] overflow-hidden rounded-lg bg-surface-container-low"><img alt={card.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={card.image} />{card.badge ? <span className="absolute top-2 left-2 rounded-sm bg-surface/90 px-2 py-0.5 font-label-eyebrow text-[10px] uppercase tracking-wider text-primary">{card.badge}</span> : null}</div><span className="font-label-eyebrow text-[11px] font-semibold uppercase text-secondary">{card.eyebrow}</span><h3 className="mt-1 font-headline-sm text-subheading font-semibold text-primary">{card.title}</h3><p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{card.description}</p></div><div className="mt-space-md flex items-center justify-between pt-space-xs"><span className="font-price-serif text-price-serif font-semibold text-primary">{card.price}</span><span aria-disabled="true" className="flex items-center gap-1 rounded-md bg-surface-container px-3 py-1.5 font-label-ui text-body-sm font-semibold text-primary shadow-sm"><Plus className="size-4" /> Tùy chọn bổ trợ</span></div></article>;
}

function RelatedProductCard({ card }: { card: PresentationCard }) {
  const content = <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md"><div className="relative aspect-square overflow-hidden bg-surface-container-low"><img alt={card.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={card.image} />{card.badge ? <span className="absolute top-2 left-2 rounded-sm bg-surface/90 px-2 py-0.5 font-label-eyebrow text-[10px] text-primary">{card.badge}</span> : null}</div><div className="flex flex-1 flex-col justify-between p-3.5"><div><h3 className="font-headline-sm text-[16px] leading-snug text-primary transition-colors group-hover:text-primary-container">{card.title}</h3><p className="mt-1 line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">{card.description}</p></div><div className="mt-3 flex items-center justify-between pt-2"><span className="font-price-serif text-price-serif font-bold text-primary">{card.price}</span><span className="flex size-7 items-center justify-center rounded-full bg-surface-container-low text-primary"><ArrowRight className="size-4" /></span></div></div></article>;
  return card.href ? <Link href={card.href}>{content}</Link> : content;
}
