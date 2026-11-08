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
  slug?: string;
  categorySlug?: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  badge?: string;
  badgeClassName?: string;
  pricing:
    | { mode: "fixed"; price: string; unit: string }
    | { mode: "quote"; detail: string; icon: "calendar" | "palette" | "cake" };
};
