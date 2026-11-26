export const CMS_PREAUTH_REJECTION_HEADER = "x-minhsam-auth-rejected-before-operation";

export function isProtectedCmsRequest(path: string) {
  // Login, logout, me and refresh must not trigger recursive recovery.
  return !path.startsWith("/auth/") && path !== "/auth";
}

export function canReplayAfterUnauthorized(method: string, rejectedBeforeOperation: boolean) {
  return method === "GET" || rejectedBeforeOperation;
}
