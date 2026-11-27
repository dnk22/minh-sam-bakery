"use client";

import { useState } from "react";

import { SafeImage } from "@/landing/components/ui/safe-image";
import type { ProductImage } from "../types";

type ProductGalleryProps = {
  heroImage: ProductImage;
  images: ProductImage[];
  productionNote: string;
};

export function ProductGallery({ heroImage, images, productionNote }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? heroImage;

  return (
    <div className="flex flex-col gap-space-md">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container shadow-md">
        <SafeImage
          alt={activeImage.alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={activeImage.src}
        />
        {productionNote ? (
          <span className="pointer-events-none absolute top-4 left-4 rounded-sm bg-primary-container/90 px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-primary shadow-sm">
            {productionNote}
          </span>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2.5 sm:gap-space-sm">
          {images.map((image, index) => {
            const active = activeIndex === index;
            return (
              <button
                aria-label={`Xem ${image.alt.toLocaleLowerCase("vi")}`}
                aria-pressed={active}
                className={`group relative aspect-square overflow-hidden rounded-lg bg-surface-container p-0.5 transition-all focus:outline-none ${active ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"}`}
                key={`${image.src}-${index}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <SafeImage alt={image.alt} className="h-full w-full rounded object-cover" src={image.src} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
