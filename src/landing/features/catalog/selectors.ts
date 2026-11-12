import { catalogProducts } from "./data.ts";

export function getProductById(id: string) {
  return catalogProducts.find((product) => product.id === id);
}

export function getProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

export function getPublishedProducts() {
  return catalogProducts.filter((product) => product.status === "published");
}

export function getProductsByCategory(categorySlug: string) {
  return getPublishedProducts().filter((product) => product.categorySlugs.includes(categorySlug));
}

export function getQuotationProducts() {
  return getPublishedProducts().filter((product) => product.pricing.mode === "quote");
}

