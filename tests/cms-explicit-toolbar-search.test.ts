import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");
test("all searchable CMS toolbars edit drafts and explicitly apply filters", () => {
  for (const name of ["products", "categories", "orders", "users", "roles", "posts", "banners", "themes", "system-configs"]) {
    const source = read(`src/cms/features/${name}/components/${name}-toolbar/${name}-toolbar.tsx`);
    assert.match(source, /useToolbarDraft\(/, name);
    assert.match(source, /onSearch=/, name);
    assert.match(source, /filters\.applyFilters\(/, name);
    assert.match(source, /draft\.set\("search"/, name);
    assert.doesNotMatch(source, /use\w+Search\(|onBlur=\{search|filters\.setSearch\(/, name);
  }
});
test("shared toolbar supports submit and mobile icon-only action", () => {
  assert.match(read("src/cms/components/toolbar/cms-toolbar.tsx"), /onSubmit=/);
  assert.match(read("src/cms/components/toolbar/cms-toolbar-search-button.tsx"), /type="submit"/);
  assert.match(read("src/cms/components/toolbar/cms-toolbar.module.css"), /\.submitLabel \{ display: none; \}/);
});
test("orders date filters share responsive filter group and retain validation", () => {
  const source = read("src/cms/features/orders/components/orders-toolbar/orders-toolbar.tsx");
  assert.match(source, /isValidOrderCreatedRange\(values.createdFrom, values.createdTo\)/);
  assert.match(source, /searchDisabled=\{!valid\}/);
  assert.match(source, /<CmsFilterGroup[\s\S]*order-created-from[\s\S]*order-created-to[\s\S]*<\/CmsFilterGroup>/);
});
