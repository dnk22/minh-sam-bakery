import { catalogCategories, catalogProducts } from "./data";
import type { CatalogProduct } from "./types";

export const CATALOG_PAGE_SIZE = 9;

export const catalogTypeOptions = [
  { value: "banh-trung-thu", label: "Bánh Trung Thu" },
  { value: "san-pham-truyen-thong", label: "Bánh truyền thống" },
  { value: "san-pham-moi", label: "Dòng sản phẩm mới" },
  { value: "banh-cookie", label: "Cookie thủ công" },
  { value: "banh-hat", label: "Bánh hạt dinh dưỡng" },
  { value: "sinh-nhat-su-kien", label: "Sinh nhật & Sự kiện" },
  { value: "qua-tang", label: "Quà tặng" },
] as const;

export type CatalogSort = "default" | "price-asc" | "price-desc";
export type CatalogPrice = "all" | "under-200" | "200-500" | "over-500";
export type CatalogMode = "all" | "fixed" | "quote";

export type CatalogQuery = {
  q: string;
  types: string[];
  price: CatalogPrice;
  mode: CatalogMode;
  sort: CatalogSort;
  page: number;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

const validTypes = new Set<string>(catalogTypeOptions.map(({ value }) => value));
const validPrices = new Set<CatalogPrice>(["all", "under-200", "200-500", "over-500"]);
const validModes = new Set<CatalogMode>(["all", "fixed", "quote"]);
const validSorts = new Set<CatalogSort>(["default", "price-asc", "price-desc"]);

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseCatalogQuery(params: RawSearchParams): CatalogQuery {
  const rawTypes = Array.isArray(params.type) ? params.type : params.type ? [params.type] : [];
  const price = first(params.price) as CatalogPrice | undefined;
  const mode = first(params.mode) as CatalogMode | undefined;
  const sort = first(params.sort) as CatalogSort | undefined;
  const parsedPage = Number.parseInt(first(params.page) ?? "1", 10);

  return {
    q: (first(params.q) ?? "").trim().slice(0, 100),
    types: [...new Set(rawTypes.filter((value) => validTypes.has(value)))],
    price: price && validPrices.has(price) ? price : "all",
    mode: mode && validModes.has(mode) ? mode : "all",
    sort: sort && validSorts.has(sort) ? sort : "default",
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

export function filterCatalogProducts(categorySlug: string, query: CatalogQuery) {
  const normalizedSearch = query.q.toLocaleLowerCase("vi");
  const categoryBySlug = new Map(catalogCategories.map((category) => [category.slug, category]));

  const products = catalogProducts.filter((product) => {
    if (product.categorySlug !== categorySlug) return false;
    if (query.types.length > 0 && !query.types.includes(product.categorySlug)) return false;
    if (query.mode !== "all" && product.pricing.mode !== query.mode) return false;
    if (query.price !== "all") {
      if (product.pricing.mode !== "fixed") return false;
      if (query.price === "under-200" && product.pricing.amount >= 200000) return false;
      if (query.price === "200-500" && (product.pricing.amount < 200000 || product.pricing.amount > 500000)) return false;
      if (query.price === "over-500" && product.pricing.amount <= 500000) return false;
    }
    if (normalizedSearch) {
      const categoryName = categoryBySlug.get(product.categorySlug)?.name ?? "";
      const haystack = `${product.name} ${product.description} ${categoryName}`.toLocaleLowerCase("vi");
      if (!haystack.includes(normalizedSearch)) return false;
    }
    return true;
  });

  if (query.sort === "default") return products;
  return [...products].sort((a, b) => compareByPrice(a, b, query.sort));
}

function compareByPrice(a: CatalogProduct, b: CatalogProduct, sort: CatalogSort) {
  if (a.pricing.mode === "quote" && b.pricing.mode === "quote") return 0;
  if (a.pricing.mode === "quote") return 1;
  if (b.pricing.mode === "quote") return -1;
  return sort === "price-asc" ? a.pricing.amount - b.pricing.amount : b.pricing.amount - a.pricing.amount;
}

export function catalogQueryToSearchParams(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  query.types.forEach((type) => params.append("type", type));
  if (query.price !== "all") params.set("price", query.price);
  if (query.mode !== "all") params.set("mode", query.mode);
  if (query.sort !== "default") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function productCountForCategory(slug: string) {
  return catalogProducts.filter((product) => product.categorySlug === slug).length;
}
