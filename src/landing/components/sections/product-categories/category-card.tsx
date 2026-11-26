import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { CatalogCategory } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";

import { CategoryCardImage } from "./category-card-image";

export function CategoryCard({ category, index }: { category: CatalogCategory; index: number }) {
  const isLarge = index < 2;
  const isHorizontal = index >= 4 && index < 6;

  return (
    <Link
      className={`group relative flex h-full min-h-[190px] min-w-0 flex-col justify-end overflow-hidden rounded bg-surface-container p-3 shadow-sm transition-shadow duration-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px] ${isHorizontal ? "md:justify-center md:p-6" : isLarge ? "md:p-6" : "md:p-4"}`}
      href={routes.category(category.slug)}
    >
      <CategoryCardImage alt={category.imageAlt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105" src={category.image} />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/80 to-primary/20 ${isHorizontal ? "md:bg-gradient-to-r md:from-primary/95 md:via-primary/80 md:to-primary/45" : isLarge ? "md:via-primary/40 md:to-transparent" : "md:from-primary/90 md:via-primary/50 md:to-transparent"}`} />
      <div className={`relative z-10 text-on-primary ${isHorizontal ? "md:flex md:items-center md:justify-between md:gap-4" : ""}`}>
        <div className="min-w-0">
          <h3 className={`break-words leading-[1.3] text-secondary-fixed ${isLarge ? "mb-1 font-headline-md text-[16px] font-medium sm:text-[18px] md:text-[23px] md:leading-8 lg:text-headline-md" : "font-headline-sm text-[16px] font-semibold sm:text-[18px] md:text-[19px] md:leading-7 lg:text-headline-sm"}`}>{category.name}</h3>
          {category.description ? (
            <p className={`mt-1 break-words font-body-sm text-[12px] leading-[1.45] text-secondary-fixed-dim/90 sm:text-[13px] md:text-[14px] md:leading-[22px] lg:text-body-sm ${isLarge ? "md:max-w-xs" : isHorizontal ? "md:max-w-xl" : ""}`}>{category.description}</p>
          ) : null}
          <span className={`mt-2 inline-flex items-center gap-1 font-label-ui text-[11px] leading-4 font-medium text-secondary-fixed uppercase transition-transform motion-safe:group-hover:translate-x-1 md:mt-3 md:text-label-ui md:tracking-wider ${isHorizontal ? "md:hidden" : ""}`}>Khám phá →</span>
        </div>
        {isHorizontal ? (
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-primary transition-transform motion-safe:group-hover:scale-110 md:flex">
            <ArrowRight aria-hidden="true" className="size-[18px]" />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
