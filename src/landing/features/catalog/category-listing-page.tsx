"use client";

/* eslint-disable @next/next/no-img-element */
import {
  Award, CakeSlice, CalendarDays, ChevronLeft, ChevronRight, Eye, Leaf,
  MessageSquare, Palette, ShoppingBag, Sparkles, Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CatalogFilterForm, CatalogSearchForm, CatalogToolbar, OccasionTabs } from "./catalog-controls";
import { catalogProducts } from "./data";
import { CATALOG_PAGE_SIZE, catalogQueryToSearchParams, filterCatalogProducts, productCountForCategory, type CatalogQuery } from "./query";
import type { CatalogCategory } from "./types";
import { routes } from "@/landing/lib/routes";

const quoteIcons = { calendar: CalendarDays, palette: Palette, cake: CakeSlice };

export function CategoryListingPage({ category, query }: { category: CatalogCategory; query: CatalogQuery }) {
  const router = useRouter();
  const filteredProducts = filterCatalogProducts(category.slug, query);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / CATALOG_PAGE_SIZE));
  const currentPage = Math.min(query.page, pageCount);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * CATALOG_PAGE_SIZE, currentPage * CATALOG_PAGE_SIZE);
  const categoryCounts = Object.fromEntries(["banh-trung-thu", "san-pham-truyen-thong", "san-pham-moi", "banh-cookie", "sinh-nhat-su-kien", "banh-hat", "qua-tang"].map((slug) => [slug, productCountForCategory(slug)]));
  const updateQuery = (patch: Partial<CatalogQuery>) => {
    const next = { ...query, ...patch, page: patch.page ?? 1 };
    const params = catalogQueryToSearchParams(next);
    router.push(`${routes.category(category.slug)}${params.size ? `?${params}` : ""}`, { scroll: false });
  };
  const resetQuery = () => updateQuery({ q: "", types: [], price: "all", mode: "all", sort: "default", page: 1 });
  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-surface pt-20">
      <section className="w-full bg-surface-container-low pt-space-lg pb-space-xl">
        <div className="mx-auto max-w-[1360px] px-margin md:px-margin-tablet xl:px-margin-desktop">
          <nav aria-label="Đường dẫn trang" className="mb-space-sm flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <Link className="transition-colors hover:text-primary" href={routes.home}>Trang chủ</Link><span className="text-outline-variant">/</span><Link className="transition-colors hover:text-primary" href={routes.products}>Sản phẩm</Link><span className="text-outline-variant">/</span><span className="font-semibold text-primary">{category.name}</span>
          </nav>
          <div className="flex flex-col justify-between gap-space-lg pt-space-xs lg:flex-row lg:items-end">
            <div className="max-w-2xl"><div className="mb-space-sm inline-flex items-center gap-1.5 rounded bg-surface-container-highest px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary"><Sparkles className="size-4" /> BỘ SƯU TẬP DI SẢN • NĂM 2026</div><h1 className="font-headline-lg text-headline-lg leading-tight text-primary">Khám phá bánh Minh Sâm <span className="mt-1 block text-[28px] font-normal italic text-primary-container md:text-[32px]">— Nghệ thuật đúc kết từ hương vị Tràng An</span></h1></div>
            <div className="max-w-md shrink-0 py-1 lg:border-l-2 lg:border-secondary/40 lg:pl-space-md"><p className="font-body-md text-body-md leading-relaxed italic text-on-surface-variant">“Mỗi chiếc bánh không đơn thuần là món quà ngọt lành, mà là bản giao hưởng giữa thức nếp mùa mới, sen Tây Hồ thanh nhã và đôi bàn tay tỉ mẩn của người nghệ nhân.”</p></div>
          </div>
          <div className="mt-space-lg max-w-3xl"><CatalogSearchForm key={query.q} onSearch={(q) => updateQuery({ q })} value={query.q} /></div>
          <OccasionTabs />
        </div>
      </section>

      <section className="w-full py-space-xl">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start gap-gutter-desktop px-margin md:px-margin-tablet lg:flex-row xl:px-margin-desktop">
          <aside className="w-full rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:sticky lg:top-28 lg:w-72 lg:shrink-0"><CatalogFilterForm counts={categoryCounts} onChange={updateQuery} onReset={resetQuery} query={query} /></aside>
          <div className="w-full min-w-0 flex-1">
            <CatalogToolbar onChange={updateQuery} onReset={resetQuery} query={query} resultCount={filteredProducts.length} />
            {visibleProducts.length > 0 ? <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm"><h3 className="font-headline-sm text-headline-sm text-primary">Chưa có sản phẩm phù hợp</h3><p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">Danh mục này hiện chưa có sản phẩm khớp với bộ lọc. Vui lòng thử tiêu chí khác.</p><button className="mt-space-md rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-on-primary" onClick={resetQuery} type="button">Xóa bộ lọc</button></div>}
            <div className="mt-space-xl flex flex-col items-center gap-space-md pt-space-lg"><div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant"><span>Trang {currentPage} / {pageCount}</span><span>•</span><span>Hiển thị {visibleProducts.length} trên tổng số {filteredProducts.length} dòng bánh</span></div>{pageCount > 1 && <div className="flex items-center gap-space-sm"><PageButton disabled={currentPage === 1} label="Trang trước" onClick={() => updateQuery({ page: currentPage - 1 })}><ChevronLeft className="size-[18px]" /></PageButton>{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button className={`flex size-10 items-center justify-center rounded font-medium ${page === currentPage ? "bg-primary text-secondary-fixed" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`} key={page} onClick={() => updateQuery({ page })} type="button">{page}</button>)}<PageButton disabled={currentPage === pageCount} label="Trang sau" onClick={() => updateQuery({ page: currentPage + 1 })}><ChevronRight className="size-[18px]" /></PageButton></div>}</div>
          </div>
        </div>
      </section>
      <OrderingInformation />
    </main>
  );
}

function PageButton({ children, disabled, label, onClick }: { children: React.ReactNode; disabled: boolean; label: string; onClick: () => void }) {
  return <button aria-label={label} className={`flex size-10 items-center justify-center rounded ${disabled ? "cursor-not-allowed bg-surface-container-high text-outline" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

function ProductCard({ product }: { product: (typeof catalogProducts)[number] }) {
  const pricing = product.pricing;
  const detailHref = routes.product(product.slug);
  const QuoteIcon = pricing.mode === "quote" ? quoteIcons[pricing.icon] : MessageSquare;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container"><img alt={product.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} />{product.badge && <span className={`absolute top-3 left-3 rounded px-2 py-0.5 font-label-eyebrow text-label-eyebrow uppercase shadow-sm ${product.badgeClassName}`}>{product.badge}</span>}</div>
      <div className="flex flex-1 flex-col justify-between p-space-md"><div><h3 className="mb-1 font-headline-sm text-headline-sm text-primary transition-colors group-hover:text-primary-container">{product.name}</h3><p className="mb-space-sm line-clamp-2 font-body-md text-body-md text-on-surface-variant">{product.description}</p></div><div className="mt-space-xs flex flex-col gap-space-sm pt-space-sm">
        {pricing.mode === "fixed" ? <div className="flex items-baseline justify-between"><span className="font-price-serif text-[18px] text-primary">{pricing.price}</span><span className="font-body-sm text-body-sm text-outline">{pricing.unit}</span></div> : <div className="flex items-center justify-between"><span className="flex items-center gap-1 font-label-ui text-label-ui font-semibold uppercase tracking-wider text-secondary"><QuoteIcon className="size-4" /> Liên hệ tư vấn</span><span className="font-body-sm text-body-sm text-outline">{pricing.detail}</span></div>}
        <div className="flex items-center gap-space-xs"><Link className={`flex flex-1 items-center justify-center gap-1 rounded px-space-sm py-2 font-label-ui text-label-ui uppercase tracking-wider transition-colors ${pricing.mode === "fixed" ? "bg-primary text-on-primary hover:bg-primary-container" : "bg-secondary text-on-secondary hover:bg-on-secondary-container"}`} href={detailHref}>{pricing.mode === "fixed" ? <ShoppingBag className="size-4" /> : <MessageSquare className="size-4" />}{pricing.mode === "fixed" ? "Mua ngay" : "Nhận tư vấn"}</Link><Link aria-label={`Xem chi tiết ${product.name}`} className="rounded p-2 text-primary transition-colors hover:bg-surface-container" href={detailHref}><Eye className="size-5" /></Link></div>
      </div></div>
    </article>
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
