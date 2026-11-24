import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import { getCategoryStatusPresentation } from "../src/cms/features/categories/constants.ts";
import { clearCategoryAdvancedFilterQuery, countCategoryAdvancedFilters } from "../src/cms/features/categories/lib/category-data.ts";
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

test("clears only the category status filter while preserving search and view", () => {
  assert.equal(countCategoryAdvancedFilters("HIDDEN"), 1);
  assert.equal(countCategoryAdvancedFilters(undefined), 0);
  const query = new URLSearchParams("search=banh&status=HIDDEN&view=tree&page=2");
  assert.equal(clearCategoryAdvancedFilterQuery(query).toString(), "search=banh&view=tree");
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

test("maps category statuses to shared badge presentation", () => {
  assert.deepEqual(getCategoryStatusPresentation("VISIBLE"), {
    label: "Hiển thị",
    variant: "success",
  });
  assert.deepEqual(getCategoryStatusPresentation("HIDDEN"), {
    label: "Ẩn",
    variant: "secondary",
  });
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

test("category image patch accepts upload paths and absolute URLs, rejects invalid URLs", () => {
  const original = { ...category("1", null, "Bánh kem"), imageUrl: "/uploads/categories/old.png" };
  assert.deepEqual(formToPatch(categoryToForm(original), original), {});
  assert.deepEqual(formToPatch({ ...categoryToForm(original), imageUrl: "/uploads/categories/new.png" }, original), { imageUrl: "/uploads/categories/new.png" });
  assert.deepEqual(formToPatch({ ...categoryToForm(original), imageUrl: null }, original), { imageUrl: null });
  for (const imageUrl of [null, "/uploads/categories/new.png", "https://cdn.example.com/image.png"]) {
    assert.equal(categoryPatchSchema.safeParse({ imageUrl }).success, true);
  }
  for (const imageUrl of ["", "javascript:alert(1)", "blob:https://example.com/a", "/uploads/../private.png", "/uploads/%2e%2e/private.png", "https://user:pass@example.com/a.png"]) {
    assert.equal(categoryPatchSchema.safeParse({ imageUrl }).success, false);
  }
  const withoutImage: Category = { ...original, imageUrl: null };
  assert.deepEqual(formToPatch(categoryToForm(withoutImage), withoutImage), {});
});

test("shared image upload separates cancellation from removal and aborts abandoned requests", () => {
  const hook = readFileSync("src/cms/components/image-upload/hooks/use-image-upload.ts", "utf8");
  const actions = readFileSync("src/cms/components/image-upload/image-upload-actions.tsx", "utf8");
  const preview = readFileSync("src/cms/components/image-upload/image-upload-preview.tsx", "utf8");
  const modal = readFileSync("src/cms/features/categories/components/category-modal/category-modal.tsx", "utf8");
  assert.match(hook, /validateSingleImageUpload\(\[file\]\)/);
  assert.match(hook, /request.current\?\.abort\(\)/);
  assert.match(hook, /uploadCmsImage\(pending.file, folder, controller.signal\)/);
  assert.match(hook, /controller.signal.aborted \|\| request.current !== controller/);
  assert.doesNotMatch(hook.slice(hook.indexOf("const cancel ="), hook.indexOf("const remove =")), /onChange\(/);
  assert.match(actions, /Hủy ảnh chờ/);
  assert.match(preview, /Không thể hiển thị ảnh/);
  assert.match(modal, /form="category-form" disabled=\{pending \|\| uploadPending\}/);
  assert.match(modal, /saving=\{pending\}/);
});
