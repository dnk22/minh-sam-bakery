import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createNotifier, type NotificationDriver } from "../src/cms/lib/notifications.ts";
import { findFirstFormErrorPath } from "../src/cms/lib/form-validation.ts";

test("dispatches typed notifications and reuses explicit IDs to prevent duplicates", () => {
  const calls: Array<{ type: string; message: string; id: string }> = [];
  const driver: NotificationDriver = {
    success: (message, options) => calls.push({ type: "success", message, id: options.id }),
    error: (message, options) => calls.push({ type: "error", message, id: options.id }),
    info: (message, options) => calls.push({ type: "info", message, id: options.id }),
  };
  const notifier = createNotifier(driver);

  notifier.success("Đã cập nhật tài khoản.", "user-save");
  notifier.error("Không thể cập nhật vai trò tài khoản.", "user-save");
  notifier.info("Không có thay đổi để lưu.", "user-save");

  assert.deepEqual(calls, [
    { type: "success", message: "Đã cập nhật tài khoản.", id: "cms:user-save" },
    { type: "error", message: "Không thể cập nhật vai trò tài khoản.", id: "cms:user-save" },
    { type: "info", message: "Không có thay đổi để lưu.", id: "cms:user-save" },
  ]);
});

test("finds the first focusable form error, including nested editor fields", () => {
  assert.equal(findFirstFormErrorPath({ root: { server: { message: "Lỗi" } }, title: { type: "required", message: "Thiếu tiêu đề" } }), "title");
  assert.equal(findFirstFormErrorPath({ variants: [{ sku: { type: "custom", message: "Thiếu SKU" } }] }), "variants.0.sku");
  assert.equal(findFirstFormErrorPath({ content: { type: "custom", message: "Thiếu nội dung" } }), "content");
  assert.equal(findFirstFormErrorPath({ root: { server: { message: "Lỗi hệ thống" } } }), undefined);
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


test("settings retain sub-routes and sidebar while appearance and display are consolidated", () => {
  const navigation = source("src/cms/config/navigation.ts");
  const header = source("src/cms/components/layout/cms-header.tsx");
  const profile = source("src/cms/components/layout/profile-dropdown.tsx");
  const index = source("src/app/(cms)/cms/(protected)/settings/page.tsx");
  const display = source("src/app/(cms)/cms/(protected)/settings/display/page.tsx");
  const legacy = source("src/app/(cms)/cms/(protected)/settings/appearance/page.tsx");
  const settingsShell = source("src/cms/features/settings/settings-shell.tsx");
  const css = source("src/cms/styles/cms.css");

  assert.doesNotMatch(navigation, /title: "Thông báo", href: "\/cms\/notifications"/);
  assert.match(navigation, /title: "Cài đặt", href: "\/cms\/settings"/);
  assert.match(navigation, /Giao diện & hiển thị/);
  assert.doesNotMatch(header, /<ConfigDrawer/);
  assert.match(profile, /href="\/cms\/settings"/);
  assert.match(profile, /onSelect=\{toggleTheme\}/);
  assert.match(index, /redirect\("\/cms\/settings\/display"\)/);
  assert.match(legacy, /redirect\("\/cms\/settings\/display"\)/);
  assert.match(display, /<CmsAppearanceControls \/>/);
  assert.match(settingsShell, /cms-settings-nav/);
  assert.match(settingsShell, /cms-settings-mobile-select/);
  assert.match(settingsShell, /href: "\/cms\/settings\/display"/);
  assert.match(css, /\.cms-settings-body/);
  assert.match(css, /\.cms-settings-mobile-select/);
});

test("notification bulk actions remain side-by-side on mobile", () => {
  const css = source("src/cms/features/notification-center/components/notification-toolbar/notification-toolbar.module.css");
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /\.actions \{[^}]*flex-direction: row;/);
  assert.match(css, /\.actions :global\(\.cms-button\) \{[^}]*flex: 1 1 0;/);
});

function source(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
