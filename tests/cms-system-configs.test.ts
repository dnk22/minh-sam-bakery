import assert from "node:assert/strict";
import test from "node:test";

import { buildSystemConfigListQuery, isDeletedSystemConfig, isSystemConfig, isSystemConfigList, parseSystemConfigPage } from "../src/cms/features/system-configs/lib/system-config-data.ts";
import { systemConfigQueryKeys } from "../src/cms/features/system-configs/lib/system-config-query-keys.ts";
import { formToSystemConfigCreate, formToSystemConfigPatch, systemConfigCreateSchema, systemConfigFormSchema, systemConfigPatchSchema, systemConfigToForm } from "../src/cms/features/system-configs/schemas/system-config.schema.ts";
import type { SystemConfig } from "../src/cms/features/system-configs/types.ts";

const config: SystemConfig = {
  id: "config-1", key: "bakery.phone", value: "0123456789", description: "Số điện thoại",
  createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-02T00:00:00Z",
};

test("validates create and update payloads without permitting key updates", () => {
  assert.equal(systemConfigCreateSchema.safeParse({ key: "", value: "x" }).success, false);
  assert.equal(systemConfigFormSchema.safeParse({ key: "key", value: "", description: "" }).success, false);
  assert.equal(systemConfigPatchSchema.safeParse({}).success, false);
  assert.equal(systemConfigPatchSchema.safeParse({ value: "new", key: "changed" }).success, false);
  assert.equal(systemConfigPatchSchema.safeParse({ description: "" }).success, true);
});

test("maps create and update DTOs while keeping key immutable", () => {
  assert.deepEqual(formToSystemConfigCreate({ key: " bakery.email ", value: " hi@example.com ", description: " Liên hệ " }), {
    key: "bakery.email", value: "hi@example.com", description: "Liên hệ",
  });
  assert.deepEqual(formToSystemConfigCreate({ key: "bakery.email", value: "x", description: " " }), { key: "bakery.email", value: "x" });
  const patch = formToSystemConfigPatch({ ...systemConfigToForm(config), key: "attempted-change", value: " 0987654321 ", description: "" }, config);
  assert.deepEqual(patch, { value: "0987654321", description: "" });
  assert.equal("key" in patch, false);
  assert.deepEqual(formToSystemConfigPatch(systemConfigToForm(config), config), {});
});

test("accepts documented API responses and rejects malformed values", () => {
  assert.equal(isSystemConfig(config), true);
  assert.equal(isSystemConfig({ ...config, value: { nested: true } }), false);
  assert.equal(isSystemConfig({ ...config, description: undefined }), false);
  assert.equal(isSystemConfigList({ items: [config], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isSystemConfigList({ items: [{ ...config, key: 123 }], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), false);
  assert.equal(isDeletedSystemConfig({ id: "config-1" }), true);
  assert.equal(isDeletedSystemConfig({}), false);
});

test("keeps search and one-based pagination in request state", () => {
  assert.equal(buildSystemConfigListQuery({ page: 3, limit: 20, search: "phone & email" }), "page=3&limit=20&search=phone+%26+email");
  assert.equal(parseSystemConfigPage("4"), 4);
  assert.equal(parseSystemConfigPage("0"), 1);
  assert.equal(parseSystemConfigPage("invalid"), 1);
  assert.deepEqual(systemConfigQueryKeys.list({ page: 2, limit: 20, search: "phone" }), ["cms", "system-configs", "list", { page: 2, limit: 20, search: "phone" }]);
});

test("uses list and detail cache scopes required by CRUD invalidation", () => {
  assert.deepEqual(systemConfigQueryKeys.lists(), ["cms", "system-configs", "list"]);
  assert.deepEqual(systemConfigQueryKeys.detail("config-1"), ["cms", "system-configs", "detail", "config-1"]);
});
