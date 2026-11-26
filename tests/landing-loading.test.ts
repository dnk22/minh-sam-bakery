import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path: string) => readFileSync(path, "utf8");
test("header height grows with viewport and skeleton uses identical token", () => {
  const css = read("src/app/globals.css");
  assert.deepEqual([...css.matchAll(/--landing-header-height: ([\d.]+)rem/g)].map(m => Number(m[1])), [4, 4.5, 5]);
  assert.match(read("src/landing/components/skeletons/landing-skeletons.tsx"), /h-\[var\(--landing-header-height\)\]/);
});
test("landing home isolates data loading per section and removes text-only fallback", () => {
  const layout = read("src/app/(landing)/layout.tsx");
  assert.doesNotMatch(layout, /Đang tải Minh Sâm Bakery/);
  const home = read("src/app/(landing)/page.tsx");
  for (const name of ["HeroSkeleton", "HomeCategoriesSkeleton", "GiftingSkeleton"]) assert.ok(home.includes("fallback={<" + name + " />}"));
  assert.doesNotMatch(home, /Promise.allSettled/);
});
