export type CatalogCategory = {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeClassName: string;
  number: string;
  label: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  status: "published" | "draft";
  categorySlug: string;
  categorySlugs: string[];
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  badge?: string;
  badgeClassName?: string;
  pricing:
    | {
        mode: "fixed";
        amount: number;
        price: string;
        unit: string;
        variants: Array<{ id: string; label: string; amount: number; currency: "VND" }>;
      }
    | {
        mode: "quote";
        detail: string;
        icon: "calendar" | "palette" | "cake";
        quotationProfile: "corporate-gift" | "custom-event";
      };
};
