import { routes } from "../../../lib/routes.ts";

const CART_ORIGIN_KEY = "minh-sam-cart-origin-v1";
const RECEIPT_ORIGIN_KEY = "minh-sam-receipt-origin-v1";

export function safeReturnTo(value: unknown): string | null {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") ||
      /[\\\u0000-\u0020\u007f]/.test(value) || value.length > 4096) return null;
  try {
    const url = new URL(value, "https://landing.invalid");
    if (url.origin !== "https://landing.invalid") return null;
    const path = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
    if (path.includes("\\") || path.startsWith("//") || path.split("/").some(segment => segment === "." || segment === "..") || /[\u0000-\u001f\u007f]/.test(path)) return null;
    if (!(path === "/" || [routes.categories, routes.search, routes.journal, routes.about].some(root => path === root || path.startsWith(root + "/")))) return null;
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}

export function currentShoppingUrl(): string | null {
  if (typeof window === "undefined") return null;
  return safeReturnTo(window.location.pathname + window.location.search + window.location.hash);
}

function read(key: string) { try { return safeReturnTo(sessionStorage.getItem(key)); } catch { return null; } }
function write(key: string, value: string | null) {
  try { if (value) sessionStorage.setItem(key,value); else sessionStorage.removeItem(key); } catch { /* storage unavailable */ }
}
export function rememberCartOrigin() { const origin = currentShoppingUrl(); if (origin) write(CART_ORIGIN_KEY, origin); }
export function cartOrigin() { return read(CART_ORIGIN_KEY); }
export function clearCartOrigin() { write(CART_ORIGIN_KEY,null); }
export function saveReceiptOrigin(value: unknown) { write(RECEIPT_ORIGIN_KEY,safeReturnTo(value)); }
export function receiptOrigin() { return read(RECEIPT_ORIGIN_KEY); }
export function clearReceiptOrigin() { write(RECEIPT_ORIGIN_KEY,null); }
export function checkoutReturnTo(value: unknown) { return safeReturnTo(value) ?? routes.search; }
