export const routes = {
  home: "/",
  products: "/san-pham",
  journal: "/tin-tuc",
  category: (slug: string) => `/danh-muc/${slug}`,
  product: (slug: string) => `/san-pham/${slug}`,
  article: (slug: string) => `/tin-tuc/${slug}`,
} as const;
