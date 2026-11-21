import assert from "node:assert/strict";
import test from "node:test";

import { getUserStatusPresentation, statusAction } from "../src/cms/features/users/constants.ts";
import { clearUserAdvancedFilterQuery, countUserAdvancedFilters, parseUserPage, parseUserStatus } from "../src/cms/features/users/lib/user-filter-data.ts";
import { isCmsUser, isDeletedUser, isUserList } from "../src/cms/features/users/lib/user-data.ts";
import { userQueryKeys } from "../src/cms/features/users/lib/user-query-keys.ts";
import { assignUserRoleSchema, createUserSchema, formToCreate, formToPatch, updateUserSchema, userToForm } from "../src/cms/features/users/schemas/user.schema.ts";
import type { CmsUser } from "../src/cms/features/users/types.ts";

const user: CmsUser = {
  id: "user-1",
  email: "staff@minhsam.local",
  fullName: "Nguyễn Văn A",
  status: "ACTIVE",
  role: { id: "role-1", code: "STAFF", name: "Nhân viên" },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

test("validates documented user, list and soft-delete response DTOs", () => {
  assert.equal(isCmsUser(user), true);
  assert.equal(isCmsUser({ ...user, status: "DELETED" }), false);
  assert.equal(isCmsUser({ ...user, role: { id: "role-1" } }), false);
  assert.equal(isUserList({ items: [user], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), true);
  assert.equal(isDeletedUser({ id: user.id }), true);
});

test("normalizes safe URL query values", () => {
  assert.equal(parseUserPage("2"), 2);
  assert.equal(parseUserPage("0"), 1);
  assert.equal(parseUserPage("bad"), 1);
  assert.equal(parseUserStatus("ACTIVE"), "ACTIVE");
  assert.equal(parseUserStatus("LOCKED"), "LOCKED");
  assert.equal(parseUserStatus("DELETED"), undefined);
});

test("counts and clears user advanced filters without clearing search", () => {
  assert.equal(countUserAdvancedFilters("LOCKED", "role-1"), 2);
  assert.equal(countUserAdvancedFilters(undefined, undefined), 0);
  const query = new URLSearchParams("search=an&status=LOCKED&roleId=role-1&page=3&extra=kept");
  assert.equal(clearUserAdvancedFilterQuery(query).toString(), "search=an&extra=kept");
});

test("creates the exact documented user payload", () => {
  assert.deepEqual(formToCreate({ email: " staff@minhsam.local ", fullName: " Nguyễn Văn A ", password: " secret ", roleId: "role-1" }), {
    email: "staff@minhsam.local",
    fullName: "Nguyễn Văn A",
    password: " secret ",
    roleId: "role-1",
  });
  assert.equal(createUserSchema.safeParse({ email: "staff@minhsam.local", fullName: "A", password: "x", roleId: "role-1" }).success, true);
});

test("omits blank passwords and role IDs from basic user patches", () => {
  assert.deepEqual(formToPatch({ ...userToForm(user), fullName: "Tên mới", password: "" }, user), { fullName: "Tên mới" });
  assert.deepEqual(formToPatch({ ...userToForm(user), password: "new-secret", roleId: "another-role" }, user), { password: "new-secret" });
  assert.equal("roleId" in formToPatch({ ...userToForm(user), roleId: "another-role" }, user), false);
  assert.equal(updateUserSchema.safeParse({ password: "" }).success, false);
  assert.equal(updateUserSchema.safeParse({}).success, false);
});

test("keeps role assignment as a separate strict payload", () => {
  assert.deepEqual(assignUserRoleSchema.parse({ roleId: "role-2" }), { roleId: "role-2" });
  assert.equal(assignUserRoleSchema.safeParse({ roleId: "role-2", email: "other@example.com" }).success, false);
});

test("maps status presentation and contextual account action", () => {
  assert.deepEqual(getUserStatusPresentation("ACTIVE"), { label: "Đang hoạt động", variant: "success" });
  assert.deepEqual(getUserStatusPresentation("LOCKED"), { label: "Đã khóa", variant: "warning" });
  assert.equal(statusAction("ACTIVE"), "lock");
  assert.equal(statusAction("LOCKED"), "unlock");
});

test("uses stable server-pagination query keys", () => {
  const params = { page: 2, limit: 20, search: "staff", status: "ACTIVE" as const, roleId: "role-1" };
  assert.deepEqual(userQueryKeys.list(params), ["cms", "users", "list", params]);
});
