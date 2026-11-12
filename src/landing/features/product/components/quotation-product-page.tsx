/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Brush, Gift, Package, Percent } from "lucide-react";
import Link from "next/link";

import type { PresentationCard, QuotationProductDetail } from "../types";
import { ProductBreadcrumb } from "./product-breadcrumb";
import { ProductGallery } from "./product-gallery";
import { QuotationActionButton } from "./quotation-action-button";
import { routes } from "@/landing/lib/routes";

export function QuotationProductPage({ product }: { product: QuotationProductDetail }) {
  return (
    <main className="min-h-[calc(100vh-20rem)] w-full bg-surface pt-20">
      <ProductBreadcrumb categoryHref={`/danh-muc/${product.catalog.categorySlug}`} categoryLabel={product.categoryLabel} productName={product.catalog.name} />

      <section className="mx-auto w-full max-w-[1360px] px-margin pt-space-xs pb-space-xl md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <ProductGallery heroImage={product.heroImage} images={product.gallery} variant="quote" />
            <div className="flex flex-col gap-3 rounded-lg bg-surface-container-lowest p-space-md shadow-sm">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Quy Cách Chuẩn Phẩm B2B</span>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 font-body-sm text-body-sm sm:grid-cols-2">
                {product.specifications.map((specification) => <div className="flex justify-between gap-3 rounded-sm bg-surface-container-low/50 px-2 py-1" key={specification.label}><dt className="text-on-surface-variant">{specification.label}</dt><dd className="text-right font-medium text-on-surface">{specification.value}</dd></div>)}
              </dl>
            </div>
          </div>

          <div className="sticky top-24 lg:col-span-5">
            <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-md md:p-space-lg">
              <div className="flex flex-col gap-1.5"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">DỊCH VỤ QUÀ TẶNG DOANH NGHIỆP & SỰ KIỆN CAO CẤP</span><h1 className="font-headline-md text-headline-md font-bold text-primary">{product.catalog.name}</h1><p className="mt-1 font-body-md text-body-md leading-relaxed text-on-surface-variant">{product.catalog.description}</p></div>

              <div className="flex flex-col gap-2.5 rounded-lg bg-surface-container p-space-md">
                <div className="flex items-center justify-between gap-2"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-surface-variant">Hình thức định giá</span><span className="rounded-sm bg-secondary-container/40 px-2.5 py-0.5 font-label-eyebrow text-[11px] font-bold uppercase tracking-wider text-secondary">Ưu đãi mùa vụ 2026</span></div>
                <span className="font-headline-md text-headline-md font-bold text-primary">Báo giá theo yêu cầu</span>
                <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">Giá và phương án đóng gói sẽ được tư vấn theo số lượng, quy cách và yêu cầu cá nhân hóa của bạn.</p>
                <div className="flex items-start gap-2 rounded-md bg-surface-container-low/60 p-2.5 font-body-sm text-body-sm text-secondary"><Percent className="mt-0.5 size-[18px] shrink-0" /><span className="font-medium text-on-surface">Chính sách chiết khấu ưu đãi 10% - 25% cho đơn hàng doanh nghiệp.</span></div>
              </div>

              <div className="flex flex-col gap-2.5"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">ĐIỂM NỔI BẬT DỊCH VỤ</span><div className="flex flex-col gap-2"><ServiceBenefit Icon={Package} title="Số lượng linh hoạt" text="Đặt từ 10 hộp tiêu chuẩn đến số lượng lớn bespoke" /><ServiceBenefit Icon={Gift} title="Tư vấn đóng gói" text="Hộp sơn mài khắc kim, túi gấm dệt hoa văn, thiệp viết tay thư pháp" /><ServiceBenefit Icon={Brush} title="Cá nhân hóa theo nhu cầu" text="Miễn phí ép kim logo doanh nghiệp & tùy biến hương vị bánh" /></div></div>

              <div className="flex flex-col gap-3 pt-1">
                <QuotationActionButton />
                <p className="text-center font-body-sm text-body-sm text-on-surface-variant">Trao đổi về số lượng, ngày nhận và nhu cầu cá nhân hóa.</p>
                <div className="flex items-center justify-center pt-1"><Link className="flex items-center gap-1 font-label-ui text-body-sm font-medium text-primary transition-colors hover:text-secondary" href={routes.category("qua-tang")}>Xem các mẫu quà khác <ArrowRight className="size-4" /></Link></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container py-space-xl">
        <div className="mx-auto max-w-[1360px] px-margin md:px-margin-tablet lg:px-margin-desktop">
          <div className="mb-space-lg flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">NÂNG TẦM TRẢI NGHIỆM</span><h2 className="mt-1 font-headline-lg text-headline-lg font-bold text-primary">Hoàn thiện món quà của bạn</h2></div><p className="max-w-md font-body-md text-body-md text-on-surface-variant">Các thức quà phong vị bổ trợ được tuyển chọn từ các vùng danh trà và nghệ nhân gốm danh tiếng.</p></div>
          <div className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-3">{product.addons.map((card) => <GiftAddonCard card={card} key={card.title} />)}</div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-margin py-space-xl md:px-margin-tablet lg:px-margin-desktop">
        <div className="mb-space-lg flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">BỘ SƯU TẬP LIÊN QUAN</span><h2 className="mt-1 font-headline-lg text-headline-lg font-bold text-primary">Các mẫu quà tặng doanh nghiệp khác</h2></div><Link className="flex items-center gap-1 font-label-ui text-label-ui text-primary transition-colors hover:text-secondary" href={routes.category("qua-tang")}>Xem toàn bộ ấn phẩm B2B <ArrowRight className="size-4" /></Link></div>
        <div className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-3">{product.alternatives.map((card) => <AlternativeGiftCard card={card} key={card.title} />)}</div>
      </section>

      <div className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between gap-3 bg-surface-container-lowest/95 px-4 py-3 shadow-[0_-4px_16px_rgba(36,22,20,0.1)] backdrop-blur-md lg:hidden"><div className="flex flex-col"><span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">Quà Tặng Doanh Nghiệp</span><span className="font-label-ui text-label-ui font-bold text-primary">Báo giá theo yêu cầu</span></div><QuotationActionButton mobile /></div>
    </main>
  );
}

function ServiceBenefit({ Icon, title, text }: { Icon: typeof Package; title: string; text: string }) {
  return <div className="flex items-start gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low/70 p-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary"><Icon className="size-[18px]" /></span><div className="flex flex-col"><span className="font-label-ui text-label-ui font-bold text-primary">{title}</span><p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{text}</p></div></div>;
}

function GiftAddonCard({ card }: { card: PresentationCard }) {
  return <article className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm"><div><div className="mb-space-sm aspect-[16/10] overflow-hidden rounded-lg bg-surface-container-low"><img alt={card.imageAlt} className="h-full w-full object-cover" src={card.image} /></div><div className="flex flex-col gap-1"><span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">{card.eyebrow}</span><h3 className="font-headline-sm text-subheading font-semibold text-primary">{card.title}</h3><p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{card.description}</p></div></div><div className="mt-4 flex items-center justify-between pt-3"><span className="font-label-ui text-body-sm font-medium text-primary">Tùy chọn bổ sung</span><span className="font-label-eyebrow text-[11px] uppercase tracking-widest text-secondary">{card.meta}</span></div></article>;
}

function AlternativeGiftCard({ card }: { card: PresentationCard }) {
  return <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"><div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-low"><img alt={card.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={card.image} />{card.badge ? <span className="absolute top-3 left-3 rounded bg-surface-container-lowest/90 px-2 py-0.5 font-label-eyebrow text-[10px] uppercase tracking-wider text-primary">{card.badge}</span> : null}</div><div className="flex flex-1 flex-col justify-between gap-3 p-space-md"><div className="flex flex-col gap-1"><span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">{card.eyebrow}</span><h3 className="font-headline-sm text-subheading font-semibold text-primary transition-colors group-hover:text-secondary">{card.title}</h3><p className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{card.description}</p></div><div className="flex items-center justify-between pt-2"><span className="font-label-ui text-body-sm font-medium text-primary">{card.meta}</span><ArrowRight className="size-5 text-on-surface-variant" /></div></div></article>;
}
