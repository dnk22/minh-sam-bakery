"use client";

/* eslint-disable @next/next/no-img-element */
import type { ImgHTMLAttributes } from "react";

const fallbackSrc = "/images/catalog/product-placeholder.svg";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> & { alt: string };

export function SafeImage({ alt, onError, ...props }: SafeImageProps) {
  return <img {...props} alt={alt} onError={(event) => {
    if (event.currentTarget.getAttribute("src") === fallbackSrc) return;
    event.currentTarget.src = fallbackSrc;
    onError?.(event);
  }} />;
}
