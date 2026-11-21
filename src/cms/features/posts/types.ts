import type { PaginationMetaDto } from "@/lib/api/types";

export type PostStatus = "DRAFT" | "PUBLISHED";
export type PostAuthor = { id: string; fullName: string };
export type Post = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  content: string;
  excerpt?: string | null;
  status: PostStatus;
  showOnLanding: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
};
export type PostList = { items: Post[]; pagination: PaginationMetaDto };
export type PostListParams = { page: number; limit: number; search?: string; status?: PostStatus; showOnLanding?: boolean };
export type PostCreateInput = {
  title: string; content: string; slug?: string; thumbnailUrl?: string; excerpt?: string;
  status?: PostStatus; showOnLanding?: boolean; seoTitle?: string; seoDescription?: string;
};
export type PostPatchInput = Partial<PostCreateInput>;
export type PostFormValues = {
  title: string; slug: string; thumbnailUrl: string; excerpt: string; content: string;
  showOnLanding: boolean; seoTitle: string; seoDescription: string;
};
