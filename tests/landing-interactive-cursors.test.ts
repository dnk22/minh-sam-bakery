import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("storefront cursor policy is scoped to Landing and covers semantic controls", () => {
  const css = readFileSync("src/landing/styles/interactive-cursors.css", "utf8");
  const layout = readFileSync("src/app/(landing)/layout.tsx", "utf8");
  assert.match(layout, /import "@\/landing\/styles\/interactive-cursors.css"/);
  assert.match(css, /:where\(\[data-landing-theme-root\]\) :is\(/);
  assert.match(css, /a\[href\]/);
  assert.match(css, /\bbutton,/);
  assert.match(css, /\bselect,/);
  assert.match(css, /label:has\(input:is/);
  assert.match(css, /button:disabled/);
  assert.match(css, /cursor: not-allowed/);
  assert.doesNotMatch(css, /\[type="text"\]|\[type="search"\]|\[type="email"\]|\[type="tel"\]/);
});
