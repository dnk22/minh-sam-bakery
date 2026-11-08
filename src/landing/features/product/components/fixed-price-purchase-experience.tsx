"use client";

import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, ChevronRight, Minus, Package, Plus, RefreshCw, ShoppingBag, Truck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import type { FixedPriceProductDetail } from "../types";
import { ProductGallery } from "./product-gallery";

const formatVnd = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;

export function FixedPricePurchaseExperience({ product }: { product: FixedPriceProductDetail }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.pricing.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = product.pricing.variants.find((variant) => variant.id === selectedVariantId) ?? product.pricing.variants[0];
  const total = selectedVariant.price * quantity;

  // Future cart and checkout adapters attach here; no success state is simulated.
  const handleAddToCart = () => undefined;
  const handlePurchase = () => undefined;

  return (
    <>
      <section className="mx-auto w-full max-w-[1360px] px-margin pt-space-sm pb-space-xl md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12">
          <div className="lg:col-span-7"><ProductGallery heroImage={product.heroImage} images={product.gallery} variant="fixed" /></div>
          <div className="sticky top-24 flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-lg md:p-space-lg lg:col-span-5">
            <div className="flex flex-col gap-1"><span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-widest text-secondary">DÒNG THƯỜNG NHẬT • BÁNH COOKIE THỦ CÔNG</span><h1 className="mt-1 font-headline-lg text-headline-md leading-snug tracking-tight text-primary sm:text-headline-lg">{product.catalog.name}</h1><p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{product.catalog.description}</p></div>
            <div className="mt-space-md flex items-baseline justify-between rounded-lg bg-surface-container-low px-4 py-3"><div className="flex items-baseline gap-2"><span className="font-price-serif text-[32px] leading-tight font-semibold text-primary">{formatVnd(total)}</span><span className="font-body-sm text-body-sm text-outline-variant">/ hộp tiêu chuẩn</span></div><span className="font-body-sm text-body-sm font-medium text-secondary">Mẻ nướng thủ công</span></div>
            <div className="mt-space-md flex flex-col gap-2"><span className="font-label-ui text-label-ui font-semibold uppercase tracking-wider text-on-surface">Chọn quy cách đóng gói</span><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{product.pricing.variants.map((variant) => { const selected = variant.id === selectedVariantId; return <button aria-pressed={selected} className={`flex cursor-pointer flex-col justify-between rounded-lg p-3 text-left transition-all ${selected ? "bg-surface-container text-primary shadow-sm ring-2 ring-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"}`} key={variant.id} onClick={() => setSelectedVariantId(variant.id)} type="button"><span className="flex items-center justify-between"><span className="font-label-ui text-label-ui font-semibold">{variant.label}</span><CheckCircle2 className={`size-4 ${selected ? "opacity-100" : "opacity-0"}`} /></span><span className="mt-2 font-price-serif text-price-serif font-bold text-primary">{formatVnd(variant.price)}</span></button>; })}</div></div>
            <div className="mt-space-md flex items-center justify-between py-1"><div className="flex flex-col"><span className="font-label-ui text-label-ui font-semibold uppercase tracking-wider text-on-surface">Số lượng</span><span className="mt-0.5 font-body-sm text-[12px] text-secondary">Mẻ nướng sáng nay sẵn sàng</span></div><div className="flex items-center rounded-lg bg-surface-container-low p-1 shadow-inner"><button aria-label="Giảm số lượng" className="flex size-8 items-center justify-center rounded bg-surface text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40" disabled={quantity === 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button"><Minus className="size-[18px]" /></button><span className="w-10 select-none text-center font-headline-sm text-headline-sm font-semibold text-primary">{quantity}</span><button aria-label="Tăng số lượng" className="flex size-8 items-center justify-center rounded bg-surface text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40" disabled={quantity === 20} onClick={() => setQuantity((current) => Math.min(20, current + 1))} type="button"><Plus className="size-[18px]" /></button></div></div>
            <div className="mt-space-md flex flex-col gap-2 border-t border-outline-variant/40 pt-2"><span className="font-label-ui text-label-ui font-semibold uppercase tracking-wider text-on-surface">Thông tin nhận hàng</span><div className="flex flex-col gap-2"><FutureControl Icon={CalendarDays} label="Ngày muốn nhận bánh" text="Sớm nhất hôm nay (sau 14:00)" /><FutureControl Icon={Truck} label="Giao tận nơi hoặc nhận tại cửa hàng" text="Giao hỏa tốc 2H hoặc Nhận tại 36 Phố Hàng Bè" /></div><p className="mt-0.5 font-body-sm text-[11px] leading-normal italic text-on-surface-variant">Địa chỉ cụ thể và phí vận chuyển sẽ được xác nhận khi thanh toán.</p></div>
            <div className="mt-space-lg flex flex-col gap-2.5"><button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-3.5 font-label-ui text-[15px] font-bold uppercase tracking-widest text-secondary-fixed shadow-md transition-all hover:bg-primary" onClick={handlePurchase} type="button">MUA NGAY <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></button><button className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary bg-transparent px-6 py-3 font-label-ui text-[14px] font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-surface-container" onClick={handleAddToCart} type="button"><ShoppingBag className="size-[18px] text-secondary" /> THÊM VÀO GIỎ</button></div>
            <div className="mt-space-md grid grid-cols-3 gap-2 border-t border-outline-variant/30 pt-3"><TrustBadge Icon={BadgeCheck} text="100% bơ Pháp tự nhiên" /><TrustBadge Icon={Package} text="Đóng gói giữ nhiệt" /><TrustBadge Icon={RefreshCw} text="Đổi trả nếu hư tổn" /></div>
          </div>
        </div>
      </section>
      <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between gap-3 bg-surface/95 px-margin py-3 shadow-[0_-4px_20px_rgba(36,22,20,0.12)] backdrop-blur-md lg:hidden"><div className="flex flex-col"><span className="font-label-eyebrow text-[10px] uppercase text-on-surface-variant">Tổng thanh toán</span><div className="flex items-baseline gap-1"><span className="font-price-serif text-[20px] font-bold text-primary">{formatVnd(total)}</span><span className="font-body-sm text-[11px] font-medium text-secondary">• {quantity} Hộp</span></div></div><div className="flex items-center gap-2"><button aria-label="Thêm vào giỏ hàng" className="flex size-10 items-center justify-center rounded-lg bg-surface-container text-primary shadow-sm" onClick={handleAddToCart} type="button"><ShoppingBag className="size-5" /></button><button className="flex items-center gap-1.5 rounded-lg bg-primary-container px-5 py-2.5 font-label-ui text-label-ui font-bold uppercase tracking-wider text-on-primary shadow-md transition-colors hover:bg-primary" onClick={handlePurchase} type="button">MUA NGAY <Zap className="size-[18px]" /></button></div></div>
    </>
  );
}

function FutureControl({ Icon, label, text }: { Icon: LucideIcon; label: string; text: string }) {
  return <button className="group flex w-full items-center justify-between rounded-lg bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container" type="button"><span className="flex items-center gap-2.5"><Icon className="size-5 text-secondary" /><span className="flex flex-col"><span className="font-label-ui text-body-sm font-semibold text-primary">{label}</span><span className="font-body-sm text-[12px] text-on-surface-variant">{text}</span></span></span><ChevronRight className="size-[18px] text-outline transition-colors group-hover:text-primary" /></button>;
}

function TrustBadge({ Icon, text }: { Icon: LucideIcon; text: string }) {
  return <div className="flex flex-col items-center gap-1 text-center"><Icon className="size-[18px] text-secondary" /><span className="font-label-eyebrow text-[10px] font-semibold uppercase tracking-wider text-on-surface">{text}</span></div>;
}
