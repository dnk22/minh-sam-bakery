import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PRODUCT_PAGE_SIZE } from "../src/landing/lib/product-pagination.ts";
import { PRODUCT_GRID_CLASS } from "../src/landing/features/catalog/components/product/product-card-layout.ts";

test("product listings share twelve items and two mobile columns", () => {
  assert.equal(PRODUCT_PAGE_SIZE, 12);
  assert.match(PRODUCT_GRID_CLASS, /\bgrid-cols-2\b/);
  assert.match(PRODUCT_GRID_CLASS, /xl:grid-cols-3/);
  for (const file of ["product-list-grid.tsx", "product-card-skeleton.tsx"]) {
    assert.match(readFileSync("src/landing/features/catalog/components/product/" + file, "utf8"), /className=\{PRODUCT_GRID_CLASS\}/);
  }
});
