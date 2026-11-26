import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync("src/cms/styles/cms.css", "utf8");

test("CMS content uses a single 24px gutter without desktop width cap or mobile override", () => {
  const rules = [...css.matchAll(/(?:^|\n)\s*\.cms-main\s*\{([^}]+)\}/g)];
  assert.equal(rules.length, 1);
  assert.match(rules[0][1], /padding:\s*24px;/);
  assert.match(rules[0][1], /max-width:\s*none;/);
});

test("CMS cursor policy covers native and custom controls including portals and disabled states", () => {
  const rule = css.slice(css.indexOf("/* Scope interaction affordances"), css.indexOf(".cms-shell {"));
  assert.match(rule, /:where\(\.cms-root, \.cms-portal\)/);
  for (const selector of ["a[href]", "button", "select", "summary", '[type="checkbox"]', '[role="menuitem"]', '[role="option"]', '[role="tab"]', '[role="switch"]']) assert.ok(rule.includes(selector), selector);
  assert.match(rule, /:not\(:disabled\):not\(\[aria-disabled="true"\]\):not\(\[data-disabled\]\)/);
  assert.match(rule, /cursor: pointer;/);
  assert.match(rule, /cursor: not-allowed;/);
  assert.doesNotMatch(rule, /\[role="combobox"\]|\[type="text"\]|textarea/);
});
