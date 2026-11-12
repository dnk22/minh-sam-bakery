"use client";

/* eslint-disable @next/next/no-img-element */
import { Award, Flame, Hammer, History, ZoomIn } from "lucide-react";
import { useState } from "react";

import type { ProductImage } from "../types";

type ProductGalleryProps = {
  heroImage: ProductImage;
  images: ProductImage[];
  variant: "fixed" | "quote";
  galleryStrategy?: "original" | "repeated-mock";
};

export function ProductGallery({ heroImage, images, variant, galleryStrategy = "original" }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? heroImage : images[activeIndex];
  const handleZoom = () => undefined;

  return (
    <div className="flex flex-col gap-space-md">
      <div className={`group relative aspect-[4/3] w-full overflow-hidden bg-surface-container shadow-md ${variant === "fixed" ? "rounded-xl" : "rounded-lg"}`}>
        <img alt={activeImage.alt} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src={activeImage.src} />
        {galleryStrategy === "repeated-mock" ? (
          <div className="pointer-events-none absolute top-4 left-4"><span className="rounded-sm bg-surface/90 px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-primary shadow-sm backdrop-blur-md">Ảnh minh họa demo • lặp để giữ bố cục</span></div>
        ) : variant === "fixed" ? (
          <>
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span className="rounded-sm bg-primary-container px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-primary shadow-sm">Nướng Mới Mỗi Sáng</span>
              <span className="rounded-sm bg-surface/90 px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary shadow-sm backdrop-blur-md">Thủ Công Gia Truyền</span>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 opacity-40"><span className="font-headline-sm text-[13px] uppercase tracking-widest text-on-surface">Minh Sâm • Hà Thành 2010</span></div>
          </>
        ) : (
          <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary-container/95 px-3 py-1.5 font-label-eyebrow text-label-eyebrow tracking-widest text-on-primary shadow-sm backdrop-blur-md"><Award className="size-3.5 text-secondary-fixed" /> PHIÊN BẢN DOANH NGHIỆP B2B</span>
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-surface-container-lowest/90 px-3 py-1 font-label-eyebrow text-label-eyebrow tracking-widest text-primary shadow-sm backdrop-blur-md"><Hammer className="size-3.5 text-secondary" /> CHẾ TÁC THỦ CÔNG THEO YÊU CẦU</span>
          </div>
        )}
        <button aria-label="Phóng to ảnh chi tiết" className="absolute right-4 bottom-4 flex size-9 items-center justify-center rounded-full bg-surface/85 text-primary shadow-md backdrop-blur transition-colors hover:bg-surface" onClick={handleZoom} type="button"><ZoomIn className="size-5" /></button>
      </div>

      <div className={`grid grid-cols-5 ${variant === "fixed" ? "gap-2.5 sm:gap-space-sm" : "gap-3"}`}>
        {images.map((image, index) => {
          const active = activeIndex === index || (activeIndex === null && index === 0);
          return (
            <button aria-label={`Xem ${image.alt.toLocaleLowerCase("vi")}`} className={`group relative aspect-square overflow-hidden bg-surface-container p-0.5 transition-all focus:outline-none ${variant === "fixed" ? "rounded-lg" : "rounded-sm shadow-sm"} ${active ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"}`} key={`${image.src}-${index}`} onClick={() => setActiveIndex(index)} type="button">
              <img alt={image.alt} className="h-full w-full rounded object-cover" src={image.src} />
              {active && variant === "quote" ? <span className="absolute inset-0 bg-primary/20" /> : null}
            </button>
          );
        })}
      </div>

      {galleryStrategy === "repeated-mock" ? (
        <div className="mt-space-xs flex items-start gap-space-md rounded-xl bg-surface-container-low p-space-md"><span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-sm"><History className="size-5" /></span><div><span className="font-headline-sm text-subheading font-semibold text-primary">Bộ ảnh minh họa sản phẩm</span><p className="mt-1 font-body-md text-body-md leading-relaxed text-on-surface-variant">Sản phẩm hiện có một ảnh nguồn. Ảnh được lặp trong năm vị trí thumbnail để giữ nguyên bố cục bản mẫu và không sử dụng hình của sản phẩm khác.</p></div></div>
      ) : variant === "fixed" ? (
        <div className="mt-space-xs flex items-start gap-space-md rounded-xl bg-surface-container-low p-space-md">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-sm"><Flame className="size-5" /></span>
          <div><span className="font-headline-sm text-subheading font-semibold text-primary">Mẻ Bánh Sớm Hà Thành</span><p className="mt-1 font-body-md text-body-md leading-relaxed text-on-surface-variant">Bánh được nhào nặn theo công thức bơ Pháp lên men tự nhiên, nướng mẻ đầu lúc 06:30 mỗi sáng. Từng chiếc cookie đạt độ giòn êm, không xốp rỗng công nghiệp, giữ trọn vị ngậy thơm thanh tao.</p></div>
        </div>
      ) : (
        <div className="mt-space-sm flex flex-col items-center gap-space-md rounded-lg bg-surface-container-low p-space-md md:flex-row">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-primary"><History className="size-8" /></span>
          <div><span className="font-headline-sm text-subheading font-semibold text-primary">Tác phẩm mang dấu ấn văn hóa Thăng Long</span><p className="mt-1 font-body-md text-body-md text-on-surface-variant">Mỗi chiếc hộp là một tác phẩm thủ công được phối kết giữa nghệ thuật sơn mài Hạ Thái, giấy Dó truyền thống và hương vị bánh thủ công trứ danh của xưởng Minh Sâm.</p></div>
        </div>
      )}
    </div>
  );
}
