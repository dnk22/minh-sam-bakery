import { CmsApiError } from "../../../lib/api/errors.ts";
import { sessionRefreshStore } from "../stores/session-refresh.store.ts";
import { cmsLoginUrl } from "../lib/redirect.ts";
import { coordinateRefresh, refreshVersion, sessionScope } from "./refresh-coordinator.ts";
import { createRefreshManager } from "./refresh-manager.ts";
import { retryAfterMilliseconds, runRefreshAttempts, type RefreshAttemptResult, type RecoveryResult } from "./refresh-retry-policy.ts";

async function performRefresh(checkFresh: boolean): Promise<RefreshAttemptResult> {
  try {
    // The BFF may perform up to three 10-second Backend calls (freshness check, refresh and me).
    const response = await fetch("/api/cms/auth/refresh", {
      method: "POST", credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkFresh }),
      signal: AbortSignal.timeout(35_000),
    });
    if (response.ok) {
      const payload = await response.json() as { ok?: boolean };
      return payload.ok === true ? { ok: true } : { ok: false, code: "INVALID_RESPONSE" };
    }
    const codes: Record<number, string> = { 400: "VALIDATION", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 423: "LOCKED", 429: "RATE_LIMITED", 504: "TIMEOUT" };
    return { ok: false, code: codes[response.status] ?? (response.status >= 500 ? "UNAVAILABLE" : "INVALID_RESPONSE"), retryAfterMs: retryAfterMilliseconds(response.headers.get("Retry-After")) };
  } catch (error) {
    return { ok: false, code: error instanceof DOMException && error.name === "TimeoutError" ? "TIMEOUT" : "NETWORK" };
  }
}

export const browserRefresh = createRefreshManager(
  (version, checkFresh, onAttempt) => coordinateRefresh(version, () => runRefreshAttempts({
    perform: attempt => performRefresh(checkFresh || attempt > 1),
    onAttempt,
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  })),
  state => sessionRefreshStore.setState(state),
);

let redirecting = false;
export function resetBrowserRecovery() {
  redirecting = false;
  browserRefresh.reset();
}

export function redirectAfterRecovery(result: RecoveryResult, redirectTo: string, locked = false) {
  if (result.ok || redirecting || typeof window === "undefined") return;
  redirecting = true;
  window.location.replace(cmsLoginUrl(redirectTo, locked && result.reason !== "session-changed" ? "locked" : result.reason));
}

export async function awaitRecovery(promise: Promise<RecoveryResult>, scope: string, signal?: AbortSignal) {
  // Keep the terminal redirect attached even if all original callers abort.
  const checked = promise.then(result => {
    if (typeof window !== "undefined") {
      const redirectTo = window.location.pathname + window.location.search;
      if (scope !== sessionScope()) {
        redirectAfterRecovery({ ok: false, reason: "session-changed" }, redirectTo);
      } else if (!result.ok) {
        redirectAfterRecovery(result, redirectTo);
      }
    }
    return result;
  });
  if (signal?.aborted) throw new CmsApiError("NETWORK", "Yêu cầu đã bị hủy.");
  // Abort a waiting operation, not the shared refresh used by other callers.
  let onAbort: (() => void) | undefined;
  const result = await (signal ? Promise.race([
    checked,
    new Promise<never>((_, reject) => {
      onAbort = () => reject(new CmsApiError("NETWORK", "Yêu cầu đã bị hủy."));
      signal.addEventListener("abort", onAbort, { once: true });
      if (signal.aborted) onAbort();
    }),
  ]).finally(() => { if (onAbort) signal.removeEventListener("abort", onAbort); }) : checked);
  if (scope !== sessionScope()) throw new CmsApiError("UNAUTHORIZED", "Phiên đăng nhập đã thay đổi. Vui lòng thử lại.");
  if (!result.ok) {
    throw new CmsApiError("SESSION_RECOVERY_FAILED", "Không thể khôi phục phiên đăng nhập.");
  }
}
export function assertRecoveryScope(scope: string) {
  if (scope === sessionScope()) return;
  if (typeof window !== "undefined") redirectAfterRecovery({ ok: false, reason: "session-changed" }, window.location.pathname + window.location.search);
  throw new CmsApiError("UNAUTHORIZED", "Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại.");
}
export { refreshVersion, sessionScope };
