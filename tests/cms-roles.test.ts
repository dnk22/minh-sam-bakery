import assert from "node:assert/strict";
import test from "node:test";

import { groupPermissions, isPermissionCatalog, isRoleDetail, isRoleList, normalizePermissionIds, samePermissionIds } from "../src/cms/features/roles/lib/role-data.ts";
import { roleQueryKeys } from "../src/cms/features/roles/lib/role-query-keys.ts";
import { formToCreate, formToPatch, roleCreateSchema, rolePatchSchema, roleToForm } from "../src/cms/features/roles/schemas/role.schema.ts";
import type { Permission, Role } from "../src/cms/features/roles/types.ts";
import { commitPermissionSelection, editPermissionSelection, newPermissionEditorSession, permissionSelectionDirty, reconcilePermissionEditorSession, reloadPermissionSelection } from "../src/cms/features/roles/lib/permission-editor-session.ts";

const permissions: Permission[] = [
  { id: "2", code: "roles.update", module: "roles", action: "update", description: null },
  { id: "1", code: "roles.read", module: "roles", action: "read", description: "Xem vai trò" },
  { id: "3", code: "users.read", module: "users", action: "read", description: null },
];

const role: Role = {
  id: "role-1",
  code: "MANAGER",
  name: "Quản lý",
  description: null,
  isSystem: false,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

test("validates documented role and permission response shapes without coercion", () => {
  assert.equal(isRoleDetail({ ...role, permissions }), true);
  assert.equal(isRoleDetail({ ...role, permissions, description: { value: "unexpected" } }), false);
  assert.equal(isPermissionCatalog(permissions), true);
  assert.equal(isPermissionCatalog([{ ...permissions[0], description: 123 }]), false);
  assert.equal(isRoleList({ items: [role], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
});

test("groups permissions deterministically by backend module and action", () => {
  const groups = groupPermissions(permissions);
  assert.deepEqual(groups.map((group) => group.module), ["roles", "users"]);
  assert.deepEqual(groups[0]?.permissions.map((permission) => permission.action), ["read", "update"]);
});

test("normalizes complete replacement permission payloads", () => {
  assert.deepEqual(normalizePermissionIds(["3", "1", "3", "2"]), ["1", "2", "3"]);
  assert.equal(samePermissionIds(["1", "2"], ["2", "1", "2"]), true);
  assert.equal(samePermissionIds([], ["1"]), false);
  assert.deepEqual(normalizePermissionIds([]), []);
});

test("transforms create and independent basic-info patch payloads", () => {
  const values = { ...roleToForm(role), name: " Quản lý cửa hàng ", description: " Mô tả " };
  assert.deepEqual(formToCreate(values, ["1", "2"]), {
    code: "MANAGER",
    name: "Quản lý cửa hàng",
    description: "Mô tả",
    permissionIds: ["1", "2"],
  });
  assert.deepEqual(formToCreate({ code: "STAFF", name: "Nhân viên", description: "" }, []), { code: "STAFF", name: "Nhân viên" });
  assert.deepEqual(formToPatch(values, role), { name: "Quản lý cửa hàng", description: "Mô tả" });
  assert.equal("permissionIds" in formToPatch(values, role), false);
});

test("rejects empty creates, empty patches and unsafe extra fields", () => {
  assert.equal(roleCreateSchema.safeParse({ code: "", name: "" }).success, false);
  assert.equal(rolePatchSchema.safeParse({}).success, false);
  assert.equal(rolePatchSchema.safeParse({ name: "Quản lý", permissionIds: [] }).success, false);
});

test("keeps one-based pagination in stable role query keys", () => {
  assert.deepEqual(roleQueryKeys.list({ page: 1, limit: 20, search: "admin" }), ["cms", "roles", "list", { page: 1, limit: 20, search: "admin" }]);
});

test("permission session syncs pristine refetch without becoming dirty", () => {
  const initial = newPermissionEditorSession("edit:role-1", ["1"]);
  const refreshed = reconcilePermissionEditorSession(initial, "edit:role-1", ["1", "2"]);
  assert.deepEqual(refreshed.selectedIds, ["1", "2"]);
  assert.equal(permissionSelectionDirty(refreshed), false);
  assert.equal(refreshed.conflict, false);
});

test("permission session blocks dirty remote conflicts until explicit reload", () => {
  const initial = newPermissionEditorSession("edit:role-1", ["1"]);
  const edited = editPermissionSelection(initial, ["1", "3"]);
  const conflicted = reconcilePermissionEditorSession(edited, "edit:role-1", ["1", "2"]);
  assert.deepEqual(conflicted.selectedIds, ["1", "3"]);
  assert.equal(conflicted.conflict, true);
  assert.equal(permissionSelectionDirty(conflicted), true);
  const reloaded = reloadPermissionSelection(conflicted);
  assert.deepEqual(reloaded.selectedIds, ["1", "2"]);
  assert.equal(reloaded.conflict, false);
});

test("permission session isolates roles and commits successful selections", () => {
  const first = editPermissionSelection(newPermissionEditorSession("edit:role-1", ["1"]), ["2"]);
  const switched = reconcilePermissionEditorSession(first, "edit:role-2", ["3"]);
  assert.deepEqual(switched.selectedIds, ["3"]);
  assert.equal(switched.touched, false);
  const committed = commitPermissionSelection(editPermissionSelection(switched, ["3", "4"]));
  assert.deepEqual(committed.baselineIds, ["3", "4"]);
  assert.equal(permissionSelectionDirty(committed), false);
});
