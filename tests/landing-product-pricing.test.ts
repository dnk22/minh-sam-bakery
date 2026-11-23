import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { breakDownPrice, effectivePrice, parseBackendPrice } from "../src/landing/features/catalog/pricing.ts";

test("preserves original price and valid discounted price separately", () => {
  assert.deepEqual(breakDownPrice("400000.00", "320000.00"), {
    originalPrice: 400000,
    salePrice: 320000,
    effectivePrice: 320000,
    hasDiscount: true,
    discountPercent: 20,
  });
  assert.deepEqual(breakDownPrice("200000.00", null), {
    originalPrice: 200000,
    salePrice: null,
    effectivePrice: 200000,
    hasDiscount: false,
    discountPercent: null,
  });
});

test("does not mislabel a higher salePrice as a discount or rewrite Backend effective price", () => {
  const price = breakDownPrice("100000.00", "120000.00");
  assert.equal(price.hasDiscount, false);
  assert.equal(price.effectivePrice, 120000);
  assert.equal(price.discountPercent, null);
});

test("rejects malformed or unsupported decimal prices", () => {
  for (const value of ["NaN", "100.123", "-1", "1e5", "1,000", ""]) {
    assert.throws(() => parseBackendPrice(value));
  }
  assert.equal(parseBackendPrice("0.01"), 0.01);
  assert.equal(effectivePrice("250000.00", "220000.00", "test"), 220000);
});

test("model adapter selects cheapest ACTIVE variant only and keeps same-variant original/sale comparison", () => {
  const adapter = readFileSync("src/landing/features/catalog/adapters.ts", "utf8");
  assert.match(adapter, /variant\.status === "ACTIVE"/);
  assert.match(adapter, /variant\.effectivePrice < current\.effectivePrice/);
  assert.match(adapter, /dto\.variants\.length === 0/);
  assert.match(adapter, /isSynthetic: true/);
});

test("price component uses discounted amount, old price and an optional discount badge", () => {
  const component = readFileSync("src/landing/features/catalog/components/product-price.tsx", "utf8");
  assert.match(component, /pricing\.effectivePrice/);
  assert.match(component, /pricing\.originalPrice/);
  assert.match(component, /pricing\.hasDiscount/);
  assert.match(component, /pricing\.isFrom/);
});
