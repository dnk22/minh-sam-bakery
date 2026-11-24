"use client";

import { ArrowRight, BadgeCheck, CheckCircle2, Package, RefreshCw, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { QuantityStepper } from "@/landing/components/ui/quantity-stepper";
import { useRouter } from "next/navigation";
import { createCartLine } from "@/landing/features/cart/selection";
import { saveBuyNowIntent } from "@/landing/features/checkout/store/checkout-intent";
import { routes } from "@/landing/lib/routes";

import type { FixedPriceProductDetail } from "../types";
import { ProductGallery } from "./product-gallery";

const formatVnd = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;

export function FixedPricePurchaseExperience({ product }: { product: FixedPriceProductDetail }) {
  const router = useRouter();
  const [purchaseError, setPurchaseError] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(product.pricing.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = product.pricing.variants.find((variant) => variant.id === selectedVariantId) ?? product.pricing.variants[0];
  const total = (selectedVariant?.price ?? 0) * quantity;
  const selectedCatalogVariant = product.catalog.pricing.variants.find((variant) => variant.id === selectedVariant?.id);
  const checkoutAvailable = product.presentation.checkoutAvailable !== false && Boolean(selectedCatalogVariant && !selectedCatalogVariant.isSynthetic);

  const handlePurchase = () => {
    if (!checkoutAvailable || !selectedCatalogVariant) return;
    const line = createCartLine(product.catalog, selectedCatalogVariant, quantity);
    if (!saveBuyNowIntent(line)) {
      setPurchaseError("Không thể lưu thông tin đặt hàng. Vui lòng kiểm tra cài đặt trình duyệt.");
      return;
    }
    setPurchaseError("");
    router.push(routes.checkout);
  };


  return (
    <>
      <section className="mx-auto w-full max-w-[1360px] px-margin pt-space-sm pb-space-xl md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12">
          <div className="lg:col-span-7"><ProductGallery heroImage={product.heroImage} images={product.gallery} /></div>
          <div className="sticky top-24 flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-lg md:p-space-lg lg:col-span-5">
            <div className="flex flex-col gap-1"><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-widest text-secondary">{product.presentation.eyebrow}</span><h1 className="mt-1 font-headline-lg text-headline-md leading-snug tracking-tight text-primary sm:text-headline-lg">{product.catalog.name}</h1><p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{product.catalog.description}</p></div>
            <div className="mt-space-md flex items-baseline justify-between rounded-lg bg-surface-container-low px-4 py-3"><div className="flex items-baseline gap-2"><span className="font-price-serif text-[32px] leading-tight font-semibold text-primary">{formatVnd(total)}</span>{selectedVariant?.hasDiscount ? <del className="font-body-sm text-body-sm text-outline">{formatVnd(selectedVariant.originalPrice * quantity)}</del> : null}<span className="font-body-sm text-body-sm text-outline-variant">{product.presentation.priceUnitLabel}</span></div><span className="font-body-sm text-body-sm font-medium text-secondary">{product.presentation.productionNote}</span></div>
            <div className="mt-space-md flex flex-col gap-2"><span className="font-label-ui text-label-ui font-semibold uppercase tracking-wider text-on-surface">Chọn quy cách đóng gói</span><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{product.pricing.variants.map((variant) => { const selected = variant.id === selectedVariantId; return <button aria-pressed={selected} className={`flex cursor-pointer flex-col justify-between rounded-lg p-3 text-left transition-all ${selected ? "bg-surface-container text-primary shadow-sm ring-2 ring-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"}`} key={variant.id} onClick={() => setSelectedVariantId(variant.id)} type="button"><span className="flex items-center justify-between"><span className="font-label-ui text-label-ui font-semibold">{variant.label}</span><CheckCircle2 className={`size-4 ${selected ? "opacity-100" : "opacity-0"}`} /></span><span className="mt-2 font-price-serif text-price-serif font-bold text-primary">{formatVnd(variant.price)}</span>{variant.hasDiscount ? <del className="mt-1 font-body-sm text-[12px] text-outline">{formatVnd(variant.originalPrice)}</del> : null}</button>; })}</div></div>
            <div className="mt-space-md flex items-center justify-between py-1"><div className="flex flex-col"><span className="font-label-ui text-label-ui font-semibold uppercase tracking-wider text-on-surface">Số lượng</span><span className="mt-0.5 font-body-sm text-[12px] text-secondary">{product.presentation.availabilityNote}</span></div><QuantityStepper value={quantity} onChange={setQuantity} size="sm" appearance="raised" subject={product.catalog.name} /></div>
            <div className="mt-space-lg flex flex-col gap-2.5">
              <button
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-3.5 font-label-ui text-[15px] font-bold uppercase tracking-widest text-secondary-fixed shadow-md transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!checkoutAvailable}
                onClick={handlePurchase}
                type="button"
              >
                {checkoutAvailable ? "ĐẶT HÀNG" : "ĐẶT HÀNG ĐANG CẬP NHẬT"}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              {purchaseError ? <p className="font-body-sm text-body-sm text-error" role="alert">{purchaseError}</p> : null}
              {!checkoutAvailable ? (
                <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                  {product.presentation.checkoutUnavailableMessage}
                </p>
              ) : null}
            </div>
            <div className="mt-space-md grid grid-cols-3 gap-2 border-t border-outline-variant/30 pt-3"><TrustBadge Icon={BadgeCheck} text={product.presentation.trustBadges[0]} /><TrustBadge Icon={Package} text={product.presentation.trustBadges[1]} /><TrustBadge Icon={RefreshCw} text={product.presentation.trustBadges[2]} /></div>
          </div>
        </div>
      </section>
      <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between gap-3 bg-surface/95 px-margin py-3 shadow-[0_-4px_20px_rgba(36,22,20,0.12)] backdrop-blur-md lg:hidden">
        <div className="flex flex-col">
          <span className="font-label-eyebrow text-[10px] uppercase text-on-surface-variant">Tổng dự kiến</span>
          <span className="font-price-serif text-[20px] font-bold text-primary">{formatVnd(total)}</span>
        </div>
        <button
          className="flex items-center gap-1.5 rounded-lg bg-primary-container px-5 py-2.5 font-label-ui text-label-ui font-bold uppercase tracking-wider text-on-primary shadow-md transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!checkoutAvailable}
          onClick={handlePurchase}
          type="button"
        >
          {checkoutAvailable ? "ĐẶT HÀNG" : "CHƯA MỞ ĐẶT"}
          <Zap className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

function TrustBadge({ Icon, text }: { Icon: LucideIcon; text: string }) {
  return <div className="flex flex-col items-center gap-1 text-center"><Icon className="size-[18px] text-secondary" /><span className="font-label-eyebrow text-[10px] font-semibold uppercase tracking-wider text-on-surface">{text}</span></div>;
}
