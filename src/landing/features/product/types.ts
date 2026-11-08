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
};

export type FixedPriceProductDetail = ProductDetailBase & {
  pricing: {
    mode: "fixed";
    variants: ProductVariant[];
  };
  complementaryProducts: PresentationCard[];
  relatedProducts: PresentationCard[];
};

export type QuotationProductDetail = ProductDetailBase & {
  pricing: { mode: "quote" };
  specifications: ProductSpecification[];
  addons: PresentationCard[];
  alternatives: PresentationCard[];
};

export type ProductDetail = FixedPriceProductDetail | QuotationProductDetail;
