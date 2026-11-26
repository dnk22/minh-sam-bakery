import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : /\.tsx?$/.test(path) ? [path] : [];
  });
}

test("CMS contains no native confirmation calls", () => {
  for (const path of [...walk("src/cms"), ...walk("src/app/(cms)")]) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /window\.confirm\s*\(|(?<![\w.])confirm\s*\(["'`]/, path);
  }
});

test("shared confirmation is centered, elevated and cancel-safe", () => {
  const source = readFileSync("src/cms/context/cms-confirm.tsx", "utf8");
  assert.match(source, /<ResponsiveModal open elevated variant="confirm"/);
  assert.match(source, /if \(current.current\) return Promise.resolve\(false\)/);
  assert.match(source, /if \(!open\) finish\(false\)/);
  assert.match(source, /onClick=\{\(\) => finish\(true\)\}/);
  const modal = readFileSync("src/cms/components/responsive-modal/responsive-modal.tsx", "utf8");
  assert.match(modal, /await onBeforeClose\?\.\(\) === false/);
});
