import "server-only";

import type { ProductResponseDto } from "@/lib/api/types";

import { adaptCategory, adaptProduct } from "./adapters";
import { fetchCategories, fetchCategoryById, fetchProduct, fetchProducts, fetchRelatedProducts } from "./api";
import { catalogCategories, catalogProducts } from "./data";
import type { CatalogCategory, CatalogProduct } from "./types";

export function catalogDataSource(): "api" | "mock" {
  const configured = process.env.CATALOG_DATA_SOURCE;
  if (configured === "api" || configured === "mock") return configured;
  return process.env.NODE_ENV === "production" ? "api" : "mock";
}

export async function getCatalogSnapshot(filters: { search?: string; categorySlug?: string } = {}) {
  if (catalogDataSource() === "mock") {
    const products = catalogProducts.filter((product) =>
      (!filters.categorySlug || product.categorySlugs.includes(filters.categorySlug)) &&
      (!filters.search || `${product.name} ${product.description}`.toLocaleLowerCase("vi").includes(filters.search.toLocaleLowerCase("vi"))),
    );
    return { categories: catalogCategories, products };
  }
  const [categoryDtos, productDtos] = await Promise.all([fetchCategories(), fetchProducts(filters)]);
  const categoryById = new Map(categoryDtos.map((category) => [category.id, category]));
  for (const product of productDtos) {
    const category = categoryById.get(product.categoryId);
    if (!category || category.slug !== product.categorySlug) throw new Error(`Product ${product.slug} has an invalid category relationship`);
  }
  return {
    categories: categoryDtos.sort((a, b) => a.sortOrder - b.sortOrder).map(adaptCategory),
    products: productDtos.map(adaptProduct),
  };
}

export async function getCatalogCategories() {
  if (catalogDataSource() === "mock") return catalogCategories;
  return (await fetchCategories()).sort((a, b) => a.sortOrder - b.sortOrder).map(adaptCategory);
}

export async function getCatalogCategory(slug: string) {
  const categories = await getCatalogCategories();
  const summary = findCategory(categories, slug);
  if (!summary || catalogDataSource() === "mock" || !summary.id) return summary;
  return adaptCategory(await fetchCategoryById(summary.id));
}

export async function resolveProductBySlug(slug: string) {
  if (catalogDataSource() === "mock") return { product: catalogProducts.find((item) => item.slug === slug), dto: undefined };
  const index = await fetchProducts({ search: slug });
  let match = index.find((item) => item.slug === slug);
  if (!match) match = (await fetchProducts()).find((item) => item.slug === slug);
  if (!match) return {};
  const dto = await fetchProduct(match.categorySlug, match.slug);
  return { product: adaptProduct(dto), dto };
}

export async function getRelatedCatalogProducts(dto: ProductResponseDto) {
  if (catalogDataSource() === "mock") return [];
  return (await fetchRelatedProducts(dto.categorySlug, dto.slug)).map(adaptProduct);
}

export function findCategory(categories: CatalogCategory[], slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function findProduct(products: CatalogProduct[], slug: string) {
  return products.find((product) => product.slug === slug);
}
