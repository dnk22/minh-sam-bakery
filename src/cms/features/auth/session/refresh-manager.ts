import type { RecoveryResult } from "./refresh-retry-policy.ts";

export type RefreshSnapshot = { status: "idle" | "refreshing" | "failed"; attempt: number };

export function createRefreshManager(
  recover: (observedVersion: string, checkFresh: boolean, onAttempt: (attempt: number) => void) => Promise<RecoveryResult>,
  publish: (state: RefreshSnapshot) => void,
) {
  let flight: Promise<RecoveryResult> | null = null;
  let terminal: RecoveryResult | null = null;

  function refresh(observedVersion: string, checkFresh = false): Promise<RecoveryResult> {
    if (flight) return flight;
    if (terminal) return Promise.resolve(terminal);
    publish({ status: "refreshing", attempt: 0 });
    flight = Promise.resolve()
      .then(() => recover(observedVersion, checkFresh, attempt => publish({ status: "refreshing", attempt })))
      .catch((): RecoveryResult => ({ ok: false, reason: "session-recovery-failed" }))
      .then(result => {
        if (!result.ok) terminal = result;
        publish({ status: result.ok ? "idle" : "failed", attempt: 0 });
        return result;
      })
      .finally(() => { flight = null; });
    return flight;
  }

  return {
    refresh,
    pending: () => flight,
    terminal: () => terminal,
    reset: () => {
      terminal = null;
      if (!flight) publish({ status: "idle", attempt: 0 });
    },
  };
}
