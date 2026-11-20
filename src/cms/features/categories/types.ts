import type { PaginationMetaDto } from "@/lib/api/types";

export type CategoryStatus = "VISIBLE" | "HIDDEN";

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  status: CategoryStatus;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryList = { items: Category[]; pagination: PaginationMetaDto };
export type CategoryListParams = { page: number; limit: number; search?: string; status?: CategoryStatus };
export type CategoryTreeNode = Category & { children: CategoryTreeNode[]; contextOnly?: boolean };
export type CategoryModalMode = "create" | "edit" | "detail";
export type CategoryModalState = {
  mode: CategoryModalMode;
  id?: string;
  parentId?: string | null;
} | null;

export type CategoryWriteInput = {
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  status?: CategoryStatus;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type CategoryFormValues = {
  name: string;
  slug: string;
  parentId: string;
  description: string;
  imageUrl: string | null;
  status: CategoryStatus;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
};
