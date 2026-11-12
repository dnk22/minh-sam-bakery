import type { CatalogProduct } from "@/landing/features/catalog/types";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  currency: "VND";
};

export type PresentationCard = {
  productId?: string;
  href?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  badge?: string;
  meta?: string;
  price?: string;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type DetailCatalogProduct = CatalogProduct & {
  slug: string;
  categorySlug: string;
};

type ProductDetailBase = {
  catalog: DetailCatalogProduct;
  categoryLabel: string;
  heroImage: ProductImage;
  gallery: ProductImage[];
  galleryStrategy?: "original" | "repeated-mock";
};

export type FixedPricePresentation = {
  eyebrow: string;
  priceUnitLabel: string;
  productionNote: string;
  availabilityNote: string;
  pairingEyebrow: string;
  pairingTitle: string;
  pairingDescription: string;
  trustBadges: [string, string, string];
};

export type FixedPriceProductDetail = ProductDetailBase & {
  pricing: {
    mode: "fixed";
    variants: ProductVariant[];
  };
  presentation: FixedPricePresentation;
  complementaryProducts: PresentationCard[];
  relatedProducts: PresentationCard[];
};

export type QuotationProductDetail = ProductDetailBase & {
  pricing: { mode: "quote" };
  presentation: {
    quotationProfile: "corporate-gift" | "custom-event";
    eyebrow: string;
    specificationEyebrow: string;
    pricingExplanation: string;
    serviceBenefits: Array<{ title: string; text: string; icon: "package" | "gift" | "brush" }>;
    drawerFooter: string;
    collectionTitle: string;
    experienceTitle: string;
    experienceDescription: string;
    mobileLabel: string;
  };
  specifications: ProductSpecification[];
  addons: PresentationCard[];
  alternatives: PresentationCard[];
};

export type ProductDetail = FixedPriceProductDetail | QuotationProductDetail;
