/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";
import { routes } from "@/landing/lib/routes";

export function ProductCategoriesSection() {
  return (
    <section className="w-full flex flex-col justify-between bg-surface text-on-surface px-6 py-16 md:px-12 lg:min-h-screen lg:px-20" id="danh-muc">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <Reveal>
            <div>
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-[0.25em] block mb-2">Danh mục tiêu biểu • 02</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Khám phá các dòng bánh Minh Sâm</h2>
            </div>
          </Reveal>
          <Reveal className="max-w-md" delay={0.08}>
            <p className="font-body-md text-body-md text-on-surface-variant">Từ những hương vị truyền thống đến những dòng bánh mới cho nhịp sống hôm nay, gói trọn tinh tế ẩm thực đất kinh kỳ.</p>
          </Reveal>
        </div>
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-[140px] md:auto-rows-[170px] lg:auto-rows-[185px]"
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
          <Link className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-6 shadow-sm hover:shadow-md transition-all duration-300" href={routes.category("banh-trung-thu")}>
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Traditional golden baked Vietnamese mooncake cut in half showcasing rich lotus seed and salted egg yolk paste texture on vintage ceramic tray." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB73xf6iJ9hZhRkkCq0283fpDzeVOiKmypilGhWNZdNzNUaZ8TQkpRX0iPa_A-yOzcQzbGiutYXDqjjCXEmOyJGI2CIRlhvWB7vVYTPTTq0-5Q67Ui8-m2NVx5qIrsLrb3eo_WvqMN0pxuNLstCG9JENHMiB0RCfXkeeihrya5VBESQS2jbG8JiO10ylrf4iJImYRSnhsmVZBa2RS-pa8Ab0QvlrDq2LaidyOudLK7oQkOwHdsB5PDa" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.2em] uppercase block mb-1">01 / Mùa Trăng &amp; Di Sản</span>
              <h3 className="font-headline-md text-headline-md text-secondary-fixed mb-1">Bánh Trung Thu</h3>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/90 max-w-xs mb-3">Bánh nướng, bánh dẻo thập cẩm gia truyền &amp; hạt sen Tây Hồ thanh nhã.</p>
              <span className="inline-flex items-center gap-1 font-label-ui text-label-ui text-secondary-fixed uppercase tracking-wider group-hover:translate-x-1 transition-transform">Khám phá →</span>
            </div>
          </Link>
          <Link className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-6 shadow-sm hover:shadow-md transition-all duration-300" href={routes.category("san-pham-truyen-thong")}>
            <img alt="Dòng sản phẩm truyền thống bánh cốm bánh chả" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn4-fwG3T0mHPcpxyVz2zeiA3akkBYusSEQQPB452WZDys7mh4p-zfWYsbS-EfYVYZkZzNglH17ir-ar7MyvDwuo6tYftjCfpRS6Lt5Z6hdqcG_WvI2SMJAdV_uL_HnNnsaAhiwRyxaGkUwOmqXiBqPerjrTxx9S6S0kAI3w32c3rFGV6K2thgodJ5aMCxzqjph92eF0n9otfKtiJBCNE9RSjTBKB2bNOjU5yQ8fiIjq2PilTxnkqWS2ECR89FKCkJ_w" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.2em] uppercase block mb-1">02 / Cố Đô Hà Thành</span>
              <h3 className="font-headline-md text-headline-md text-secondary-fixed mb-1">Bánh Truyền Thống</h3>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/90 max-w-xs mb-3">Bánh cốm Làng Vòng mộc, bánh khảo, bánh chả lá chanh giòn rụm.</p>
              <span className="inline-flex items-center gap-1 font-label-ui text-label-ui text-secondary-fixed uppercase tracking-wider group-hover:translate-x-1 transition-transform">Khám phá →</span>
            </div>
          </Link>
          <Link className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-4 shadow-sm hover:shadow-md transition-all duration-300" href={routes.category("san-pham-moi")}>
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Soft delicate Vietnamese rice mochi pastries in pastel shades of matcha green and blossom pink arranged on handmade paper." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvfMDppkhcp5dgt57NfhXiARBkEawTj2GOupHmsLKS6IVAjcsD3bZcY6VnRSkIWZIwN8_-UsFnsubKPrhrhAZZHH4CQoNQLdJ0KbPAD7Q4Wfp24vR2Xu8YlTyAUyWjwXi0_aPrUhKBpesQvDbdGt50_3LzHSrQ0fSLshh-cysBLG45ctj4NFjbTj_XUGRRxzevUtiUrL4beXEva3OsCzSGA7UsBNGAZBFC3bdmBakwS5PTpKwjxPsa" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.15em] uppercase block">03 / Đương Đại</span>
              <h4 className="font-headline-sm text-headline-sm text-secondary-fixed">Dòng Sản Phẩm Mới</h4>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80 line-clamp-1">Mochi ngũ sắc nếp dẻo mát lành, vị thanh nhẹ.</p>
            </div>
          </Link>
          <Link className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-end p-4 shadow-sm hover:shadow-md transition-all duration-300" href={routes.category("banh-cookie")}>
            <img alt="Bánh Cookie giòn thơm Minh Sam" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuIDsFVLtaNopHdn0wDfqe9i5G2qiigo-XedBjxhb4qVQp-qQTglConbltDYwcXjB4ZmbqTSQZBeuEOvgZagFWA-afeOAUPtfsIot7P7PX8nlQ_coeg9dkQLuT6QhQHNyrcs0nQ2BvDr69ibEmQ_deltrfNWzEZZdDZ_OpgLKog2MRzrcNs9_7P0LytppisjCZZLsi5TjaGH1iA22rSNZ6u_EU4C6tjdlRhMIFxnBEbMZ1ZynXA2F-O2PCiEgyTnWN6g" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
            <div className="relative z-10 text-on-primary">
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.15em] uppercase block">04 / Thưởng Vị Mỗi Ngày</span>
              <h4 className="font-headline-sm text-headline-sm text-secondary-fixed">Bánh Cookie</h4>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80 line-clamp-1">Bơ hạt giòn rụm, ngọt dịu cho tiệc trà tao nhã.</p>
            </div>
          </Link>
          <Link className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-center p-6 shadow-sm hover:shadow-md transition-all duration-300" href={routes.category("sinh-nhat-su-kien")}>
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="font-label-eyebrow text-label-eyebrow text-secondary uppercase tracking-[0.2em] block mb-1">05 / Dịp Đặc Biệt</span>
                <h4 className="font-headline-sm text-headline-sm text-primary mb-1">Sinh Nhật &amp; Sự Kiện</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Bánh nghệ thuật thủ công &amp; bàn tiệc trà tao nhã theo thiết kế riêng biệt.</p>
              </div>
              <span className="w-10 h-10 rounded-full bg-primary text-secondary-fixed flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight aria-hidden="true" className="size-[18px]" />
              </span>
            </div>
          </Link>
          <Link className="h-full relative group overflow-hidden rounded bg-surface-container flex flex-col justify-center p-6 shadow-sm hover:shadow-md transition-all duration-300" href={routes.category("banh-hat")}>
            <img alt="Bánh hạt dinh dưỡng Minh Sam" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy4q29gVY855g_aoS-e0PnofwMzijHJBo_KxEfM99ceYAWXZ4rs8KwSclrM4q4dxN4JG1439eWs-75V6lYYCyeqEjgqfLBypCjyPOzJUoZw-MyYakQr6SlwLSUHvcgkUAJM3-jhg_f7CTvEVDVaJcl7w6xPPUqkvRVQfvj6QVYJObnA5tjzI5G5bVgHcvhu5m1xPg02LaWqoyGZuwx1CrlaoByxmEAPjgq4PeksFEZvOvJM8YeZaHczuBf7I8Y4-paDQ" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
            <div className="relative z-10 flex items-center justify-between text-on-primary">
              <div>
                <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed uppercase tracking-[0.2em] block mb-1">06 / Dinh Dưỡng &amp; Thanh Lành</span>
                <h4 className="font-headline-sm text-headline-sm text-secondary-fixed mb-1">Bánh Hạt Tự Nhiên</h4>
                <p className="font-body-sm text-body-sm text-secondary-fixed-dim/90 max-w-sm">Hạt dinh dưỡng cao cấp tuyển chọn, vị ngọt tự nhiên không đường tinh luyện.</p>
              </div>
              <span className="w-10 h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight aria-hidden="true" className="size-[18px]" />
              </span>
            </div>
          </Link>
        </StaggerReveal>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto flex items-center justify-between pt-8 text-on-surface-variant" delay={0.12} y={14}>
        <div className="flex items-center gap-3">
          <span className="font-label-eyebrow text-label-eyebrow text-secondary uppercase tracking-[0.2em]">02 / 07</span>
          <span className="w-8 h-[1px] bg-outline-variant" />
          <span className="font-label-eyebrow text-label-eyebrow uppercase">Danh Mục Sản Phẩm</span>
        </div>
        <Link className="font-label-ui text-label-ui text-primary uppercase tracking-wider hover:text-secondary transition-colors" href={routes.products}>Xem toàn bộ menu bánh →</Link>
      </Reveal>
    </section>
  );
}
