import type { BannerPosition } from "@/lib/banner/positions";

export type LandingBanner = {
  id: string;
  title: string;
  desktopImageUrl: string;
  mobileImageUrl: string | null;
  link: string | null;
  position: BannerPosition;
  sortOrder: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BannerFallback = {
  desktopImageUrl: string;
  mobileImageUrl?: string;
  alt: string;
};

export type BannerRenderMode = "fallback" | "single" | "carousel";
