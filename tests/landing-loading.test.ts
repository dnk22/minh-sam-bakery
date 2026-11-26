import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

test("keep compact responsive header without introducing global loading UI", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.deepEqual([...css.matchAll(/--landing-header-height: ([\d.]+)rem/g)].map(m => Number(m[1])), [4, 4.5, 5]);
  const layout = readFileSync("src/app/(landing)/layout.tsx", "utf8");
  assert.match(layout, /<Suspense fallback=\{null\}>/);
  assert.match(layout, /await connection\(\)/);
  assert.doesNotMatch(layout, /Đang tải Minh Sâm Bakery|LandingShellSkeleton/);
  assert.equal(existsSync("src/app/(landing)/loading.tsx"), false);
});
