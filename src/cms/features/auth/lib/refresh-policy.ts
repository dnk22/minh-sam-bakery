export type RefreshFailureDecision =
  | { action: "show"; state: "unavailable" | "forbidden" | "rate_limited" }
  | { action: "login"; error: "locked" | "session-expired" };

export function decideRefreshFailure(code: string, knownLocked: boolean): RefreshFailureDecision {
  if (code === "FORBIDDEN") return { action: "show", state: "forbidden" };
  if (code === "RATE_LIMITED") return { action: "show", state: "rate_limited" };
  if (code === "UNAUTHORIZED" || code === "LOCKED") {
    return { action: "login", error: knownLocked || code === "LOCKED" ? "locked" : "session-expired" };
  }
  return { action: "show", state: "unavailable" };
}
