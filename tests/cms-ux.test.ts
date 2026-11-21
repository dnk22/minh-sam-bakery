import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createNotifier, type NotificationDriver } from "../src/cms/lib/notifications.ts";

test("dispatches typed notifications and reuses explicit IDs to prevent duplicates", () => {
  const calls: Array<{ type: string; message: string; id: string }> = [];
  const driver: NotificationDriver = {
    success: (message, options) => calls.push({ type: "success", message, id: options.id }),
    error: (message, options) => calls.push({ type: "error", message, id: options.id }),
  };
  const notifier = createNotifier(driver);

  notifier.success("Đã cập nhật tài khoản.", "user-save");
  notifier.error("Không thể cập nhật vai trò tài khoản.", "user-save");

  assert.deepEqual(calls, [
    { type: "success", message: "Đã cập nhật tài khoản.", id: "cms:user-save" },
    { type: "error", message: "Không thể cập nhật vai trò tài khoản.", id: "cms:user-save" },
  ]);
});

test("confirmation modal remains compact at every breakpoint", () => {
  const component = source("src/cms/components/responsive-modal/responsive-modal.tsx");
  const css = source("src/cms/components/responsive-modal/responsive-modal.module.css");

  assert.match(component, /variant\?: "default" \| "confirm"/);
  assert.match(component, /data-variant=\{variant\}/);
  assert.match(css, /\.content\[data-variant="confirm"\]/);
  assert.match(css, /width: min\(27\.5rem, calc\(100vw - 2rem\)\)/);
  assert.match(css, /inset: 50% auto auto 50%/);
  assert.match(css, /\.content:not\(\[data-variant="confirm"\]\)/);
});

test("toolbar search sizing uses flex basis instead of competing width rules", () => {
  const files = [
    "categories/components/categories-toolbar/categories-toolbar.module.css",
    "products/components/products-toolbar/products-toolbar.module.css",
    "posts/components/posts-toolbar/posts-toolbar.module.css",
    "orders/components/orders-toolbar/orders-toolbar.module.css",
    "roles/components/roles-toolbar/roles-toolbar.module.css",
    "users/components/users-toolbar/users-toolbar.module.css",
  ];

  for (const file of files) {
    const css = source(`src/cms/features/${file}`);
    assert.match(css, /flex: 0 1 \d/);
    assert.doesNotMatch(css, /\.search(?:Field)?\s*\{[^}]*width: clamp\(/);
  }
});

function source(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
