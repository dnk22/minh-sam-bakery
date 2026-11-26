export type SubmissionStatus = "idle" | "submitting" | "failed" | "uncertain" | "succeeded";

export type SubmissionState = {
  sessionId: string | null;
  attemptId: number | null;
  status: SubmissionStatus;
  error: string;
};

export type SubmissionEvent =
  | { type: "start"; sessionId: string; attemptId: number }
  | { type: "failed" | "uncertain"; sessionId: string; attemptId: number; error: string }
  | { type: "succeeded"; sessionId: string; attemptId: number }
  | { type: "set-error"; sessionId: string | null; error: string };

export function idleSubmission(sessionId: string | null): SubmissionState {
  return { sessionId, attemptId: null, status: "idle", error: "" };
}

export function visibleSubmission(state: SubmissionState, sessionId: string | null): SubmissionState {
  return state.sessionId === sessionId ? state : idleSubmission(sessionId);
}

export function submissionReducer(state: SubmissionState, event: SubmissionEvent): SubmissionState {
  if (event.type === "start") {
    if (state.sessionId === event.sessionId && (state.status === "submitting" || state.status === "uncertain")) return state;
    return { sessionId: event.sessionId, attemptId: event.attemptId, status: "submitting", error: "" };
  }
  if (event.type === "set-error") {
    return { ...visibleSubmission(state, event.sessionId), error: event.error };
  }
  if (state.sessionId !== event.sessionId || state.attemptId !== event.attemptId) return state;
  return {
    sessionId: event.sessionId,
    attemptId: event.attemptId,
    status: event.type,
    error: "error" in event ? event.error : "",
  };
}
