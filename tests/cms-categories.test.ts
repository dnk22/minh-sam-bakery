import assert from "node:assert/strict";
import test from "node:test";

import { categoryErrorMessage } from "../src/cms/features/categories/lib/category-errors.ts";
import { buildCategoryForest, descendantIds, evaluateTreeLoad, filterCategoryForest } from "../src/cms/features/categories/lib/category-tree.ts";
import { categoryQueryKeys } from "../src/cms/features/categories/lib/category-query-keys.ts";
import { categoryPatchSchema, categoryToForm, formToCreate, formToPatch, vietnameseSlug } from "../src/cms/features/categories/schemas/category.schema.ts";
import type { Category } from "../src/cms/features/categories/types.ts";
import { requestApiEnvelope } from "../src/lib/api/transport.ts";
import { CMS_IMAGE_MAX_BYTES, validateSingleImageUpload } from "../src/cms/lib/api/upload-validation.ts";

const category = (id: string, parentId: string | null, name: string, sortOrder = 0): Category => ({
  id, parentId, name, slug: vietnameseSlug(name), description: null, imageUrl: null, status: "VISIBLE", sortOrder,
  seoTitle: null, seoDescription: null, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
});

test("generates Vietnamese slugs without overriding edit values", () => {
  assert.equal(vietnameseSlug("  Bánh Đậu Xanh — Đặc Biệt! "), "banh-dau-xanh-dac-biet");
  const original = category("1", null, "Tên cũ");
  const form = { ...categoryToForm(original), name: "Tên mới", slug: original.slug };
  assert.deepEqual(formToPatch(form, original), { name: "Tên mới" });
});

test("transforms create and patch values with explicit null clearing", () => {
  const original = { ...category("1", null, "Bánh kem"), description: "Cũ", imageUrl: "https://example.com/a.jpg" };
  const values = { ...categoryToForm(original), description: "", imageUrl: null };
  assert.equal(formToCreate(values).description, null);
  assert.deepEqual(formToPatch(values, original), { description: null, imageUrl: null });
  assert.equal(categoryPatchSchema.safeParse({}).success, false);
});

test("builds stable forests and reports duplicate, orphan and cycle integrity errors", () => {
  const good = buildCategoryForest([category("child", "root", "Con", 2), category("root", null, "Gốc", 1)]);
  assert.equal(good.complete, true);
  assert.equal(good.forest[0]?.children[0]?.id, "child");
  assert.deepEqual([...descendantIds(good, "root")].sort(), ["child", "root"]);
  const broken = buildCategoryForest([category("a", "b", "A"), category("b", "a", "B"), category("orphan", "missing", "Mồ côi"), category("orphan", null, "Trùng")]);
  assert.equal(broken.complete, false);
  assert.ok(broken.issues.some((issue) => issue.includes("chu trình")));
  assert.ok(broken.issues.some((issue) => issue.includes("Trùng")));
  assert.ok(broken.issues.some((issue) => issue.includes("cha")));
});

test("keeps matching tree nodes with ancestor context and enforces completeness bounds", () => {
  const tree = buildCategoryForest([category("root", null, "Bánh"), category("child", "root", "Bánh kem")]);
  const filtered = filterCategoryForest(tree.forest, "kem");
  assert.equal(filtered[0]?.contextOnly, true);
  assert.equal(filtered[0]?.children[0]?.contextOnly, false);
  assert.equal(evaluateTreeLoad(1001, 100).complete, false);
  assert.equal(evaluateTreeLoad(20, 20).complete, true);
});

test("uses one-based backend pagination in feature query keys", () => {
  assert.deepEqual(categoryQueryKeys.list({ page: 1, limit: 20 }), ["cms", "categories", "list", { page: 1, limit: 20 }]);
});

test("maps backend delete conflict without optimistic removal semantics", () => {
  assert.match(categoryErrorMessage(409), /tham chiếu/);
  assert.match(categoryErrorMessage(400, "delete"), /danh mục con\/sản phẩm/);
});

test("multipart transport forwards FormData files without hardcoding Content-Type", async () => {
  const form = new FormData();
  form.append("files", new File(["image"], "cake.png", { type: "image/png" }));
  let captured: RequestInit = {};
  await requestApiEnvelope({
    baseUrl: "https://api.example.com", path: "/uploads", method: "POST", body: form,
    validate: (value): value is Array<{ url: string }> => Array.isArray(value),
    fetchImpl: (async (_input, init) => {
      captured = init ?? {};
      return Response.json({ code: 201, message: "ok", data: [{ url: "https://example.com/cake.png" }] }, { status: 201 });
    }) as typeof fetch,
  });
  assert.equal(captured.body, form);
  assert.equal(new Headers(captured.headers).has("Content-Type"), false);
  assert.equal(form.getAll("files").length, 1);
});

test("validates single image count, MIME and 10 MB bound", () => {
  assert.equal(validateSingleImageUpload([]), "Chỉ được chọn một ảnh.");
  assert.match(validateSingleImageUpload([{ size: 10, type: "text/plain" }]) ?? "", /10 MB/);
  assert.match(validateSingleImageUpload([{ size: CMS_IMAGE_MAX_BYTES + 1, type: "image/png" }]) ?? "", /10 MB/);
  assert.equal(validateSingleImageUpload([{ size: CMS_IMAGE_MAX_BYTES, type: "image/png" }]), null);
});
