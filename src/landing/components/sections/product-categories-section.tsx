import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";
import { CategoryCardImage } from "./category-card-image";
import type { CatalogCategory } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";

import { selectHomeCategories } from "./category-showcase-policy";
import { categoryLayout } from "./category-bento-layout";

export function ProductCategoriesSection({ categories, loadFailed = false }: { categories: CatalogCategory[]; loadFailed?: boolean }) {
  const items = selectHomeCategories(categories);
  const itemClassNames = items.map((_, index) => categoryLayout(index, items.length));

  return (
    <section className="flex w-full flex-col bg-surface px-6 py-16 text-on-surface md:px-12 lg:min-h-[calc(100vh-var(--landing-header-height))] lg:px-20" id="danh-muc">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <Reveal className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] md:gap-x-6">
          <span className="font-label-eyebrow text-[10px] leading-4 font-semibold tracking-[0.18em] text-secondary uppercase md:text-label-eyebrow md:tracking-[0.22em] lg:tracking-[0.25em]">Danh mục tiêu biểu</span>
          <Link
            className="group inline-flex min-h-11 shrink-0 items-center justify-self-end gap-1.5 whitespace-nowrap rounded px-2 font-label-ui text-[12px] leading-[18px] font-medium text-primary transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:text-label-ui"
            href={routes.search}
          >
            Xem tất cả
            <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" />
          </Link>
          <h2 className="col-span-2 min-w-0 font-headline-lg text-[29px] leading-[1.25] font-medium text-primary md:col-span-1 md:text-[34px] md:leading-[1.3] lg:text-headline-lg">Khám phá các dòng bánh Minh Sâm</h2>
          <p className="col-span-2 min-w-0 font-body-md text-[14px] leading-[1.6] text-on-surface-variant md:col-span-1 md:self-end md:text-[15px] md:leading-6 lg:text-body-md">Từ những hương vị truyền thống đến những dòng bánh mới cho nhịp sống hôm nay, gói trọn tinh tế ẩm thực đất kinh kỳ.</p>
        </Reveal>

        {loadFailed ? (
          <Reveal y={12}>
            <div className="rounded bg-surface-container px-6 py-10 text-center shadow-sm">
              <p className="font-headline-sm text-headline-sm text-primary">Chưa thể tải danh mục sản phẩm</p>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">Kết nối đến hệ thống sản phẩm đang tạm thời gián đoạn.</p>
              <Link className="mt-4 inline-flex rounded bg-primary px-5 py-2.5 font-label-ui text-label-ui text-on-primary transition-colors hover:bg-primary-container" href={routes.home}>Thử lại</Link>
            </div>
          </Reveal>
        ) : items.length > 0 ? (
          <StaggerReveal
            className="grid flex-1 grid-cols-1 auto-rows-[minmax(280px,1fr)] gap-5 md:grid-cols-2 md:auto-rows-[minmax(260px,1fr)] lg:grid-cols-12 lg:auto-rows-[minmax(300px,1fr)]"
            delay={0.06}
            itemClassNames={itemClassNames}
          >
            {items.map((category, index) => (
              <CategoryCard category={category} index={index} key={category.id ?? category.slug} />
            ))}
          </StaggerReveal>
        ) : (
          <Reveal y={12}>
            <div className="rounded bg-surface-container px-6 py-10 text-center shadow-sm">
              <p className="font-headline-sm text-headline-sm text-primary">Danh mục sản phẩm đang được cập nhật</p>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">Vui lòng quay lại sau để khám phá các dòng bánh Minh Sâm.</p>
            </div>
          </Reveal>
        )}
      </div>

      <Reveal className="mx-auto flex w-full max-w-7xl flex-col items-start gap-3 pt-8 text-on-surface-variant sm:flex-row sm:items-center sm:justify-between" delay={0.12} y={14}>
        <div className="flex items-center gap-3">
          <span className="h-[1px] w-8 bg-outline-variant" />
          <span className="font-label-eyebrow text-[10px] leading-4 font-semibold tracking-[0.14em] uppercase md:text-label-eyebrow lg:tracking-[0.18em]">Danh Mục Sản Phẩm</span>
        </div>
      </Reveal>
    </section>
  );
}

function CategoryCard({ category, index }: { category: CatalogCategory; index: number }) {
  const variant = cardVariant(index);
  const isLarge = variant === "large";
  const isHorizontal = variant === "horizontal";

  return (
    <Link
      className={`group relative flex h-full min-h-[280px] md:min-h-[260px] lg:min-h-[300px] overflow-hidden rounded bg-surface-container shadow-sm transition-all duration-300 hover:shadow-md ${isHorizontal ? "flex-col justify-center p-6" : `flex-col justify-end ${isLarge ? "p-6" : "p-4"}`}`}
      href={routes.category(category.slug)}
    >
      <CategoryCardImage alt={category.imageAlt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src={category.image} />
      <div className={`absolute inset-0 ${isHorizontal ? "bg-gradient-to-r from-primary/95 via-primary/80 to-primary/45" : isLarge ? "bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" : "bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"}`} />
      <div className={`relative z-10 text-on-primary ${isHorizontal ? "flex items-center justify-between gap-4" : ""}`}>
        <div className="min-w-0">
          <span className={`block font-label-eyebrow text-[10px] leading-4 font-semibold tracking-[0.14em] text-secondary-fixed uppercase md:text-label-eyebrow ${isLarge ? "mb-1 md:tracking-[0.18em] lg:tracking-[0.2em]" : "md:tracking-[0.15em]"}`}>
            {String(index + 1).padStart(2, "0")} / Danh mục Minh Sâm
          </span>
          {isLarge ? (
            <h3 className="mb-1 font-headline-md text-[21px] leading-[1.3] font-medium text-secondary-fixed md:text-[23px] md:leading-8 lg:text-headline-md">{category.name}</h3>
          ) : (
            <h3 className="font-headline-sm text-[18px] leading-[1.35] font-semibold text-secondary-fixed md:text-[19px] md:leading-7 lg:text-headline-sm">{category.name}</h3>
          )}
          {category.description ? <p className={`mt-1 break-words font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/90 md:text-[14px] md:leading-[22px] lg:text-body-sm ${isLarge ? "max-w-xs" : isHorizontal ? "max-w-xl" : ""}`}>{category.description}</p> : null}
          {!isHorizontal ? <span className="mt-3 inline-flex items-center gap-1 font-label-ui text-[12px] leading-[18px] font-medium tracking-[0.06em] text-secondary-fixed uppercase transition-transform group-hover:translate-x-1 md:text-label-ui md:tracking-wider">Khám phá →</span> : null}
        </div>
        {isHorizontal ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-primary transition-transform group-hover:scale-110">
            <ArrowRight aria-hidden="true" className="size-[18px]" />
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function cardVariant(index: number) {
  if (index < 2) return "large" as const;
  if (index < 4) return "compact" as const;
  if (index < 6) return "horizontal" as const;
  return "standard" as const;
}
