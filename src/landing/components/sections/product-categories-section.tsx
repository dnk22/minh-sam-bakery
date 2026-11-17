/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";
import { routes } from "@/landing/lib/routes";

export function ProductCategoriesSection({ availableCategorySlugs }: { availableCategorySlugs: string[] }) {
  const available = new Set(availableCategorySlugs);
  return (
    <section className="w-full flex flex-col justify-between bg-surface text-on-surface px-6 py-16 md:px-12 lg:min-h-screen lg:px-20" id="danh-muc">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <Reveal>
            <div>
              <span className="font-label-eyebrow font-semibold text-[10px] leading-4 uppercase text-secondary tracking-[0.18em] block mb-2 md:text-label-eyebrow md:tracking-[0.22em] lg:tracking-[0.25em]">Danh mục tiêu biểu</span>
              <h2 className="font-headline-lg font-medium text-[29px] leading-[1.25] text-primary md:text-[34px] md:leading-[1.3] lg:text-headline-lg">Khám phá các dòng bánh Minh Sâm</h2>
            </div>
          </Reveal>
          <Reveal className="max-w-md" delay={0.08}>
            <p className="font-body-md text-[14px] leading-[1.6] text-on-surface-variant md:text-[15px] md:leading-6 lg:text-body-md">Từ những hương vị truyền thống đến những dòng bánh mới cho nhịp sống hôm nay, gói trọn tinh tế ẩm thực đất kinh kỳ.</p>
          </Reveal>
        </div>
        <StaggerReveal
          className="grid grid-cols-1 auto-rows-[minmax(180px,auto)] gap-5 md:grid-cols-2 md:auto-rows-[170px] lg:grid-cols-12 lg:auto-rows-[185px]"
          delay={0.06}
          itemClassNames={[
            "lg:col-span-5 lg:row-span-2 min-h-0",
            "lg:col-span-4 lg:row-span-2 min-h-0",
            "lg:col-span-3 lg:row-span-1 min-h-0",
            "lg:col-span-3 lg:row-span-1 min-h-0",
            "lg:col-span-6 lg:row-span-1 min-h-0",
            "lg:col-span-6 lg:row-span-1 min-h-0",
          ]}
        >
          <CategoryCard available={available.has("banh-trung-thu")} className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-6 shadow-sm hover:shadow-md transition-all duration-300" slug="banh-trung-thu">
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Traditional golden baked Vietnamese mooncake cut in half showcasing rich lotus seed and salted egg yolk paste texture on vintage ceramic tray." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB73xf6iJ9hZhRkkCq0283fpDzeVOiKmypilGhWNZdNzNUaZ8TQkpRX0iPa_A-yOzcQzbGiutYXDqjjCXEmOyJGI2CIRlhvWB7vVYTPTTq0-5Q67Ui8-m2NVx5qIrsLrb3eo_WvqMN0pxuNLstCG9JENHMiB0RCfXkeeihrya5VBESQS2jbG8JiO10ylrf4iJImYRSnhsmVZBa2RS-pa8Ab0QvlrDq2LaidyOudLK7oQkOwHdsB5PDa" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow font-semibold text-[10px] leading-4 text-secondary-fixed tracking-[0.14em] uppercase block mb-1 md:text-label-eyebrow md:tracking-[0.18em] lg:tracking-[0.2em]">01 / Mùa Trăng &amp; Di Sản</span>
              <h3 className="font-headline-md font-medium text-[21px] leading-[1.3] text-secondary-fixed mb-1 md:text-[23px] md:leading-8 lg:text-headline-md">Bánh Trung Thu</h3>
              <p className="font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/90 max-w-xs mb-3 md:text-[14px] md:leading-[22px] lg:text-body-sm">Bánh nướng, bánh dẻo thập cẩm gia truyền &amp; hạt sen Tây Hồ thanh nhã.</p>
              <span className="inline-flex items-center gap-1 font-label-ui font-medium text-[12px] leading-[18px] text-secondary-fixed uppercase tracking-[0.06em] group-hover:translate-x-1 transition-transform md:text-label-ui md:tracking-wider">Khám phá →</span>
            </div>
          </CategoryCard>
          <CategoryCard available={available.has("san-pham-truyen-thong")} className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-6 shadow-sm hover:shadow-md transition-all duration-300" slug="san-pham-truyen-thong">
            <img alt="Dòng sản phẩm truyền thống bánh cốm bánh chả" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn4-fwG3T0mHPcpxyVz2zeiA3akkBYusSEQQPB452WZDys7mh4p-zfWYsbS-EfYVYZkZzNglH17ir-ar7MyvDwuo6tYftjCfpRS6Lt5Z6hdqcG_WvI2SMJAdV_uL_HnNnsaAhiwRyxaGkUwOmqXiBqPerjrTxx9S6S0kAI3w32c3rFGV6K2thgodJ5aMCxzqjph92eF0n9otfKtiJBCNE9RSjTBKB2bNOjU5yQ8fiIjq2PilTxnkqWS2ECR89FKCkJ_w" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow font-semibold text-[10px] leading-4 text-secondary-fixed tracking-[0.14em] uppercase block mb-1 md:text-label-eyebrow md:tracking-[0.18em] lg:tracking-[0.2em]">02 / Cố Đô Hà Thành</span>
              <h3 className="font-headline-md font-medium text-[21px] leading-[1.3] text-secondary-fixed mb-1 md:text-[23px] md:leading-8 lg:text-headline-md">Bánh Truyền Thống</h3>
              <p className="font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/90 max-w-xs mb-3 md:text-[14px] md:leading-[22px] lg:text-body-sm">Bánh cốm Làng Vòng mộc, bánh khảo, bánh chả lá chanh giòn rụm.</p>
              <span className="inline-flex items-center gap-1 font-label-ui font-medium text-[12px] leading-[18px] text-secondary-fixed uppercase tracking-[0.06em] group-hover:translate-x-1 transition-transform md:text-label-ui md:tracking-wider">Khám phá →</span>
            </div>
          </CategoryCard>
          <CategoryCard available={available.has("san-pham-moi")} className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-4 shadow-sm hover:shadow-md transition-all duration-300" slug="san-pham-moi">
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Soft delicate Vietnamese rice mochi pastries in pastel shades of matcha green and blossom pink arranged on handmade paper." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvfMDppkhcp5dgt57NfhXiARBkEawTj2GOupHmsLKS6IVAjcsD3bZcY6VnRSkIWZIwN8_-UsFnsubKPrhrhAZZHH4CQoNQLdJ0KbPAD7Q4Wfp24vR2Xu8YlTyAUyWjwXi0_aPrUhKBpesQvDbdGt50_3LzHSrQ0fSLshh-cysBLG45ctj4NFjbTj_XUGRRxzevUtiUrL4beXEva3OsCzSGA7UsBNGAZBFC3bdmBakwS5PTpKwjxPsa" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow font-semibold text-[10px] leading-4 text-secondary-fixed tracking-[0.12em] uppercase block md:text-label-eyebrow md:tracking-[0.15em]">03 / Đương Đại</span>
              <h4 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed md:text-[19px] md:leading-7 lg:text-headline-sm">Dòng Sản Phẩm Mới</h4>
              <p className="font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/80 md:text-[14px] md:leading-[22px] lg:text-body-sm">Mochi ngũ sắc nếp dẻo mát lành, vị thanh nhẹ.</p>
            </div>
          </CategoryCard>
          <CategoryCard available={available.has("banh-cookie")} className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-4 shadow-sm hover:shadow-md transition-all duration-300" slug="banh-cookie">
            <img alt="Bánh Cookie giòn thơm Minh Sam" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuIDsFVLtaNopHdn0wDfqe9i5G2qiigo-XedBjxhb4qVQp-qQTglConbltDYwcXjB4ZmbqTSQZBeuEOvgZagFWA-afeOAUPtfsIot7P7PX8nlQ_coeg9dkQLuT6QhQHNyrcs0nQ2BvDr69ibEmQ_deltrfNWzEZZdDZ_OpgLKog2MRzrcNs9_7P0LytppisjCZZLsi5TjaGH1iA22rSNZ6u_EU4C6tjdlRhMIFxnBEbMZ1ZynXA2F-O2PCiEgyTnWN6g" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow font-semibold text-[10px] leading-4 text-secondary-fixed tracking-[0.12em] uppercase block md:text-label-eyebrow md:tracking-[0.15em]">04 / Thưởng Vị Mỗi Ngày</span>
              <h4 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed md:text-[19px] md:leading-7 lg:text-headline-sm">Bánh Cookie</h4>
              <p className="font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/80 md:text-[14px] md:leading-[22px] lg:text-body-sm">Bơ hạt giòn rụm, ngọt dịu cho tiệc trà tao nhã.</p>
            </div>
          </CategoryCard>
          <CategoryCard available={available.has("sinh-nhat-su-kien")} className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-center p-6 shadow-sm hover:shadow-md transition-all duration-300" slug="sinh-nhat-su-kien">
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="font-label-eyebrow font-semibold text-[10px] leading-4 text-secondary uppercase tracking-[0.14em] block mb-1 md:text-label-eyebrow md:tracking-[0.18em] lg:tracking-[0.2em]">05 / Dịp Đặc Biệt</span>
                <h4 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-primary mb-1 md:text-[19px] md:leading-7 lg:text-headline-sm">Sinh Nhật &amp; Sự Kiện</h4>
                <p className="font-body-sm text-[13px] leading-5 text-on-surface-variant max-w-sm md:text-[14px] md:leading-[22px] lg:text-body-sm">Bánh nghệ thuật thủ công &amp; bàn tiệc trà tao nhã theo thiết kế riêng biệt.</p>
              </div>
              <span className="w-10 h-10 shrink-0 rounded-full bg-primary text-secondary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight aria-hidden="true" className="size-[18px]" />
              </span>
            </div>
          </CategoryCard>
          <CategoryCard available={available.has("banh-hat")} className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-center p-6 shadow-sm hover:shadow-md transition-all duration-300" slug="banh-hat">
            <img alt="Bánh hạt dinh dưỡng Minh Sam" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy4q29gVY855g_aoS-e0PnofwMzijHJBo_KxEfM99ceYAWXZ4rs8KwSclrM4q4dxN4JG1439eWs-75V6lYYCyeqEjgqfLBypCjyPOzJUoZw-MyYakQr6SlwLSUHvcgkUAJM3-jhg_f7CTvEVDVaJcl7w6xPPUqkvRVQfvj6QVYJObnA5tjzI5G5bVgHcvhu5m1xPg02LaWqoyGZuwx1CrlaoByxmEAPjgq4PeksFEZvOvJM8YeZaHczuBf7I8Y4-paDQ" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
            <div className="relative z-10 flex items-center justify-between text-on-primary">
              <div className="min-w-0 pr-3">
                <span className="font-label-eyebrow font-semibold text-[10px] leading-4 text-secondary-fixed uppercase tracking-[0.14em] block mb-1 md:text-label-eyebrow md:tracking-[0.18em] lg:tracking-[0.2em]">06 / Dinh Dưỡng &amp; Thanh Lành</span>
                <h4 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-1 md:text-[19px] md:leading-7 lg:text-headline-sm">Bánh Hạt Tự Nhiên</h4>
                <p className="font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/90 max-w-sm md:text-[14px] md:leading-[22px] lg:text-body-sm">Hạt dinh dưỡng cao cấp tuyển chọn, vị ngọt tự nhiên không đường tinh luyện.</p>
              </div>
              <span className="w-10 h-10 shrink-0 rounded-full bg-secondary-fixed text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight aria-hidden="true" className="size-[18px]" />
              </span>
            </div>
          </CategoryCard>
        </StaggerReveal>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto flex flex-col items-start gap-3 pt-8 text-on-surface-variant sm:flex-row sm:items-center sm:justify-between" delay={0.12} y={14}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-outline-variant" />
          <span className="font-label-eyebrow font-semibold text-[10px] leading-4 uppercase tracking-[0.14em] md:text-label-eyebrow lg:tracking-[0.18em]">Danh Mục Sản Phẩm</span>
        </div>
        <Link className="font-label-ui font-medium text-[12px] leading-[18px] text-primary uppercase tracking-[0.06em] hover:text-secondary transition-colors md:text-label-ui md:tracking-wider" href={routes.products}>Xem toàn bộ menu bánh →</Link>
      </Reveal>
    </section>
  );
}

function CategoryCard({ available, children, className, slug }: { available: boolean; children: ReactNode; className: string; slug: string }) {
  if (available) return <Link className={className} href={routes.category(slug)}>{children}</Link>;
  return <article className={`${className} cursor-default opacity-70`}>{children}</article>;
}
