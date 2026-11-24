import assert from "node:assert/strict";
import test from "node:test";

import { BackendRequestError } from "../src/lib/api/errors.ts";
import { buildBackendUrl, requestApiEnvelope } from "../src/lib/api/transport.ts";
import { cmsApiClient } from "../src/cms/lib/api/client.ts";
import { CmsApiError } from "../src/cms/lib/api/errors.ts";
import { mapBackendError, toCmsAuthBackendError } from "../src/cms/features/auth/lib/auth-errors.ts";
import { cmsCookiePolicy } from "../src/cms/features/auth/lib/cookie-policy.ts";
import { isTrustedSameOriginRequest } from "../src/cms/features/auth/lib/csrf.ts";
import { sanitizeCmsRedirect } from "../src/cms/features/auth/lib/redirect.ts";
import { decideRefreshFailure } from "../src/cms/features/auth/lib/refresh-policy.ts";
import {
  LEGACY_REMEMBERED_LOGIN_KEY,
  migrateAndReadRememberedEmail,
  REMEMBERED_EMAIL_KEY,
  rememberEmail,
} from "../src/cms/features/auth/lib/remembered-email.ts";
import { defaultLoginValues, loginSchema, parseLoginInput } from "../src/cms/features/auth/schemas/login.schema.ts";
import { isAccessTokenFresh } from "../src/cms/features/auth/session/policy.ts";
import {
  isCmsAuthTokens,
  isCmsAuthUser,
  isCmsLoginResult,
  parseDurationSeconds,
  validateLoginInput,
} from "../src/cms/features/auth/lib/validation.ts";
import { toCmsProfileUser } from "../src/cms/features/auth/types.ts";
import { resolveCmsBreadcrumbs } from "../src/cms/config/navigation.ts";

const user = {
  id: "user-1",
  email: "admin@minhsam.local",
  fullName: "Quản trị Minh Sâm",
  status: "ACTIVE" as const,
  role: { id: "role-1", code: "MANAGER", name: "Quản lý" },
  permissions: ["products.read"],
};

function memoryStorage(values: Map<string, string>): Pick<Storage, "getItem" | "removeItem" | "setItem"> {
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

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

test("uses one Zod login schema for browser and server validation", () => {
  assert.deepEqual(defaultLoginValues, { email: "", password: "" });
  assert.equal(loginSchema.safeParse(defaultLoginValues).success, false);
  assert.deepEqual(parseLoginInput({ email: " admin@example.com ", password: " secret " }), {
    ok: true,
    data: { email: "admin@example.com", password: " secret " },
  });
  assert.deepEqual(parseLoginInput({ email: "invalid", password: "" }), {
    ok: false,
    fields: { email: "Email không đúng định dạng.", password: "Mật khẩu không được để trống." },
  });
});

test("migrates legacy login storage without restoring its password", () => {
  const values = new Map<string, string>([
    [LEGACY_REMEMBERED_LOGIN_KEY, JSON.stringify({ email: " user@example.com ", password: "plaintext-password" })],
  ]);
  const storage = memoryStorage(values);

  assert.equal(migrateAndReadRememberedEmail(storage), "user@example.com");
  assert.equal(values.has(LEGACY_REMEMBERED_LOGIN_KEY), false);
  assert.equal(values.get(REMEMBERED_EMAIL_KEY), "user@example.com");
  assert.equal([...values.values()].some((value) => value.includes("plaintext-password")), false);
});

test("discards malformed legacy storage and remembers only valid emails", () => {
  const values = new Map<string, string>([
    [LEGACY_REMEMBERED_LOGIN_KEY, "{malformed"],
    [REMEMBERED_EMAIL_KEY, "saved@example.com"],
  ]);
  const storage = memoryStorage(values);

  assert.equal(migrateAndReadRememberedEmail(storage), "saved@example.com");
  assert.equal(values.has(LEGACY_REMEMBERED_LOGIN_KEY), false);
  rememberEmail(storage, " invalid ");
  assert.equal(values.get(REMEMBERED_EMAIL_KEY), "saved@example.com");
  rememberEmail(storage, " latest@example.com ");
  assert.equal(values.get(REMEMBERED_EMAIL_KEY), "latest@example.com");
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
  assert.equal(mapBackendError(423, "raw", "me"), "locked");
  assert.equal(mapBackendError(404, "raw", "login"), "unauthorized");
  assert.equal(mapBackendError(429, "raw", "login"), "rate_limited");
  assert.equal(mapBackendError(500, "raw", "refresh"), "unavailable");
  assert.equal(mapBackendError(504, "raw", "refresh"), "timeout");
  assert.equal(toCmsAuthBackendError(new BackendRequestError("timeout"), "login").kind, "timeout");
  assert.equal(toCmsAuthBackendError(new BackendRequestError("network"), "login").kind, "unavailable");
  assert.equal(toCmsAuthBackendError(new BackendRequestError("invalid_json"), "login").kind, "invalid_response");
});

test("builds Backend URLs with repeated query values", () => {
  assert.equal(
    buildBackendUrl("https://api.example.com/", "/api/v1/products", { page: 2, status: ["ACTIVE", "DRAFT"], empty: null }).toString(),
    "https://api.example.com/api/v1/products?page=2&status=ACTIVE&status=DRAFT",
  );
});

test("shared transport handles GET envelopes and public cache options", async () => {
  let captured: RequestInit & { next?: NextFetchRequestConfig } = {};
  const response = await requestApiEnvelope({
    baseUrl: "https://api.example.com",
    path: "/items",
    next: { revalidate: 300, tags: ["items"] },
    validate: (value): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string"),
    fetchImpl: (async (_input, init) => {
      captured = init ?? {};
      return new Response(JSON.stringify({ code: 200, message: "ok", data: ["cake"] }), { status: 200 });
    }) as typeof fetch,
  });
  assert.deepEqual(response.data, ["cake"]);
  assert.deepEqual(captured.next, { revalidate: 300, tags: ["items"] });
});

test("shared transport serializes POST, authorization and no-store", async () => {
  let captured: RequestInit = {};
  await requestApiEnvelope({
    baseUrl: "https://api.example.com",
    path: "/auth/me",
    method: "POST",
    body: { value: 1 },
    accessToken: "access-token",
    cache: "no-store",
    validate: (value): value is boolean => value === true,
    fetchImpl: (async (_input, init) => {
      captured = init ?? {};
      return new Response(JSON.stringify({ code: 200, message: "ok", data: true }), { status: 200 });
    }) as typeof fetch,
  });
  assert.equal(captured.method, "POST");
  assert.equal(captured.body, JSON.stringify({ value: 1 }));
  assert.equal(new Headers(captured.headers).get("Authorization"), "Bearer access-token");
  assert.equal(captured.cache, "no-store");
});

test("shared transport distinguishes malformed and HTTP responses", async () => {
  const cases = [
    { response: new Response("not-json", { status: 200 }), kind: "invalid_json" },
    { response: Response.json({ value: true }), kind: "invalid_envelope" },
    { response: Response.json({ code: 401, message: "unauthorized", data: null }, { status: 401 }), kind: "http" },
    { response: Response.json({ code: 429, message: "limited", data: null }, { status: 200 }), kind: "application" },
    { response: Response.json({ code: 200, message: "ok", data: "wrong" }), kind: "invalid_data" },
  ] as const;
  for (const item of cases) {
    await assert.rejects(
      requestApiEnvelope({
        baseUrl: "https://api.example.com",
        path: "/test",
        validate: (value): value is boolean => typeof value === "boolean",
        fetchImpl: (async () => item.response) as typeof fetch,
      }),
      (error: unknown) => error instanceof BackendRequestError && error.kind === item.kind,
    );
  }
});

test("shared transport distinguishes network, timeout and caller abort", async () => {
  await assert.rejects(requestApiEnvelope({
    baseUrl: "https://api.example.com",
    path: "/network",
    validate: (value): value is boolean => typeof value === "boolean",
    fetchImpl: (async () => { throw new TypeError("network"); }) as typeof fetch,
  }), (error: unknown) => error instanceof BackendRequestError && error.kind === "network");

  const hangingFetch = ((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")), { once: true });
  })) as typeof fetch;
  const keepEventLoopAlive = setInterval(() => undefined, 10);
  try {
    await assert.rejects(requestApiEnvelope({
      baseUrl: "https://api.example.com",
      path: "/timeout",
      timeoutMs: 1,
      validate: (value): value is boolean => typeof value === "boolean",
      fetchImpl: hangingFetch,
    }), (error: unknown) => error instanceof BackendRequestError && error.kind === "timeout");
  } finally {
    clearInterval(keepEventLoopAlive);
  }

  const controller = new AbortController();
  const request = requestApiEnvelope({
    baseUrl: "https://api.example.com",
    path: "/abort",
    signal: controller.signal,
    validate: (value): value is boolean => typeof value === "boolean",
    fetchImpl: hangingFetch,
  });
  controller.abort();
  await assert.rejects(request, (error: unknown) => error instanceof BackendRequestError && error.kind === "aborted");
});

test("CMS browser client uses the same-origin BFF and extracts field errors", async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = "";
  let capturedInit: RequestInit = {};
  globalThis.fetch = (async (input, init) => {
    capturedUrl = String(input);
    capturedInit = init ?? {};
    return Response.json({
      ok: false,
      error: { code: "VALIDATION", message: "Dữ liệu không hợp lệ.", fields: { email: "Email lỗi." } },
    }, { status: 400 });
  }) as typeof fetch;
  try {
    await assert.rejects(
      cmsApiClient.post("/auth/login", { email: "bad" }),
      (error: unknown) => error instanceof CmsApiError && error.code === "VALIDATION" && error.fields?.email === "Email lỗi.",
    );
    assert.equal(capturedUrl, "/api/cms/auth/login");
    assert.equal(capturedInit.credentials, "same-origin");
    assert.equal(capturedInit.cache, "no-store");
    assert.equal(capturedInit.method, "POST");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("CMS browser client supports empty responses and rejects invalid JSON", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = (async () => new Response(null, { status: 204 })) as typeof fetch;
    assert.equal(await cmsApiClient.delete("/resource"), undefined);

    globalThis.fetch = (async () => new Response("not-json", { status: 200 })) as typeof fetch;
    await assert.rejects(
      cmsApiClient.get("/resource"),
      (error: unknown) => error instanceof CmsApiError && error.code === "INVALID_RESPONSE",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("access freshness policy refreshes near-expiry tokens", () => {
  const now = 1_000_000;
  assert.equal(isAccessTokenFresh({ accessToken: "token", accessExpiresAt: now + 20_000 }, now), true);
  assert.equal(isAccessTokenFresh({ accessToken: "token", accessExpiresAt: now + 9_999 }, now), false);
  assert.equal(isAccessTokenFresh({ accessToken: "token", accessExpiresAt: now - 1 }, now), false);
  assert.equal(isAccessTokenFresh({ accessToken: null, accessExpiresAt: null }, now), false);
});

test("refresh failure policy is bounded and does not misclassify temporary failures", () => {
  assert.deepEqual(decideRefreshFailure("UNAUTHORIZED", false), { action: "login", error: "session-expired" });
  assert.deepEqual(decideRefreshFailure("LOCKED", false), { action: "login", error: "locked" });
  assert.deepEqual(decideRefreshFailure("FORBIDDEN", false), { action: "show", state: "forbidden" });
  assert.deepEqual(decideRefreshFailure("RATE_LIMITED", false), { action: "show", state: "rate_limited" });
  for (const code of ["VALIDATION", "INVALID_RESPONSE", "UNAVAILABLE", "TIMEOUT", "NETWORK"]) {
    assert.deepEqual(decideRefreshFailure(code, false), { action: "show", state: "unavailable" });
  }
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

test("resolves active CMS route breadcrumbs from navigation", () => {
  assert.deepEqual(resolveCmsBreadcrumbs("/cms/products"), [
    { title: "Quản lý cửa hàng", href: "/cms", active: false },
    { title: "Nội dung cửa hàng", href: "/cms/products", active: false },
    { title: "Sản phẩm", href: "/cms/products", active: true },
  ]);
  assert.deepEqual(resolveCmsBreadcrumbs("/cms/settings"), [
    { title: "Hệ thống", href: "/cms", active: false },
    { title: "Cài đặt", href: "/cms/settings", active: true },
  ]);
  assert.deepEqual(resolveCmsBreadcrumbs("/cms/settings/display"), [
    { title: "Hệ thống", href: "/cms", active: false },
    { title: "Cài đặt", href: "/cms/settings", active: false },
    { title: "Giao diện & hiển thị", href: "/cms/settings/display", active: true },
  ]);
});
