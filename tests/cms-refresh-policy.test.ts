import assert from "node:assert/strict";
import test from "node:test";

import { createRefreshManager, type RefreshSnapshot } from "../src/cms/features/auth/session/refresh-manager.ts";
import { runRefreshAttempts, retryAfterMilliseconds, type RefreshAttemptResult, type RecoveryResult } from "../src/cms/features/auth/session/refresh-retry-policy.ts";
import { canReplayAfterUnauthorized, isProtectedCmsRequest } from "../src/cms/features/auth/lib/replay-policy.ts";
import { changeSessionScope, coordinateRefresh, refreshVersion } from "../src/cms/features/auth/session/refresh-coordinator.ts";

async function simulate(outcomes: RefreshAttemptResult[]) {
  const attempts: number[] = [];
  const delays: number[] = [];
  const result = await runRefreshAttempts({
    perform: async attempt => outcomes[attempt - 1],
    onAttempt: attempt => attempts.push(attempt),
    sleep: async ms => { delays.push(ms); },
  });
  return { result, attempts, delays };
}

test("transient refresh errors retry at most three calls with 1s and 2s backoff", async () => {
  assert.deepEqual(await simulate([
    { ok: false, code: "NETWORK" }, { ok: false, code: "TIMEOUT" }, { ok: false, code: "UNAVAILABLE" },
  ]), { result: { ok: false, reason: "session-recovery-failed" }, attempts: [1, 2, 3], delays: [1000, 2000] });
  assert.deepEqual(await simulate([{ ok: false, code: "UNAVAILABLE" }, { ok: true }]), {
    result: { ok: true }, attempts: [1, 2], delays: [1000],
  });
});

test("invalid or locked refresh tokens and forbidden responses do not retry", async () => {
  for (const [code, reason] of [["UNAUTHORIZED", "session-expired"], ["LOCKED", "locked"], ["FORBIDDEN", "forbidden"], ["VALIDATION", "session-recovery-failed"]]) {
    assert.deepEqual(await simulate([{ ok: false, code }]), { result: { ok: false, reason }, attempts: [1], delays: [] });
  }
});

test("rate-limit backoff respects Retry-After and does not wait indefinitely", async () => {
  assert.equal(retryAfterMilliseconds("5"), 5000);
  assert.equal(retryAfterMilliseconds("Thu, 26 Nov 2026 07:00:05 GMT", Date.parse("Thu, 26 Nov 2026 07:00:00 GMT")), 5000);
  assert.equal(retryAfterMilliseconds("invalid"), undefined);
  assert.deepEqual(await simulate([{ ok: false, code: "RATE_LIMITED", retryAfterMs: 5000 }, { ok: true }]), {
    result: { ok: true }, attempts: [1, 2], delays: [5000],
  });
  assert.deepEqual(await simulate([{ ok: false, code: "RATE_LIMITED", retryAfterMs: 60000 }]), {
    result: { ok: false, reason: "session-recovery-failed" }, attempts: [1], delays: [],
  });
});

test("single flight shares exactly one refresh and broadcasts progress", async () => {
  let calls = 0;
  let resolve!: (result: RecoveryResult) => void;
  const result = new Promise<RecoveryResult>(done => { resolve = done; });
  const snapshots: RefreshSnapshot[] = [];
  const manager = createRefreshManager(async (_, __, attempt) => { calls++; attempt(1); return result; }, state => snapshots.push(state));
  const flights = Array.from({ length: 10 }, () => manager.refresh("v1"));
  assert.ok(flights.every(flight => flight === flights[0]));
  await Promise.resolve();
  assert.equal(calls, 1);
  resolve({ ok: true });
  assert.deepEqual(await Promise.all(flights), Array.from({ length: 10 }, () => ({ ok: true })));
  assert.deepEqual(snapshots, [{ status: "refreshing", attempt: 0 }, { status: "refreshing", attempt: 1 }, { status: "idle", attempt: 0 }]);
  assert.equal(manager.pending(), null);
});

test("terminal failure prevents a new retry chain until explicit new session reset", async () => {
  let calls = 0;
  const manager = createRefreshManager(async () => { calls++; return { ok: false, reason: "session-recovery-failed" }; }, () => {});
  const result = await manager.refresh("v1");
  assert.deepEqual(await manager.refresh("v2"), result);
  assert.equal(calls, 1);
  manager.reset();
  await manager.refresh("v3");
  assert.equal(calls, 2);
});

test("coordinator reuses a completed rotation for concurrent and late unauthorized requests", async () => {
  changeSessionScope();
  const observed = refreshVersion();
  let calls = 0;
  const recover = async (): Promise<RecoveryResult> => { calls++; return { ok: true }; };
  assert.deepEqual(await Promise.all([coordinateRefresh(observed, recover), coordinateRefresh(observed, recover)]), [{ ok: true }, { ok: true }]);
  assert.deepEqual(await coordinateRefresh(observed, recover), { ok: true });
  assert.equal(calls, 1);
  await coordinateRefresh(refreshVersion(), recover);
  assert.equal(calls, 2);
});

test("coordinator refuses a result if the account changes while rotating", async () => {
  changeSessionScope();
  const result = await coordinateRefresh(refreshVersion(), async () => {
    changeSessionScope();
    return { ok: true };
  });
  assert.deepEqual(result, { ok: false, reason: "session-changed" });
});

test("GET can replay once but mutations require proof of pre-operation rejection", () => {
  assert.equal(canReplayAfterUnauthorized("GET", false), true);
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    assert.equal(canReplayAfterUnauthorized(method, false), false);
    assert.equal(canReplayAfterUnauthorized(method, true), true);
  }
  for (const path of ["/auth/login", "/auth/logout", "/auth/me", "/auth/refresh"]) assert.equal(isProtectedCmsRequest(path), false);
  assert.equal(isProtectedCmsRequest("/products"), true);
});
