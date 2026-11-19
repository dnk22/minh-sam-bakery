import assert from "node:assert/strict";
import test from "node:test";

import {
  backendPageToPageIndex,
  normalizePaginationMeta,
  pageIndexToBackendPage,
} from "../src/cms/components/pagination/types.ts";
import { cmsQueryKeys } from "../src/cms/lib/query-keys.ts";

test("normalizes backend pages to TanStack indexes and back", () => {
  assert.equal(backendPageToPageIndex(1), 0);
  assert.equal(backendPageToPageIndex(7), 6);
  assert.equal(pageIndexToBackendPage(0), 1);
  assert.equal(pageIndexToBackendPage(6), 7);
});

test("clamps malformed pagination metadata", () => {
  assert.deepEqual(
    normalizePaginationMeta({ page: 99, limit: 0, total: -2, totalPages: 3 }),
    { page: 3, limit: 1, total: 0, totalPages: 3 },
  );
  assert.equal(normalizePaginationMeta({ page: 0, limit: 20, total: 0, totalPages: 0 }).page, 1);
});

test("builds stable CMS-scoped query keys", () => {
  assert.deepEqual(cmsQueryKeys.detail("products", 42), ["cms", "products", "detail", 42]);
  assert.deepEqual(cmsQueryKeys.list("products", { page: 1 }), ["cms", "products", "list", { page: 1 }]);
});
