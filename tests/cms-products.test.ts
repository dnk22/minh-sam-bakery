import assert from "node:assert/strict";
import test from "node:test";

import { isProduct, isProductList, parseOptionalBoolean, parseProductListQuery, parseProductPage, parseProductStatus } from "../src/cms/features/products/lib/product-data.ts";
import { formatVnd, sortProductImages, sortProductVariants } from "../src/cms/features/products/lib/product-format.ts";
import { productQueryKeys } from "../src/cms/features/products/lib/product-query-keys.ts";
import type { Product } from "../src/cms/features/products/types.ts";
import { formToCreate, formToPatch, productFormSchema, productToForm, productWriteSchema, productPatchSchema, vietnameseProductSlug } from "../src/cms/features/products/schemas/product.schema.ts";
import { CMS_IMAGE_MAX_BYTES, validateImageUploadBatch } from "../src/cms/lib/api/upload-validation.ts";

const product: Product = {
  id: "product-1", categoryId: "category-1", categorySlug: "banh-kem", categoryName: "Bánh kem", sku: "BK-001", name: "Bánh kem dâu", slug: "banh-kem-dau",
  shortDescription: null, description: "Mô tả", price: "125000.00", salePrice: null, status: "PUBLISHED", isFeatured: true, isBestSeller: false,
  seoTitle: null, seoDescription: null,
  images: [
    { id: "image-2", url: "/two.jpg", alt: null, sortOrder: 1, isCover: false },
    { id: "image-1", url: "/cover.jpg", alt: "Ảnh bìa", sortOrder: 9, isCover: true },
  ],
  variants: [
    { id: "variant-2", sku: "BK-L", size: "L", style: "Tròn", price: "150000", salePrice: null, status: "ACTIVE", sortOrder: 2 },
    { id: "variant-1", sku: "BK-S", size: "S", style: "Tròn", price: "125000", status: "INACTIVE", sortOrder: 1 },
  ],
  createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z",
};

test("validates documented product and paginated list DTOs", () => {
  assert.equal(isProduct(product), true);
  assert.equal(isProduct({ ...product, shortDescription: undefined, seoTitle: undefined }), true);
  assert.equal(isProduct({ ...product, shortDescription: { text: "invalid" } }), false);
  assert.equal(isProduct({ ...product, price: 125000 }), false);
  assert.equal(isProductList({ items: [product], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isProductList({ items: [product], pagination: { page: "1", limit: 20, total: 1, totalPages: 1 } }), false);
});

test("parses statuses, pages and optional booleans explicitly", () => {
  assert.equal(parseProductStatus("PUBLISHED"), "PUBLISHED");
  assert.equal(parseProductStatus("ACTIVE"), undefined);
  assert.equal(parseProductPage("3"), 3);
  assert.equal(parseProductPage("bad"), 1);
  assert.equal(parseOptionalBoolean("true"), true);
  assert.equal(parseOptionalBoolean("false"), false);
  assert.equal(parseOptionalBoolean("all"), undefined);
});

test("normalizes safe product list query and rejects malformed values", () => {
  const valid = parseProductListQuery(new URLSearchParams("page=2&limit=20&search=%20cake%20&status=DRAFT&categoryId=cat-1&isFeatured=false&isBestSeller=true"));
  assert.deepEqual(valid, { ok: true, data: { page: 2, limit: 20, search: "cake", status: "DRAFT", categoryId: "cat-1", isFeatured: false, isBestSeller: true } });
  assert.deepEqual(parseProductListQuery(new URLSearchParams("search=%20%20")), { ok: true, data: { page: 1, limit: 20, search: undefined, status: undefined, categoryId: undefined, isFeatured: undefined, isBestSeller: undefined } });
  assert.deepEqual(parseProductListQuery(new URLSearchParams("page=0")), { ok: false });
  assert.deepEqual(parseProductListQuery(new URLSearchParams("limit=101")), { ok: false });
  assert.deepEqual(parseProductListQuery(new URLSearchParams("isFeatured=1")), { ok: false });
});

test("formats decimal strings without losing large integer precision", () => {
  assert.equal(formatVnd("125000.00"), "125.000 ₫");
  assert.equal(formatVnd("999999999999999999999.50"), "999.999.999.999.999.999.999,5 ₫");
  assert.equal(formatVnd("bad"), "Không xác định");
  assert.equal(formatVnd(undefined), "Không xác định");
});

test("orders cover images first and variants by sort order without mutation", () => {
  const images = [...product.images];
  const variants = [...product.variants];
  assert.deepEqual(sortProductImages(images).map((item) => item.id), ["image-1", "image-2"]);
  assert.deepEqual(sortProductVariants(variants).map((item) => item.id), ["variant-1", "variant-2"]);
  assert.deepEqual(images.map((item) => item.id), ["image-2", "image-1"]);
  assert.deepEqual(variants.map((item) => item.id), ["variant-2", "variant-1"]);
  assert.deepEqual(sortProductImages([]), []);
  assert.deepEqual(sortProductVariants([]), []);
});

test("uses stable list and detail query keys", () => {
  const params = { page: 2, limit: 20, isFeatured: false };
  assert.deepEqual(productQueryKeys.list(params), ["cms", "products", "list", params]);
  assert.deepEqual(productQueryKeys.detail("product-1"), ["cms", "products", "detail", "product-1"]);
});

test("validates create form and serializes images and variants without response IDs", () => {
  const values = productToForm(product);
  values.images.reverse();
  values.variants.reverse();
  const parsed = productFormSchema.safeParse(values);
  assert.equal(parsed.success, true);
  const input = formToCreate(values);
  assert.equal(input.images?.[0]?.sortOrder, 0);
  assert.equal(input.variants?.[0]?.sortOrder, 0);
  assert.equal("id" in (input.images?.[0] ?? {}), false);
  assert.equal("id" in (input.variants?.[0] ?? {}), false);
  assert.equal(productWriteSchema.safeParse(input).success, true);
  assert.equal(productWriteSchema.safeParse({ ...input, images: [{ ...input.images?.[0], id: "response-only" }] }).success, false);
});

test("requires exactly one cover when images exist and allows optional variants", () => {
  const values = productToForm(product);
  values.images = values.images.map((image) => ({ ...image, isCover: false }));
  assert.equal(productFormSchema.safeParse(values).success, false);
  assert.equal(productFormSchema.safeParse({ ...productToForm(product), variants: [] }).success, true);
});

test("creates Vietnamese slugs and preserves collection data in scalar PATCH", () => {
  assert.equal(vietnameseProductSlug("Bánh Đậu Xanh — Đặc Biệt"), "banh-dau-xanh-dac-biet");
  const values = { ...productToForm(product), name: "Tên mới", salePrice: "" };
  const patch = formToPatch(values, { ...product, salePrice: "100000" });
  assert.deepEqual(patch, { name: "Tên mới", salePrice: null });
  assert.equal("images" in patch, false);
  assert.equal("variants" in patch, false);
  assert.equal("description" in formToPatch({ ...values, description: "" }, product), false);
  assert.equal(productPatchSchema.safeParse(patch).success, true);
  assert.equal(productPatchSchema.safeParse({ images: [] }).success, false);
});

test("validates multi-image upload MIME, count and combined 10 MB limit", () => {
  assert.equal(validateImageUploadBatch([]), "Hãy chọn ít nhất một ảnh.");
  assert.equal(validateImageUploadBatch([{ size: 5, type: "image/png" }, { size: 5, type: "image/jpeg" }]), null);
  assert.match(validateImageUploadBatch([{ size: 5, type: "text/plain" }]) ?? "", /ảnh hợp lệ/);
  assert.match(validateImageUploadBatch([{ size: CMS_IMAGE_MAX_BYTES, type: "image/png" }, { size: 1, type: "image/jpeg" }]) ?? "", /10 MB/);
});
