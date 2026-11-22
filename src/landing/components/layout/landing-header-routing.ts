import { routes } from "../../lib/routes.ts";

export function isProductsPath(pathname: string) {
  return pathname === routes.categories || pathname.startsWith(`${routes.categories}/`);
}

export function categorySlugFromPathname(pathname: string) {
  if (!isProductsPath(pathname)) return null;
  return pathname.split("/").filter(Boolean)[1] ?? null;
}
