export const MAX_REFRESH_ATTEMPTS = 3;

export type RecoveryReason = "session-expired" | "locked" | "forbidden" | "session-recovery-failed";
export type RefreshAttemptResult = { ok: true } | { ok: false; code: string; retryAfterMs?: number };
export type RecoveryResult = { ok: true } | { ok: false; reason: RecoveryReason };

export function refreshFailureReason(code: string): RecoveryReason {
  if (code === "UNAUTHORIZED") return "session-expired";
  if (code === "LOCKED") return "locked";
  if (code === "FORBIDDEN") return "forbidden";
  return "session-recovery-failed";
}

export function isRetryableRefresh(code: string) {
  return ["NETWORK", "TIMEOUT", "UNAVAILABLE", "RATE_LIMITED", "INVALID_RESPONSE"].includes(code);
}

export function retryAfterMilliseconds(value: string | null, now = Date.now()): number | undefined {
  if (!value) return undefined;
  const ms = /^\d+$/.test(value) ? Number(value) * 1000 : Date.parse(value) - now;
  return Number.isFinite(ms) ? Math.max(0, ms) : undefined;
}

export async function runRefreshAttempts({
  perform, onAttempt, sleep,
}: {
  perform: (attempt: number) => Promise<RefreshAttemptResult>;
  onAttempt: (attempt: number) => void;
  sleep: (ms: number) => Promise<void>;
}): Promise<RecoveryResult> {
  for (let attempt = 1; attempt <= MAX_REFRESH_ATTEMPTS; attempt++) {
    onAttempt(attempt);
    let result: RefreshAttemptResult;
    try { result = await perform(attempt); }
    catch { result = { ok: false, code: "NETWORK" }; }
    if (result.ok) return result;
    if (!isRetryableRefresh(result.code) || attempt === MAX_REFRESH_ATTEMPTS) {
      return { ok: false, reason: refreshFailureReason(result.code) };
    }
    const delay = Math.max(1000 * 2 ** (attempt - 1), result.retryAfterMs ?? 0);
    // Do not hold a blocking modal for an unbounded server Retry-After.
    if (delay > 30_000) return { ok: false, reason: "session-recovery-failed" };
    await sleep(delay);
  }
  return { ok: false, reason: "session-recovery-failed" };
}
