"use client";

import { useState } from "react";
import { SafeImage } from "@/landing/components/ui/safe-image";

const PLACEHOLDER = "/images/catalog/product-placeholder.svg";

export function CategoryCardImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return <CategoryImage key={src} src={src} alt={alt} className={className} />;
}

function CategoryImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || src === PLACEHOLDER || failed) return (
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-primary/85" />
  );
  return <SafeImage alt={alt} className={className} src={src} onError={() => setFailed(true)} />;
}
