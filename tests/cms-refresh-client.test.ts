import assert from "node:assert/strict";
import test from "node:test";

import { cmsApiClient } from "../src/cms/lib/api/client.ts";
import { CmsApiError } from "../src/cms/lib/api/errors.ts";
import { CMS_PREAUTH_REJECTION_HEADER } from "../src/cms/features/auth/lib/replay-policy.ts";
import { changeSessionScope } from "../src/cms/features/auth/session/refresh-coordinator.ts";
import { resetBrowserRecovery, browserRefresh } from "../src/cms/features/auth/session/browser-refresh.ts";
import { sessionRefreshStore } from "../src/cms/features/auth/stores/session-refresh.store.ts";

function unauthorized(marked = false) {
  return Response.json({ ok: false, error: { code: "PRODUCT_401", message: "Expired" } }, {
    status: 401,
    headers: marked ? { [CMS_PREAUTH_REJECTION_HEADER]: "1" } : {},
  });
}
async function withBrowser(run: (redirects: string[]) => Promise<void>) {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalFetch = globalThis.fetch;
  const redirects: string[] = [];
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
    location: { pathname: "/cms/products", search: "?page=2", replace: (url: string) => redirects.push(url) },
  } });
  changeSessionScope();
  resetBrowserRecovery();
  try { await run(redirects); }
  finally {
    await browserRefresh.pending();
    resetBrowserRecovery();
    globalThis.fetch = originalFetch;
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("ten concurrent 401 requests perform one refresh and replay every GET once", async () => {
  await withBrowser(async redirects => {
    let calls = 0;
    let refreshes = 0;
    let refreshed = false;
    globalThis.fetch = async input => {
      if (String(input).endsWith("/auth/refresh")) {
        refreshes++;
        assert.equal(sessionRefreshStore.getState().status, "refreshing");
        await new Promise(resolve => setTimeout(resolve, 10));
        refreshed = true;
        return Response.json({ ok: true });
      }
      calls++;
      return refreshed ? Response.json({ ok: true }) : unauthorized();
    };
    const results = await Promise.all(Array.from({ length: 10 }, () => cmsApiClient.get("/products")));
    assert.equal(results.length, 10);
    assert.equal(calls, 20);
    assert.equal(refreshes, 1);
    assert.equal(sessionRefreshStore.getState().status, "idle");
    assert.deepEqual(redirects, []);
  });
});

test("mutation only replays after explicit BFF pre-operation rejection", async () => {
  for (const marked of [true, false]) {
    await withBrowser(async () => {
      let writes = 0;
      let refreshes = 0;
      const payloads: unknown[] = [];
      globalThis.fetch = async (input, init) => {
        if (String(input).endsWith("/auth/refresh")) { refreshes++; return Response.json({ ok: true }); }
        writes++;
        payloads.push(init?.body);
        return writes === 1 ? unauthorized(marked) : Response.json({ id: "updated" });
      };
      const operation = cmsApiClient.patch("/products/1", { name: "Bánh" });
      if (marked) {
        assert.deepEqual(await operation, { id: "updated" });
        assert.equal(writes, 2);
        assert.equal(payloads[0], payloads[1]);
      } else {
        await assert.rejects(operation, (error: unknown) => error instanceof CmsApiError && error.code === "SESSION_RECOVERED_RETRY_REQUIRED");
        assert.equal(writes, 1);
      }
      assert.equal(refreshes, 1);
    });
  }
});

test("auth calls do not recursively refresh and failed refresh redirects only once", async () => {
  await withBrowser(async redirects => {
    let refreshes = 0;
    globalThis.fetch = async input => {
      if (String(input).endsWith("/auth/refresh")) { refreshes++; return Response.json({ ok: false }, { status: 401 }); }
      return unauthorized(true);
    };
    await assert.rejects(cmsApiClient.post("/auth/login", {}));
    assert.equal(refreshes, 0);
    const results = await Promise.allSettled([cmsApiClient.get("/products"), cmsApiClient.get("/categories")]);
    assert.ok(results.every(result => result.status === "rejected"));
    assert.equal(refreshes, 1);
    assert.equal(redirects.length, 1);
    assert.match(redirects[0], /error=session-expired/);
    assert.equal(new URL(redirects[0], "https://example.test").searchParams.get("redirect"), "/cms/products?page=2");
    await assert.rejects(cmsApiClient.get("/orders"));
    assert.equal(refreshes, 1);
  });
});

test("second 401 after replay never starts another refresh", async () => {
  await withBrowser(async redirects => {
    let refreshes = 0;
    let calls = 0;
    globalThis.fetch = async input => {
      if (String(input).endsWith("/auth/refresh")) { refreshes++; return Response.json({ ok: true }); }
      calls++;
      return unauthorized(true);
    };
    await assert.rejects(cmsApiClient.get("/products"));
    assert.equal(refreshes, 1);
    assert.equal(calls, 2);
    assert.equal(redirects.length, 1);
  });
});

test("aborting one waiting request does not cancel the shared rotation or replay the canceled request", async () => {
  await withBrowser(async redirects => {
    const controller = new AbortController();
    let release!: () => void;
    const wait = new Promise<void>(resolve => { release = resolve; });
    let started!: () => void;
    const start = new Promise<void>(resolve => { started = resolve; });
    let refreshed = false;
    let canceledCalls = 0;
    globalThis.fetch = async input => {
      if (String(input).endsWith("/auth/refresh")) {
        started();
        await wait;
        refreshed = true;
        return Response.json({ ok: true });
      }
      if (String(input).endsWith("/canceled")) canceledCalls++;
      return refreshed ? Response.json({ ok: true }) : unauthorized(true);
    };
    const canceled = cmsApiClient.get("/canceled", { signal: controller.signal });
    const other = cmsApiClient.get("/other");
    await start;
    controller.abort();
    await assert.rejects(canceled, (error: unknown) => error instanceof CmsApiError && error.code === "NETWORK");
    release();
    assert.deepEqual(await other, { ok: true });
    assert.equal(canceledCalls, 1);
    assert.deepEqual(redirects, []);
  });
});
