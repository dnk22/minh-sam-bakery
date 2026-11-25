import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = "src/cms/features/auth/components/";
const read = (file: string) => readFileSync(file, "utf8");

test("login separates decorative bakery photo, accessible branding and the actual HTML form", () => {
  const screen = read(root + "login-screen/login-screen.tsx");
  const brand = read(root + "login-screen/login-brand-panel.tsx");
  const card = read(root + "login-screen/login-card.tsx");
  const form = read(root + "login-form/login-form.tsx");
  assert.match(screen, /<LoginBrandPanel/);
  assert.match(screen, /<LoginCard/);
  assert.match(brand, /src="\/images\/auth\/login-background.webp"/);
  assert.match(brand, /src="\/images\/minh-sam-logo.webp"/);
  const photo = readFileSync("public/images/auth/login-background.webp");
  assert.equal(photo.subarray(0, 4).toString(), "RIFF");
  assert.equal(photo.subarray(8, 12).toString(), "WEBP");
  assert.match(card, /aria-labelledby="cms-login-title"/);
  assert.match(card, /<CmsLoginForm redirectTo=\{redirectTo\}/);
  assert.match(form, /id="cms-login-form"/);
  assert.match(form, /onSubmit=\{submit\}/);
  assert.match(form, /autoComplete="username"/);
  assert.match(form, /autoComplete="current-password"/);
  assert.match(form, /aria-pressed=\{showPassword\}/);
  assert.match(form, /checked=\{rememberEmail\}/);
  assert.doesNotMatch(form, /Quên mật khẩu/);
});

test("login styles are isolated and support tablet, mobile, narrow and short viewports", () => {
  const styles = read(root + "login-screen/login-screen.module.css");
  const formStyles = read(root + "login-form/login-form.module.css");
  assert.match(styles, /grid-template-columns: minmax\(0, 55fr\) minmax\(0, 45fr\)/);
  assert.match(styles, /max-width: 1023px/);
  assert.match(styles, /max-width: 767px/);
  assert.match(styles, /max-width: 359px/);
  assert.match(styles, /max-height: 740px/);
  assert.match(styles, /min-height: 100dvh/);
  assert.match(styles, /overflow-y: auto/);
  assert.match(styles, /\.brand \{ display: none; \}/);
  assert.match(formStyles, /min-height: 3\.25rem/);
  assert.match(formStyles, /font-size: 1rem/);
});

test("login continues using the existing credentials contract and safe redirect", () => {
  const hook = read("src/cms/features/auth/hooks/use-login.ts");
  const page = read("src/app/(cms)/cms/login/page.tsx");
  assert.match(hook, /await authApi.login\(credentials\)/);
  assert.match(hook, /persistRememberedEmail\(window.localStorage, credentials.email, rememberEmail\)/);
  assert.match(hook, /router.replace\(redirectTo\)/);
  assert.match(hook, /zodResolver\(loginSchema\)/);
  assert.match(page, /sanitizeCmsRedirect\(params.redirect\)/);
  assert.match(page, /resolveCmsSession\(\)/);
  assert.match(page, /cms\/session-refresh/);
});
