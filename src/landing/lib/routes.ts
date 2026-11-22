export const routes = {
  home: "/",
  homeHero: "/#trang-chu",
  categories: "/danh-muc",
  search: "/tim-kiem",
  journal: "/tin-tuc",
  about: "/ve-minh-sam",
  category: (slug: string) => `/danh-muc/${slug}`,
  product: (categorySlug: string, productSlug: string) =>
    `/danh-muc/${categorySlug}/${productSlug}`,
  article: (slug: string) => `/tin-tuc/${slug}`,
} as const;
