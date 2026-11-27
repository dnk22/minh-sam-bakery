import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = "src/cms/components/responsive-modal/";
const css = readFileSync(root + "responsive-modal.module.css", "utf8");
const component = readFileSync(root + "responsive-modal.tsx", "utf8");

test("default mobile modals fill the viewport independent of desktop size", () => {
  assert.match(css, /@media \(max-width: 767px\) \{\s*\.content\[data-variant="default"\] \{[^}]*inset: 0;[^}]*width: 100%;[^}]*max-width: 100%;/);
  assert.match(css, /height: 100dvh;/);
  assert.match(component, /data-size=\{size\}/);
  assert.match(css, /width: min\(var\(--cms-modal-width, 32rem\), calc\(100vw - 2rem\)\)/);
});

test("footer actions wrap without horizontal scrolling and preserve mobile safe area", () => {
  assert.match(css, /\.footer \{[^}]*flex-wrap: wrap;[^}]*min-width: 0;/);
  assert.match(css, /\.footer > :global\(\.cms-button\) \{[^}]*max-width: 100%;/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /\.body \{[^}]*min-height: 0;[^}]*overflow-y: auto;/);
});

test("confirmation variant remains centered", () => {
  assert.match(css, /\.content\[data-variant="confirm"\] \{[^}]*inset: 50% auto auto 50%;[^}]*transform: translate\(-50%, -50%\)/);
});
