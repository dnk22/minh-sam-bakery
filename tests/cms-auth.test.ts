import assert from "node:assert/strict";
import test from "node:test";

import { mapBackendError, mapBackendNetworkError } from "../src/cms/features/auth/lib/backend-errors.ts";
import { cmsCookiePolicy } from "../src/cms/features/auth/lib/cookie-policy.ts";
import { isTrustedSameOriginRequest } from "../src/cms/features/auth/lib/csrf.ts";
import { sanitizeCmsRedirect } from "../src/cms/features/auth/lib/redirect.ts";
import {
  initialLoginFormValues,
  isCmsAuthTokens,
  isCmsAuthUser,
  isCmsLoginResult,
  parseDurationSeconds,
  validateLoginForm,
  validateLoginInput,
} from "../src/cms/features/auth/lib/validation.ts";
import { toCmsProfileUser } from "../src/cms/features/auth/types.ts";

const user = {
  id: "user-1",
  email: "admin@minhsam.local",
  fullName: "Quản trị Minh Sâm",
  status: "ACTIVE" as const,
  role: { id: "role-1", code: "MANAGER", name: "Quản lý" },
  permissions: ["products.read"],
};

test("parses documented access-token duration strings", () => {
  assert.equal(parseDurationSeconds("15m"), 900);
  assert.equal(parseDurationSeconds("1h"), 3600);
  assert.equal(parseDurationSeconds("30s"), 30);
  assert.equal(parseDurationSeconds("2d"), 172800);
  assert.equal(parseDurationSeconds("900"), null);
  assert.equal(parseDurationSeconds("0m"), null);
  assert.equal(parseDurationSeconds("15ms"), null);
});

test("validates mocked login, refresh and user payloads", () => {
  const tokens = { accessToken: "access", refreshToken: "refresh", expiresIn: "15m" };
  assert.equal(isCmsAuthTokens(tokens), true);
  assert.equal(isCmsAuthUser(user), true);
  assert.equal(isCmsLoginResult({ ...tokens, user }), true);
  assert.equal(isCmsLoginResult({ ...tokens, user: { ...user, fullName: undefined } }), false);
  assert.equal(isCmsAuthTokens({ ...tokens, refreshToken: "" }), false);
});

test("narrows the client profile and omits permissions", () => {
  const profile = toCmsProfileUser(user);
  assert.equal(profile.fullName, user.fullName);
  assert.equal("permissions" in profile, false);
  assert.equal("accessToken" in profile, false);
  assert.equal("refreshToken" in profile, false);
});

test("validates login fields without clearing valid input", () => {
  assert.deepEqual(validateLoginInput({ email: "", password: "" }), {
    ok: false,
    fields: { email: "Email không được để trống.", password: "Mật khẩu không được để trống." },
  });
  assert.equal(validateLoginInput({ email: "not-an-email", password: "secret" }).ok, false);
  assert.deepEqual(validateLoginInput({ email: " ADMIN@EXAMPLE.COM ", password: "secret" }), {
    ok: true,
    data: { email: "ADMIN@EXAMPLE.COM", password: "secret" },
  });
});

test("adapts the existing login validation for Formik", () => {
  assert.deepEqual(initialLoginFormValues, { email: "", password: "" });
  assert.deepEqual(validateLoginForm(initialLoginFormValues), {
    email: "Email không được để trống.",
    password: "Mật khẩu không được để trống.",
  });
  assert.deepEqual(validateLoginForm({ email: "invalid", password: "secret" }), {
    email: "Email không đúng định dạng.",
  });
  assert.deepEqual(validateLoginForm({ email: "admin@example.com", password: "" }), {
    password: "Mật khẩu không được để trống.",
  });
  assert.deepEqual(validateLoginForm({ email: " admin@example.com ", password: " secret " }), {});
});

test("accepts only safe local CMS redirects", () => {
  assert.equal(sanitizeCmsRedirect("/cms/products?tab=active"), "/cms/products?tab=active");
  assert.equal(sanitizeCmsRedirect("https://evil.example/cms"), "/cms");
  assert.equal(sanitizeCmsRedirect("//evil.example/cms"), "/cms");
  assert.equal(sanitizeCmsRedirect("/%2f%2fevil.example"), "/cms");
  assert.equal(sanitizeCmsRedirect("/cms%2flogin"), "/cms");
  assert.equal(sanitizeCmsRedirect("/san-pham"), "/cms");
  assert.equal(sanitizeCmsRedirect("/cms\\@evil.example"), "/cms");
});

test("maps backend statuses without reflecting raw messages", () => {
  assert.equal(mapBackendError(401, "raw", "login"), "unauthorized");
  assert.equal(mapBackendError(403, "Tài khoản đã bị khóa", "login"), "locked");
  assert.equal(mapBackendError(403, "raw", "me"), "forbidden");
  assert.equal(mapBackendError(404, "raw", "login"), "unauthorized");
  assert.equal(mapBackendError(429, "raw", "login"), "rate_limited");
  assert.equal(mapBackendError(500, "raw", "refresh"), "unavailable");
  assert.equal(mapBackendNetworkError(new DOMException("Timed out", "TimeoutError")), "timeout");
  assert.equal(mapBackendNetworkError(new TypeError("fetch failed")), "unavailable");
});

test("enforces same-origin POST protection", () => {
  assert.equal(isTrustedSameOriginRequest(new Request("https://minhsam.vn/api/cms/auth/login", { headers: { Origin: "https://minhsam.vn" } })), true);
  assert.equal(isTrustedSameOriginRequest(new Request("http://localhost:3000/api/cms/auth/login", { headers: { Host: "127.0.0.1:3000", Origin: "http://127.0.0.1:3000" } })), true);
  assert.equal(isTrustedSameOriginRequest(new Request("http://internal:3000/api/cms/auth/login", { headers: { "X-Forwarded-Host": "cms.minhsam.vn", "X-Forwarded-Proto": "https", Origin: "https://cms.minhsam.vn" } })), true);
  assert.equal(isTrustedSameOriginRequest(new Request("https://minhsam.vn/api/cms/auth/login", { headers: { Origin: "https://evil.example" } })), false);
  assert.equal(isTrustedSameOriginRequest(new Request("https://minhsam.vn/api/cms/auth/login")), false);
});

test("uses HttpOnly, same-site cookies and HTTPS-only Secure in production", () => {
  assert.deepEqual(cmsCookiePolicy(false), { httpOnly: true, secure: false, sameSite: "lax", path: "/", priority: "high" });
  assert.deepEqual(cmsCookiePolicy(true), { httpOnly: true, secure: true, sameSite: "lax", path: "/", priority: "high" });
});
