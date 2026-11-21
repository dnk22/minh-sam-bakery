import type { PaginationMetaDto } from "@/lib/api/types";
import type { BannerPosition } from "@/lib/banner/positions";

export type Banner = {
  id: string; title: string; desktopImageUrl: string; mobileImageUrl?: string | null; link?: string | null;
  position: BannerPosition; sortOrder: number; startsAt?: string | null; endsAt?: string | null; isActive: boolean;
  createdAt: string; updatedAt: string;
};
export type BannerList = { items: Banner[]; pagination: PaginationMetaDto };
export type BannerListParams = { page: number; limit: number; search?: string; position?: BannerPosition; isActive?: boolean };
export type CreateBannerInput = {
  title: string; desktopImageUrl: string; mobileImageUrl?: string; link?: string; position: BannerPosition;
  sortOrder?: number; startsAt?: string; endsAt?: string; isActive?: boolean;
};
export type UpdateBannerInput = Partial<Omit<CreateBannerInput, "mobileImageUrl" | "link" | "startsAt" | "endsAt">> & {
  mobileImageUrl?: string | null; link?: string | null; startsAt?: string | null; endsAt?: string | null;
};
export type BannerFormValues = {
  title: string; desktopImageUrl: string; mobileImageUrl: string; link: string; position: BannerPosition | "";
  sortOrder: number; startsAt: string; endsAt: string; isActive: boolean;
};
export type BannerModalState = { mode: "create" } | { mode: "detail" | "edit"; id: string } | null;
