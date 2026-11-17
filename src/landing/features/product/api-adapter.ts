import "server-only";

import { backendAssetUrl } from "@/lib/api/client";
import type { ProductResponseDto } from "@/lib/api/types";
import { adaptProduct, adaptVariant } from "@/landing/features/catalog/adapters";
import type { CatalogProduct } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";

import { createDetail } from "./data";
import type { FixedPriceProductDetail, PresentationCard } from "./types";

export function adaptApiProductDetail(dto: ProductResponseDto, related: CatalogProduct[]): FixedPriceProductDetail {
  const catalog = adaptProduct(dto);
  const generatedDetail = createDetail(catalog);
  if (generatedDetail.pricing.mode !== "fixed") throw new Error("Backend product unexpectedly mapped to quotation mode");
  const generated = generatedDetail as FixedPriceProductDetail;
  const sortedImages = [...dto.images].sort((a, b) => Number(b.isCover) - Number(a.isCover) || a.sortOrder - b.sortOrder);
  const gallery = sortedImages.map((image) => ({ src: backendAssetUrl(image.url) ?? catalog.image, alt: image.alt ?? catalog.name }));
  const activeVariants = dto.variants.filter((variant) => variant.status === "ACTIVE").sort((a, b) => a.sortOrder - b.sortOrder).map(adaptVariant);
  return {
    ...generated,
    catalog,
    categoryLabel: dto.categoryName,
    heroImage: gallery[0] ?? { src: catalog.image, alt: catalog.imageAlt },
    gallery: gallery.length ? gallery : [{ src: catalog.image, alt: catalog.imageAlt }],
    galleryStrategy: "original",
    pricing: {
      mode: "fixed",
      variants: activeVariants.length
        ? activeVariants.map((variant) => ({ id: variant.id, label: variant.label, price: variant.amount, currency: variant.currency }))
        : catalog.pricing.mode === "fixed"
          ? catalog.pricing.variants.map((variant) => ({ id: variant.id, label: variant.label, price: variant.amount, currency: variant.currency }))
          : [],
    },
    presentation: {
      ...generated.presentation,
      checkoutAvailable: false,
      checkoutUnavailableMessage: "Đặt hàng trực tuyến đang được kết nối với hệ thống bán hàng. Vui lòng liên hệ cửa hàng để xác nhận.",
      priceUnitLabel: dto.variants.filter((variant) => variant.status === "ACTIVE").length > 1 ? "/ quy cách đã chọn" : "/ sản phẩm",
      productionNote: dto.isBestSeller ? "Sản phẩm bán chạy" : dto.isFeatured ? "Sản phẩm nổi bật" : "Giá từ hệ thống",
      availabilityNote: "Vui lòng liên hệ để xác nhận tồn kho",
      trustBadges: ["Giá từ hệ thống", "Ảnh sản phẩm", "Xác nhận tại cửa hàng"],
    },
    relatedProducts: related.map(toPresentationCard),
  };
}

function toPresentationCard(product: CatalogProduct): PresentationCard {
  return {
    productId: product.id,
    href: routes.product(product.slug),
    eyebrow: "",
    title: product.name,
    description: product.description,
    image: product.image,
    imageAlt: product.imageAlt,
    badge: product.badge,
    price: product.pricing.mode === "fixed" ? product.pricing.price : "Liên hệ tư vấn",
    meta: product.pricing.mode === "fixed" ? product.pricing.unit : product.pricing.detail,
  };
}
