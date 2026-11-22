"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Coffee,
  HandHeart,
  PartyPopper,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CatalogSearchForm } from "./catalog-controls";
import { productCountForCategory } from "./query";
import type { CatalogCategory, CatalogProduct } from "./types";
import { routes } from "@/landing/lib/routes";
import { SafeImage } from "@/landing/components/ui/safe-image";
import { BannerMedia } from "@/landing/features/banners/components/banner-media/banner-media";
import type { LandingBanner } from "@/landing/features/banners/types";

const promotions = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAG8GDod63y5vKAGTpCgWrnXmiQ7JD38hyHPvx1BQMeEcdRGD00jumzKlEDWaw2GbVmzALemXR_J_SAyDI31jJCSgidmksP4JywdlzsUpZLsY3_Q-YhA_jRcWTigcb_F-IWUgXwFfrKT64M4DXXiGL5dRTLpoaMa5hy4ik2wIx-jgGbQov7uJmLIEAskZc6z8DsiPqouWYbbEEApbmp1qMlt1y9KpUptopvhXHsiWYyDcIQbI8pXJ59",
    alt: "Tết Sum Vầy: Tặng Trà Sen Tây Hồ",
    badge: "ƯU ĐÃI THEO MÙA",
    badgeClass: "bg-primary text-secondary-fixed",
    title: "Tết Sum Vầy: Tặng Trà Sen Tây Hồ",
    description:
      "Tặng kèm 01 hộp Trà Sen Thượng Hạng Tây Hồ khi đặt Bộ Quà Di Sản có giá trị từ 1.200.000đ.",
    detail: "Quà tặng trị giá 280.000đ",
    action: "Khám phá ưu đãi",
    href: routes.category("qua-tang"),
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhXAqvGL5v3281IHCgr8mZbkrmr4y-KM-nfToKCELy-uOS9g2XKOA54vmih8O90OfRH5gwwA2rPq0EBIicNaY96vWqeRqai3Y72lMQLepaCQ_HioCmQ8F0MtKK_yK19WnUvGXgz9hdu7R-VnBnupuqP8RI6pxbBerAbUyGUMaPSu4SPrWLhXxU_OzRfKNY_ySw7Ptic_Kfsz6WDniCX2zPmOrDUEejjjn7AubM6LWN6-NdcMpYhClj",
    alt: "Tiệc Trà Chiều: Giảm 10% khi kết hợp Bánh Mochi & Cookie thủ công",
    badge: "ƯU ĐÃI THEO MÙA",
    badgeClass: "bg-secondary text-on-secondary",
    title: "Tiệc Trà Chiều: Giảm 10% Combo",
    description:
      "Giảm ngay 10% khi chọn mua kết hợp giữa Hộp Bánh Mochi Ngũ Sắc và Cookie Bơ Hạt cao cấp.",
    detail: "Áp dụng giỏ hàng trực tuyến",
    action: "Xem bộ sưu tập",
    href: routes.products,
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6i48ORNlSsNpcHfRwSLi0aAr5Ak6J5AJJjNp87_snYtINqHI545LxQ6NgmlUIapBwdcFtX5aK6RJOvJrbzAHiCae3IvuNLR6DjmKifCY6XfxfD9h8mnlcipE_BLCtWD9urh8EGkSueVs8UAgnDd2iCTtrI_L5LoLm-RmXNFy0RUs38poLzEDhLcgCo0-0ocfKsSjdC7KNidlntwcxG6Ck6OoPHvUmtrZ60TWMct09TcDV13Ht2XFH",
    alt: "Dịch Vụ Khắc Kim Doanh Nghiệp",
    badge: "DOANH NGHIỆP",
    badgeClass: "bg-primary-container text-secondary-fixed",
    title: "Dịch Vụ Khắc Kim Doanh Nghiệp",
    description:
      "Miễn phí ép kim logo thương hiệu, in thiệp thư pháp tay và thiết kế dải ruy băng lụa tơ tằm theo màu nhận diện.",
    detail: "Từ 20 set quà tặng",
    action: "Tư vấn doanh nghiệp",
    href: routes.product("bo-hop-doanh-nghiep-son-mai-tri-an"),
  },
];

const occasions = [
  {
    Icon: UsersRound,
    title: "Sum họp gia đình",
    text: "Các dòng bánh cổ truyền, đĩa bánh tiếp khách thân mật, bánh chả lá chanh giòn rụm.",
    slug: "san-pham-truyen-thong",
  },
  {
    Icon: HandHeart,
    title: "Biếu tặng người thân",
    text: "Hộp quà trang nhã, dòng bánh hạt dưỡng lành ít ngọt, vị ngọt thanh tự nhiên từ mật mía.",
    slug: "qua-tang",
  },
  {
    Icon: Building2,
    title: "Quà tặng đối tác & Doanh nghiệp",
    text: "Hộp quà sơn mài cao cấp, dập chìm gia huy, cá nhân hóa logo trang trọng tinh tế.",
    slug: "qua-tang",
  },
  {
    Icon: PartyPopper,
    title: "Sinh nhật & Sự kiện đặc biệt",
    text: "Bánh kem nghệ thuật vẽ tay hoa sen, tháp bánh tiệc trà hoàng gia may đo riêng.",
    slug: "sinh-nhat-su-kien",
  },
  {
    Icon: Coffee,
    title: "Thưởng thức mỗi ngày",
    text: "Cookie giòn bơ Pháp, bánh mochi mềm mát, bánh mì bơ hoa cúc nướng mới buổi sớm.",
    slug: "banh-cookie",
  },
];

export function StorefrontPage({ catalogCategories, catalogProducts, heroBanners = [] }: { catalogCategories: CatalogCategory[]; catalogProducts: CatalogProduct[]; heroBanners?: LandingBanner[] }) {
  const router = useRouter();
  function searchCatalog(value: string) {
    const q = value.trim();
    if (!q) return;
    const normalized = q.toLocaleLowerCase("vi");
    const match = catalogProducts.find((product) => {
      const category = catalogCategories.find(
        (item) => item.slug === product.categorySlug,
      );
      return `${product.name} ${product.description} ${category?.name ?? ""}`
        .toLocaleLowerCase("vi")
        .includes(normalized);
    });
    if (match)
      router.push(
        `${routes.category(match.categorySlug)}?q=${encodeURIComponent(q)}`,
      );
  }
  return (
    <main className="min-h-[calc(100vh-500px)] w-full bg-surface pt-[var(--landing-header-height)]">
      <section className="w-full bg-surface-container-low px-gutter py-space-sm shadow-sm lg:px-gutter-desktop">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-space-sm md:flex-row">
          <div className="w-full md:w-7/12">
            <CatalogSearchForm compact onSearch={searchCatalog} />
          </div>
          <div className="flex w-full flex-wrap items-center justify-start gap-space-xs md:w-5/12 md:justify-end">
            <span className="flex items-center gap-1 font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-surface-variant">
              <TrendingUp className="size-3.5 text-secondary" /> Tìm nhiều:
            </span>
            {[
              ["Hộp quà Tết Đoan Viên", "qua-tang"],
              ["Bánh Thập Cẩm Cổ Truyền", "banh-trung-thu"],
              ["Cookie Bơ Pháp", "banh-cookie"],
            ].map(([tag, slug], index) => (
              <Link
                className={`rounded bg-surface-container px-2.5 py-1 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-secondary-container hover:text-on-secondary-container ${index === 2 ? "hidden lg:inline-block" : ""}`}
                href={routes.category(slug)}
                key={tag}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-gutter pt-space-lg pb-space-xl lg:px-gutter-desktop">
        <div className="relative flex min-h-[360px] w-full items-center overflow-hidden rounded bg-primary shadow-xl lg:min-h-[390px]">
          <div className="absolute inset-0">
            <BannerMedia banners={heroBanners} fallback={{ desktopImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAplQ2BD82uHi8-c52Mula5kD7IRr5s34iAf18F7xgoBWzU_dD_FM7AGMMA3DW4jR58-ATMCxnH5JwAyEnYn1-4j_njhh4G9TeRHEjobs8bxX2oZw9IVKMi9lP9cSHpRIW0lGLZIX4j4EMA8wkgvvVytkzaOPByf9i7-tEo7dLLOWW_85_-7mSAOvg2XtAZ5rX2PHI5VG72Lbxg6m15ck8oZeoa15hERT5iWMdIfLv9ppwolPMZ8rnp", alt: "Chiến dịch Tết Nguyên Đán Minh Sâm Bakery" }} imageClassName="h-full w-full scale-105 object-cover object-center opacity-40 mix-blend-luminosity" linkMedia={false} priority />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary-container/80" />
          </div>
          <div className="relative z-10 flex min-w-0 w-full flex-col items-start justify-between gap-space-lg px-gutter py-space-xl lg:flex-row lg:items-center lg:px-space-xl">
            <div className="flex min-w-0 max-w-2xl flex-col gap-space-sm">
              <div className="inline-flex max-w-full flex-wrap items-center gap-space-xs self-start rounded bg-primary-container px-3 py-1 text-secondary-fixed shadow-sm">
                <span className="size-1.5 shrink-0 animate-ping rounded-full bg-secondary-fixed" />
                <span className="min-w-0 font-label-eyebrow text-label-eyebrow uppercase tracking-[0.2em]">
                  CHIẾN DỊCH TẾT NGUYÊN ĐÁN 2026 • BỘ SƯU TẬP GIỚI HẠN
                </span>
              </div>
              <h1 className="max-w-full break-words font-display-hero text-display-hero-mobile leading-tight tracking-tight text-secondary-fixed lg:text-display-hero">
                Tết trọn vị,
                <br className="hidden sm:inline" />{" "}
                <span className="font-normal italic text-surface-bright">
                  quà trọn tình.
                </span>
              </h1>
              <p className="max-w-xl font-body-lg text-body-lg leading-relaxed text-primary-fixed-dim">
                Khám phá những lựa chọn bánh và quà Tết dành cho gia đình, người
                thân và đối tác — gửi gắm phong vị Tràng An trang trọng trong
                từng lớp men gốm và hộp sơn mài thủ công.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link
                  className="group flex items-center gap-2 rounded bg-secondary px-space-lg py-space-sm font-label-ui text-label-ui text-on-secondary shadow-md transition-all hover:bg-secondary-container hover:text-on-secondary-container"
                  href={routes.category("qua-tang")}
                >
                  Khám phá quà Tết{" "}
                  <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  className="rounded bg-primary-container px-space-lg py-space-sm font-label-ui text-label-ui text-secondary-fixed transition-colors hover:bg-secondary/20"
                  href="#danh-muc"
                >
                  Xem các dòng bánh
                </a>
              </div>
            </div>
            <div className="flex w-full flex-col justify-between gap-space-xs self-stretch rounded bg-surface-container-lowest/10 p-space-md shadow-lg backdrop-blur-md lg:w-80 lg:self-center">
              <div className="flex items-center gap-2 text-secondary-fixed">
                <Award className="size-5" />
                <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider">
                  Đặc quyền Doanh Nghiệp
                </span>
              </div>
              <p className="font-headline-sm text-subheading text-surface-bright">
                Ưu đãi đặt sớm Tết 2026
              </p>
              <p className="font-body-sm text-body-sm leading-relaxed text-primary-fixed-dim">
                Miễn phí khắc logo mạ vàng gia huy, đính kèm thiệp thư pháp tay
                & chiết khấu đặt trước tới 20% cho đơn hàng doanh nghiệp.
              </p>
              <span className="pt-2 text-xs text-primary-fixed-dim">
                Áp dụng đến hết 28 Chạp
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-gutter py-space-lg lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="Chính Sách Đặc Quyền"
          title="Ưu đãi đang diễn ra"
          description="Các chương trình tri ân mùa sum vầy và quà tặng kèm giới hạn dành cho khách hàng thân thiết và đối tác."
          icon
        />
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          {promotions.map((promo) => (
            <article
              className="group flex flex-col justify-between overflow-hidden rounded bg-surface-container-lowest shadow-sm transition-all hover:shadow-md"
              key={promo.title}
            >
              <div className="relative h-44 overflow-hidden bg-surface-container">
                <img
                  alt={promo.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={promo.image}
                />
                <span
                  className={`absolute top-3 left-3 rounded px-2 py-0.5 font-label-eyebrow text-[10px] uppercase tracking-widest ${promo.badgeClass}`}
                >
                  {promo.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-space-xs p-space-md">
                <div>
                  <h3 className="font-headline-sm text-subheading text-primary transition-colors group-hover:text-secondary">
                    {promo.title}
                  </h3>
                  <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                    {promo.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-space-sm">
                  <span className="font-price-serif text-body-sm font-semibold text-secondary">
                    {promo.detail}
                  </span>
                  <Link
                    className="flex items-center gap-1 font-label-ui text-label-ui font-medium text-primary hover:text-secondary"
                    href={promo.href}
                  >
                    {promo.action}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-[1360px] scroll-mt-[var(--landing-header-height)] px-gutter py-space-xl lg:px-gutter-desktop"
        id="danh-muc"
      >
        <SectionHeading
          eyebrow="DANH MỤC SẢN PHẨM MINH SÂM"
          title="Khám phá các dòng bánh"
          description="Từ những dòng bánh quen thuộc đến các bộ sưu tập theo mùa và hương vị phục vụ mỗi ngày."
        />
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
          {catalogCategories.map((category) => {
            const content = <>
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                <SafeImage
                  alt={category.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={category.image}
                />
                <span
                  className={`absolute top-2.5 rounded px-2 py-0.5 font-label-eyebrow text-[10px] font-semibold uppercase tracking-wider ${category.badgeClassName}`}
                >
                  {category.badge}
                </span>
                <span className="absolute bottom-2 left-3 font-display-hero text-headline-sm text-primary/30">
                  {category.number}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-space-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary transition-colors group-hover:text-secondary">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                    {category.description}
                  </p>
                </div>
                <div className="mt-space-xs flex items-center justify-between pt-space-sm">
                  <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-outline">
                    {category.label}
                  </span>
                  <span className="flex items-center gap-1 font-label-ui text-label-ui font-semibold text-primary transition-colors group-hover:text-secondary">
                    Xem tất cả <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </>;
            const className = "group relative flex flex-col justify-between overflow-hidden rounded bg-surface-container-lowest shadow-sm transition-all hover:shadow-md";
            return <Link className={className} href={routes.category(category.slug)} key={category.id ?? category.slug}>{content}</Link>;
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop" id="san-pham-truc-tuyen">
        <SectionHeading
          eyebrow="DỮ LIỆU SẢN PHẨM TRỰC TUYẾN"
          title="Sản phẩm đang phục vụ"
          description="Danh mục, giá và quy cách bên dưới được đồng bộ từ hệ thống Minh Sâm Bakery."
        />
        <div className="mb-space-lg flex flex-wrap gap-space-xs">
          {catalogCategories.map((category) => (
            <Link className="rounded-full bg-surface-container-lowest px-4 py-2 font-label-ui text-label-ui text-primary shadow-sm transition-colors hover:bg-primary hover:text-on-primary" href={routes.category(category.slug)} key={category.slug}>
              {category.name} <span className="text-on-surface-variant">({productCountForCategory(category.slug, catalogProducts)})</span>
            </Link>
          ))}
        </div>
        {catalogProducts.length ? <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3">
          {catalogProducts.map((product) => (
            <article className="group overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md" key={product.id}>
              <Link href={routes.product(product.slug)}>
                <div className="aspect-[4/3] overflow-hidden bg-surface-container"><SafeImage alt={product.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={product.image} /></div>
                <div className="p-space-md"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-secondary">{catalogCategories.find((category) => category.slug === product.categorySlug)?.name ?? product.categorySlug}</span><h3 className="mt-1 font-headline-sm text-headline-sm text-primary">{product.name}</h3><p className="mt-1 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">{product.description}</p><div className="mt-space-sm flex items-center justify-between"><span className="font-price-serif text-price-serif font-semibold text-primary">{product.pricing.mode === "fixed" ? product.pricing.price : "Liên hệ tư vấn"}</span><span className="flex items-center gap-1 font-label-ui text-label-ui font-semibold text-primary">Chi tiết <ArrowRight className="size-4" /></span></div></div>
              </Link>
            </article>
          ))}
        </div> : <div className="rounded-xl bg-surface-container-lowest p-space-lg text-center font-body-md text-on-surface-variant shadow-sm">Chưa có sản phẩm được công khai.</div>}
      </section>

      <FeaturedSeason products={catalogProducts} />

      <section className="mx-auto w-full max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <SectionHeading
          eyebrow="GỢI Ý THƯỞNG NGOẠN"
          title="Chọn bánh cho từng dịp"
          description="Mỗi phong vị được nghệ nhân Minh Sâm cân bằng riêng biệt phù hợp từng khoảnh khắc sum vầy, ngoại giao và thưởng trà."
        />
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-5">
          {occasions.map(({ Icon, title, text, slug }) => (
            <Link
              className="group flex flex-col justify-between rounded bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md"
              href={routes.category(slug)}
              key={title}
            >
              <div className="mb-space-sm flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-full bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-secondary-fixed">
                  <Icon className="size-5" />
                </span>
                <ArrowRight className="size-5 text-outline transition-all group-hover:translate-x-1 group-hover:text-secondary" />
              </div>
              <div>
                <h3 className="font-headline-sm text-subheading text-primary transition-colors group-hover:text-secondary">
                  {title}
                </h3>
                <p className="mt-1.5 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                  {text}
                </p>
              </div>
              <div className="mt-space-md pt-space-xs font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-wider text-secondary">
                Xem {productCountForCategory(slug, catalogProducts)} sản phẩm →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="w-full bg-surface-container-highest/80 px-gutter py-space-sm text-center shadow-inner backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <BadgeCheck className="size-[18px] shrink-0 text-secondary" />
          <span>
            Cam kết nguyên liệu thuần khiết, không chất bảo quản công nghiệp •
            Giao nhanh 2h tại nội thành Hà Nội
          </span>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  icon = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: boolean;
}) {
  return (
    <div className="mb-space-lg flex flex-col justify-between gap-space-xs md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <div className="mb-1 flex items-center gap-2 text-secondary">
            {icon && <BadgeCheck className="size-[18px]" />}
            <span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-[0.2em]">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      )}
    </div>
  );
}

function FeaturedSeason({ products }: { products: CatalogProduct[] }) {
  const featuredProduct = products.find((product) => product.isFeatured) ?? products[0];
  if (!featuredProduct) return null;
  const supportingProducts = products.filter((product) => product.id !== featuredProduct.id).slice(0, 3);

  return (
    <section className="w-full bg-surface-container-low px-gutter py-space-xl lg:px-gutter-desktop">
      <div className="mx-auto max-w-[1360px]">
        <SectionHeading title="Nổi bật mùa này" />
        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
          <article className="group flex flex-col justify-between overflow-hidden rounded bg-surface-container-lowest shadow-md lg:col-span-6">
            <div className="relative h-[340px] overflow-hidden bg-primary lg:h-[380px]">
              <SafeImage
                alt={featuredProduct.imageAlt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={featuredProduct.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="rounded bg-secondary px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-secondary shadow">
                  {featuredProduct.isBestSeller ? "SẢN PHẨM BÁN CHẠY" : "SẢN PHẨM NỔI BẬT"}
                </span>
              </div>
              <div className="absolute right-4 bottom-4 left-4 text-surface-bright">
                <span className="font-label-eyebrow text-[10px] uppercase tracking-widest text-secondary-fixed">
                  {featuredProduct.sku ? `MÃ SP: ${featuredProduct.sku}` : "MINH SÂM BAKERY"}
                </span>
                {featuredProduct.description ? <p className="mt-0.5 font-body-sm text-body-sm text-primary-fixed-dim">{featuredProduct.description}</p> : null}
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-space-md p-space-lg">
              <div>
                <h3 className="mt-1 font-headline-lg text-headline-sm text-primary lg:text-headline-md">
                  {featuredProduct.name}
                </h3>
                {featuredProduct.description ? <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{featuredProduct.description}</p> : null}
              </div>
              <div className="flex flex-col justify-between gap-space-sm pt-space-md sm:flex-row sm:items-center">
                <div>
                  <span className="block font-label-eyebrow text-[11px] uppercase text-outline">GIÁ HIỆN TẠI</span>
                  <span className="font-headline-sm text-subheading font-semibold text-secondary">
                    {catalogPrice(featuredProduct)}
                  </span>
                </div>
                <Link className="rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-secondary-fixed shadow-sm hover:bg-primary-container" href={routes.product(featuredProduct.slug)}>Xem chi tiết</Link>
              </div>
            </div>
          </article>
          <div className="flex flex-col justify-between gap-space-md lg:col-span-6">
            {supportingProducts.map((item) => (
              <article
                className="group flex flex-col items-center gap-space-md rounded bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md sm:flex-row"
                key={item.id}
              >
                <div className="h-36 w-full shrink-0 overflow-hidden rounded bg-surface-container sm:w-36">
                  <SafeImage
                    alt={item.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                  />
                </div>
                <div className="flex w-full flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase text-secondary">
                        {item.isBestSeller ? "BÁN CHẠY" : item.isFeatured ? "NỔI BẬT" : "SẢN PHẨM MINH SÂM"}
                      </span>
                      <span className="font-price-serif text-price-serif font-bold text-primary">{catalogPrice(item)}</span>
                    </div>
                    <h4 className="mt-0.5 font-headline-sm text-subheading text-primary group-hover:text-secondary">
                      {item.name}
                    </h4>
                    {item.description ? <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{item.description}</p> : null}
                  </div>
                  <div className="mt-space-xs flex items-center justify-between pt-space-sm">
                    <span className="font-body-sm text-body-sm text-outline">{item.sku ? `Mã SP: ${item.sku}` : "Minh Sâm Bakery"}</span>
                    <Link
                      className="flex items-center gap-1 rounded bg-primary px-space-md py-1.5 font-label-ui text-label-ui text-secondary-fixed"
                      href={routes.product(item.slug)}
                    >
                      Xem chi tiết <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function catalogPrice(product: CatalogProduct) {
  return product.pricing.mode === "fixed" ? product.pricing.price : "Liên hệ tư vấn";
}
