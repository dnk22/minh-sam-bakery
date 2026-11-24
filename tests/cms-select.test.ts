import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { filterSelectOptions, normalizeSelectSearch } from "../src/cms/components/ui/select/select-options.ts";

test("CMS combobox search handles Vietnamese accents and Đ", () => {
  assert.equal(normalizeSelectSearch(" Đường Mía "), "duong mia");
  const options = [
    { value: "a", label: "Bánh truyền thống" },
    { value: "b", label: "Đường phèn" },
    { value: "c", label: "Bánh Cookie" },
  ];
  assert.deepEqual(filterSelectOptions(options, "TRUYEN"), [options[0]]);
  assert.deepEqual(filterSelectOptions(options, "duong"), [options[1]]);
  assert.deepEqual(filterSelectOptions(options, "cookie"), [options[2]]);
  assert.deepEqual(filterSelectOptions(options, ""), options);
  assert.deepEqual(filterSelectOptions(options, "không có"), []);
});

test("shared CMS controls use accessible Radix menus without introducing new dependencies", () => {
  const select = source("src/cms/components/ui/select/select.tsx");
  const combo = source("src/cms/components/ui/combobox/combobox.tsx");
  const multi = source("src/cms/components/ui/multi-select/multi-select.tsx");

  assert.match(select, /Dropdown\.RadioGroup/);
  assert.match(select, /Dropdown\.RadioItem/);
  assert.match(select, /useController/);
  assert.match(combo, /role="listbox"/);
  assert.match(combo, /aria-activedescendant/);
  assert.match(combo, /filterSelectOptions/);
  assert.match(multi, /type="checkbox"/);
  assert.match(multi, /onValueChange/);
});

test("React Hook Form select fields use the controlled adapters", () => {
  const cases: Array<[string, RegExp]> = [
    ["src/cms/features/products/components/product-fields/product-fields.tsx", /CmsFormCombobox[^>]+name="categoryId"/],
    ["src/cms/features/categories/components/category-fields/category-fields.tsx", /CmsFormCombobox[\s\S]+?name="parentId"/],
    ["src/cms/features/users/components/user-fields/user-fields.tsx", /CmsFormCombobox[^>]+name="roleId"/],
    ["src/cms/features/banners/components/banner-fields/banner-fields.tsx", /CmsFormSelect[^>]+name="position"/],
    ["src/cms/features/products/components/product-variants-editor/product-variant-card.tsx", /CmsFormSelect[^>]+name=\{`variants\.\$\{index\}\.status`\}/],
  ];
  for (const [path, pattern] of cases) {
    assert.match(source(path), pattern);
  }
});

test("CMS navigation and collection pagination no longer render native select menus", () => {
  assert.doesNotMatch(source("src/cms/features/settings/settings-shell.tsx"), /<select\b/);
  assert.doesNotMatch(source("src/cms/components/pagination/collection-pagination.tsx"), /<select\b/);
  assert.doesNotMatch(source("src/cms/features/orders/components/orders-toolbar/orders-toolbar.tsx"), /<details\b/);
});

function source(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
