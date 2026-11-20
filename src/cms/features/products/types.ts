import type { PaginationMetaDto } from "@/lib/api/types";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";
export type ProductVariantStatus = "ACTIVE" | "INACTIVE";

export type ProductImage = { id: string; url: string; alt?: string | null; sortOrder: number; isCover: boolean };
export type ProductVariant = { id: string; sku: string; size: string; style: string; price: string; salePrice?: string | null; status: ProductVariantStatus; sortOrder: number };
export type Product = {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: string;
  salePrice?: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  isBestSeller: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type ProductList = { items: Product[]; pagination: PaginationMetaDto };
export type ProductListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: ProductStatus;
  categoryId?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
};
export type ProductImageInput = { url: string; alt?: string; sortOrder: number; isCover: boolean };
export type ProductVariantInput = { sku: string; size: string; style: string; price: string; salePrice?: string | null; status: ProductVariantStatus; sortOrder: number };
export type ProductWriteInput = {
  categoryId: string; sku: string; name: string; slug?: string; shortDescription?: string; description?: string;
  price: string; salePrice?: string | null; status?: ProductStatus; isFeatured?: boolean; isBestSeller?: boolean;
  seoTitle?: string; seoDescription?: string; images?: ProductImageInput[]; variants?: ProductVariantInput[];
};
export type ProductFormValues = {
  categoryId: string; sku: string; name: string; slug: string; shortDescription: string; description: string;
  price: string; salePrice: string; status: ProductStatus; isFeatured: boolean; isBestSeller: boolean;
  seoTitle: string; seoDescription: string; images: ProductImageInput[]; variants: Array<Omit<ProductVariantInput, "salePrice"> & { salePrice: string }>;
};
export type ProductModalState = { mode: "create" } | { mode: "detail" | "edit"; id: string } | null;
