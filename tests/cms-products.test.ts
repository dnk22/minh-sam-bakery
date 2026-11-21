import assert from "node:assert/strict";
import test from "node:test";

import { clearProductAdvancedFilterQuery, countProductAdvancedFilters, isProduct, isProductList, parseOptionalBoolean, parseProductListQuery, parseProductPage, parseProductStatus } from "../src/cms/features/products/lib/product-data.ts";
import { formatVnd, sortProductImages, sortProductVariants } from "../src/cms/features/products/lib/product-format.ts";
import { productQueryKeys } from "../src/cms/features/products/lib/product-query-keys.ts";
import type { Product } from "../src/cms/features/products/types.ts";
import { formToCreate, formToPatch, productFormSchema, productToForm, productWriteSchema, productPatchSchema, vietnameseProductSlug } from "../src/cms/features/products/schemas/product.schema.ts";
import { CMS_IMAGE_MAX_BYTES, isUploadResult, validateImageUploadBatch } from "../src/cms/lib/api/upload-validation.ts";
import { productCategoryGuard } from "../src/cms/features/products/lib/product-category-guard.ts";
import { cmsAssetUrl } from "../src/cms/lib/api/asset-url.ts";

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

test("counts product filter dimensions and clears advanced filters without search", () => {
  assert.equal(countProductAdvancedFilters({ status: "DRAFT", categoryId: undefined, isFeatured: false, isBestSeller: undefined }), 2);
  const query = new URLSearchParams("search=kem&status=DRAFT&categoryId=cat-1&isFeatured=false&isBestSeller=true&page=4&view=kept");
  assert.equal(clearProductAdvancedFilterQuery(query).toString(), "search=kem&view=kept");
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

test("creates Vietnamese slugs and preserves unchanged scalar and collection data in PATCH", () => {
  assert.equal(vietnameseProductSlug("Bánh Đậu Xanh — Đặc Biệt"), "banh-dau-xanh-dac-biet");
  const values = { ...productToForm(product), name: "Tên mới", salePrice: "" };
  const patch = formToPatch(values, { ...product, salePrice: "100000" });
  assert.deepEqual(patch, { name: "Tên mới", salePrice: null });
  assert.equal("images" in patch, false);
  assert.equal("variants" in patch, false);
  assert.equal("description" in formToPatch(productToForm(product), product), false);
  assert.equal(productPatchSchema.safeParse(patch).success, true);
  assert.equal(productPatchSchema.safeParse({ images: [] }).success, false);
});

test("serializes explicit optional text clearing, new text and whitespace independently", () => {
  const original = { ...product, shortDescription: "Ngắn", description: "Chi tiết", seoTitle: null, seoDescription: "SEO cũ", salePrice: "100000.00" };
  assert.deepEqual(formToPatch({ ...productToForm(original), description: "   " }, original), { description: "" });
  assert.equal(productPatchSchema.safeParse({ description: "" }).success, true);
  assert.deepEqual(formToPatch({ ...productToForm(original), seoTitle: "  SEO mới  " }, original), { seoTitle: "SEO mới" });
  assert.deepEqual(formToPatch({ ...productToForm(original), shortDescription: "", seoDescription: "", salePrice: "" }, original), { shortDescription: "", seoDescription: "", salePrice: null });
  assert.deepEqual(formToPatch({ ...productToForm(original), salePrice: "999999999999999999.50" }, original), { salePrice: "999999999999999999.50" });
  const patch = formToPatch({ ...productToForm(original), description: "Mới" }, original);
  assert.equal("images" in patch, false);
  assert.equal("variants" in patch, false);
});

test("allows unchanged edit category without a tree but validates create and category changes", () => {
  assert.equal(productCategoryGuard({ mode: "edit", selectedCategoryId: "category-1", originalCategoryId: "category-1" }).allowed, true);
  assert.equal(productCategoryGuard({ mode: "edit", selectedCategoryId: "category-2", originalCategoryId: "category-1" }).allowed, false);
  assert.equal(productCategoryGuard({ mode: "create", selectedCategoryId: "category-1" }).allowed, false);
  const ids = new Set(["category-1", "category-2"]);
  assert.equal(productCategoryGuard({ mode: "create", selectedCategoryId: "category-1", completeCategoryIds: ids }).allowed, true);
  assert.equal(productCategoryGuard({ mode: "edit", selectedCategoryId: "missing", originalCategoryId: "category-1", completeCategoryIds: ids }).allowed, false);
});

test("validates multi-image upload MIME, count and combined 10 MB limit", () => {
  assert.equal(validateImageUploadBatch([]), "Hãy chọn ít nhất một ảnh.");
  assert.equal(validateImageUploadBatch([{ size: 5, type: "image/png" }, { size: 5, type: "image/jpeg" }]), null);
  assert.match(validateImageUploadBatch([{ size: 5, type: "text/plain" }]) ?? "", /ảnh hợp lệ/);
  assert.match(validateImageUploadBatch([{ size: CMS_IMAGE_MAX_BYTES, type: "image/png" }, { size: 1, type: "image/jpeg" }]) ?? "", /10 MB/);
});

test("normalizes only backend-root-relative CMS assets through the authenticated proxy", () => {
  assert.equal(cmsAssetUrl("/uploads/products/cake.jpg"), "/api/cms/assets?path=%2Fuploads%2Fproducts%2Fcake.jpg");
  assert.equal(cmsAssetUrl("https://cdn.example.com/cake.jpg"), "https://cdn.example.com/cake.jpg");
  assert.equal(cmsAssetUrl("blob:https://cms.example/id"), "blob:https://cms.example/id");
  assert.equal(cmsAssetUrl("/images/logo.webp"), "/images/logo.webp");
  assert.equal(isUploadResult([{ url: "/uploads/products/cake.jpg" }]), true);
  assert.equal(isUploadResult([{ url: "https://cdn.example.com/cake.jpg" }]), true);
  assert.equal(isUploadResult([{ url: "javascript:alert(1)" }]), false);
});
