"use client";

import {
  Award, Leaf, Sparkles, Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CatalogSearchForm, OccasionTabs } from "./catalog-controls";
import { CatalogBrowser } from "./catalog-browser";
import { catalogQueryToSearchParams, type CatalogQuery } from "./query";
import type { CatalogCategory, CatalogPage } from "./types";
import { routes } from "@/landing/lib/routes";

export function CategoryListingPage({ category, categories, page, query }: { category: CatalogCategory; categories: CatalogCategory[]; page: CatalogPage | null; query: CatalogQuery }) {
  const router = useRouter();
  const updateSearch = (q: string) => {
    const next = { ...query, q, page: 1 };
    const params = catalogQueryToSearchParams(next, { includeCategory: false });
    router.push(`${routes.category(category.slug)}${params.size ? `?${params}` : ""}`, { scroll: false });
  };
  return (
    <main className="min-h-[calc(100vh-var(--landing-header-height))] w-full bg-surface pt-[var(--landing-header-height)]">
      <section className="w-full bg-surface-container-low pt-space-lg pb-space-xl">
        <div className="mx-auto max-w-[1360px] px-margin md:px-margin-tablet xl:px-margin-desktop">
          <nav aria-label="Đường dẫn trang" className="mb-space-sm flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <Link className="transition-colors hover:text-primary" href={routes.home}>Trang chủ</Link><span className="text-outline-variant">/</span><Link className="transition-colors hover:text-primary" href={routes.products}>Sản phẩm</Link><span className="text-outline-variant">/</span><span className="font-semibold text-primary">{category.name}</span>
          </nav>
          <div className="flex flex-col justify-between gap-space-lg pt-space-xs lg:flex-row lg:items-end">
            <div className="max-w-2xl"><div className="mb-space-sm inline-flex items-center gap-1.5 rounded bg-surface-container-highest px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary"><Sparkles className="size-4" /> BỘ SƯU TẬP DI SẢN • NĂM 2026</div><h1 className="font-headline-lg text-headline-lg leading-tight text-primary">Khám phá bánh Minh Sâm <span className="mt-1 block text-[28px] font-normal italic text-primary-container md:text-[32px]">— Nghệ thuật đúc kết từ hương vị Tràng An</span></h1></div>
            <div className="max-w-md shrink-0 py-1 lg:border-l-2 lg:border-secondary/40 lg:pl-space-md"><p className="font-body-md text-body-md leading-relaxed italic text-on-surface-variant">“Mỗi chiếc bánh không đơn thuần là món quà ngọt lành, mà là bản giao hưởng giữa thức nếp mùa mới, sen Tây Hồ thanh nhã và đôi bàn tay tỉ mẩn của người nghệ nhân.”</p></div>
          </div>
          <div className="mt-space-lg max-w-3xl"><CatalogSearchForm key={query.q} onSearch={updateSearch} value={query.q} /></div>
          <OccasionTabs />
        </div>
      </section>

      <section className="w-full py-space-xl">
        <div className="mx-auto max-w-[1360px] px-margin md:px-margin-tablet xl:px-margin-desktop"><CatalogBrowser basePath={routes.category(category.slug)} categories={categories} categoryRouteSlug={category.slug} page={page} query={query} /></div>
      </section>
      <OrderingInformation />
    </main>
  );
}

const assurances = [
  { Icon: Truck, title: "Giao Hỏa Tốc Tại Hà Nội", text: "Giao nhanh trong 2 giờ nội thành Hà Nội cho các dòng bánh tươi thường nhật. Đóng gói hộp giữ nhiệt cẩn trọng.", note: "Miễn phí giao hàng từ 500.000đ" },
  { Icon: Leaf, title: "Nguyên Liệu Tinh Tuyển", text: "Không chất bảo quản công nghiệp. 100% cốm mộc làng Vòng, hạt sen hồ Tây và trứng muối tươi tuyển chọn thủ công.", note: "Chứng nhận An toàn Thực phẩm" },
  { Icon: Award, title: "Dịch Vụ Quà Tặng Thượng Hạng", text: "Kèm thiệp viết tay thư pháp, túi gấm sang trọng và tư vấn thiết kế thiệp tri ân cho cá nhân cùng đối tác doanh nghiệp.", note: "Tư vấn tận tình qua Zalo & Hotline" },
];

function OrderingInformation() {
  return <section className="w-full bg-surface-container-low py-space-xl"><div className="mx-auto max-w-[1360px] px-margin md:px-margin-tablet xl:px-margin-desktop"><div className="mx-auto mb-space-lg max-w-xl text-center"><span className="mb-space-xs block font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Tận Tâm Phục Vụ</span><h2 className="font-headline-md text-headline-md text-primary">Chính Sách Đặt Bánh & Giao Hàng</h2><p className="mt-1 font-body-md text-body-md text-on-surface-variant">Mỗi mẻ bánh được nướng mới mỗi sáng tại xưởng phố cổ, bảo đảm vẹn nguyên phong vị Tràng An khi đến tay quý khách.</p></div><div className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-3">{assurances.map(({ Icon, title, text, note }) => <article className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm" key={title}><span className="flex size-12 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed"><Icon className="size-6" /></span><h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3><p className="font-body-md text-body-md text-on-surface-variant">{text}</p><span className="font-body-sm text-body-sm font-medium text-secondary">{note}</span></article>)}</div></div></section>;
}
