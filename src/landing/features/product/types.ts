import type { CatalogPricing, CatalogProduct } from "@/landing/features/catalog/types";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  salePrice: number | null;
  hasDiscount: boolean;
  discountPercent: number | null;
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
  pricing?: CatalogPricing;
  catalogProduct?: CatalogProduct;
};

export type FixedPricePresentation = {
  checkoutAvailable?: boolean;
  checkoutUnavailableMessage?: string;
  eyebrow: string;
  priceUnitLabel: string;
  productionNote: string;
  availabilityNote: string;
  pairingEyebrow: string;
  pairingTitle: string;
  pairingDescription: string;
  trustBadges: [string, string, string];
};

export type FixedPriceProductDetail = {
  catalog: CatalogProduct;
  categoryLabel: string;
  heroImage: ProductImage;
  gallery: ProductImage[];
  pricing: {
    variants: ProductVariant[];
  };
  presentation: FixedPricePresentation;
  complementaryProducts: PresentationCard[];
  relatedProducts: PresentationCard[];
};
