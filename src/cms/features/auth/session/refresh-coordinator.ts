import type { RecoveryResult } from "./refresh-retry-policy.ts";

const LOCK = "minhsam-cms-session-refresh";
const RESULT_KEY = "minhsam-cms-refresh-result";
const SCOPE_KEY = "minhsam-cms-session-scope";
const RESULT_TTL_MS = 120_000;
type SharedResult = { version: string; scope: string; at: number; result: RecoveryResult };
let localResult: SharedResult | null = null;
let localScope = "initial";

function read(key: string) {
  try { return typeof window === "undefined" ? null : window.localStorage.getItem(key); }
  catch { return null; }
}
function write(key: string, value: string) {
  try { if (typeof window !== "undefined") window.localStorage.setItem(key, value); }
  catch { /* Same-tab deduplication still works without storage. */ }
}
function id() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}
export function sessionScope() {
  return read(SCOPE_KEY) ?? localScope;
}
export function changeSessionScope() {
  localScope = id();
  localResult = null;
  write(SCOPE_KEY, localScope);
}
function sharedResult(): SharedResult | null {
  const stored = read(RESULT_KEY);
  if (stored) {
    try {
      const record = JSON.parse(stored) as SharedResult;
      if (typeof record.version === "string" && typeof record.at === "number" && record.scope === sessionScope() &&
          (record.result?.ok === true || (record.result?.ok === false &&
            ["session-expired", "locked", "forbidden", "session-recovery-failed"].includes(record.result.reason)))) return record;
    } catch { /* Ignore malformed, non-authoritative browser metadata. */ }
  }
  return localResult?.scope === sessionScope() ? localResult : null;
}
export function refreshVersion() {
  return sharedResult()?.version ?? "";
}
export function withSessionLock<T>(action: () => Promise<T>): Promise<T> {
  if (typeof window !== "undefined" && navigator.locks) {
    return navigator.locks.request(LOCK, action);
  }
  return action();
}
export function coordinateRefresh(observedVersion: string, recover: () => Promise<RecoveryResult>): Promise<RecoveryResult> {
  const scope = sessionScope();
  return withSessionLock(async () => {
    if (scope !== sessionScope()) return { ok: false, reason: "session-expired" };
    const latest = sharedResult();
    if (latest && latest.version !== observedVersion && Date.now() - latest.at < RESULT_TTL_MS) {
      return latest.result;
    }
    const result = await recover();
    if (scope !== sessionScope()) return { ok: false, reason: "session-expired" };
    localResult = { version: id(), scope, at: Date.now(), result };
    write(RESULT_KEY, JSON.stringify(localResult));
    return result;
  });
}
