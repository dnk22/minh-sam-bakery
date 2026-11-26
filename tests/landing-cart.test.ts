import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { cartLineKey } from "../src/landing/features/cart/selection.ts";
import { cartSubtotal, getSelectedCartLines, isAllCartSelected, switchCartVariant } from "../src/landing/features/cart/logic.ts";
import type { CartLine } from "../src/landing/features/cart/types.ts";

function line(productId: string, variantId: string | null, quantity: number, selected: boolean): CartLine {
  return {
    key: cartLineKey(productId, variantId), productId,
    categorySlug: "banh-kem", productSlug: productId,
    productName: productId, productImage: "/images/example.jpg", productImageAlt: productId,
    variantId, variantLabel: variantId ?? "Tiêu chuẩn",
    availableVariants: [
      { id: "size-small", label: "Nhỏ", originalPrice: 120000, effectivePrice: 100000 },
      { id: "size-large", label: "Lớn", originalPrice: 220000, effectivePrice: 200000 },
    ],
    originalPrice: 120000, effectivePrice: variantId === "size-large" ? 200000 : 100000,
    quantity, selected,
  };
}

test("selected cart subtotal includes only checked lines and quantity", () => {
  const items = [line("a", "size-small", 2, true), line("b", "size-large", 1, false)];
  assert.equal(cartSubtotal(items), 200000);
  assert.equal(getSelectedCartLines(items).length, 1);
  assert.equal(isAllCartSelected(items), false);
  assert.equal(isAllCartSelected([]), false);
  assert.equal(cartSubtotal(items.map((item) => ({ ...item, selected: true }))), 400000);
});

test("variant switch updates same line and merges with existing variant safely", () => {
  const small = line("a", "size-small", 2, true);
  const large = line("a", "size-large", 3, false);
  const switched = switchCartVariant([small], small.key, "size-large");
  assert.equal(switched[0].key, large.key);
  assert.equal(switched[0].effectivePrice, 200000);
  const merged = switchCartVariant([small, large], small.key, "size-large");
  assert.equal(merged.length, 1);
  assert.equal(merged[0].quantity, 5);
  assert.equal(merged[0].selected, true);
  assert.equal(switchCartVariant([small], small.key, "missing")[0], small);
});

test("checkout navigation uses only selected lines and retains cart after navigation", () => {
  const component = readFileSync("src/landing/features/cart/components/cart-page.tsx", "utf8");
  const store = readFileSync("src/landing/features/cart/store/cart-store.ts", "utf8");
  const header = readFileSync("src/landing/components/layout/landing-header.tsx", "utf8");
  assert.match(component, /getSelectedCartLines\(items\)/);
  assert.match(component, /saveCartCheckoutIntent\(selected\)/);
  assert.match(component, /selected\.length === 0/);
  assert.match(store, /skipHydration: true/);
  assert.match(header, /Giỏ hàng/);
  assert.match(header, /cartCount/);
});

test("header cart badge counts lines, not quantities or selection", () => {
  const header = readFileSync("src/landing/components/layout/landing-header.tsx", "utf8");
  assert.match(header, /const cartCount = useCartStore\(\(state\) => state\.items\.length\)/);
  assert.equal((header.match(/cartCount > 99 \? "99\+" : cartCount/g) ?? []).length, 2);
});
