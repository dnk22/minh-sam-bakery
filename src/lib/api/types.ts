export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type PaginationMetaDto = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMetaDto;
};

export type PublicPostAuthorDto = {
  id: string;
  fullName: string;
};

export type PublicPostResponseDto = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  content: string;
  excerpt?: string | null;
  status: "DRAFT" | "PUBLISHED";
  showOnLanding: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  author: PublicPostAuthorDto;
  createdAt: string;
  updatedAt: string;
};

export type CategoryResponseDto = {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  status: "VISIBLE" | "HIDDEN";
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductImageResponseDto = {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isCover: boolean;
};

export type ProductVariantResponseDto = {
  id: string;
  sku: string;
  size: string;
  style: string;
  price: string;
  salePrice?: string | null;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
};

export type ProductResponseDto = {
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
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  isFeatured: boolean;
  isBestSeller: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  images: ProductImageResponseDto[];
  variants: ProductVariantResponseDto[];
  createdAt: string;
  updatedAt: string;
};
