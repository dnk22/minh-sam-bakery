import "server-only";

import { connection } from "next/server";

import { backendMe } from "@/cms/features/auth/api/auth.server";
import { CmsAuthBackendError } from "@/cms/features/auth/lib/auth-errors";
import { isAccessTokenFresh, readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import type { CmsSessionResolution } from "@/cms/features/auth/types";

export async function resolveCmsSession(): Promise<CmsSessionResolution> {
  await connection();
  const session = await readCmsSessionCookies();
  if (!session.accessToken) return session.refreshToken ? { status: "needs_refresh" } : { status: "unauthenticated" };
  if (!isAccessTokenFresh(session, Date.now()) && session.refreshToken) return { status: "needs_refresh" };

  try {
    const user = await backendMe(session.accessToken);
    return user.status === "LOCKED" ? { status: "locked" } : { status: "authenticated", user };
  } catch (error) {
    if (!(error instanceof CmsAuthBackendError)) return { status: "unavailable", reason: "unavailable" };
    if (error.kind === "unauthorized") return session.refreshToken ? { status: "needs_refresh" } : { status: "unauthenticated" };
    if (error.kind === "locked") return { status: "locked" };
    if (error.kind === "forbidden") return { status: "forbidden" };
    if (error.kind === "timeout" || error.kind === "invalid_response" || error.kind === "unavailable") {
      return { status: "unavailable", reason: error.kind };
    }
    if (error.kind === "rate_limited" || error.kind === "validation") return { status: "unavailable", reason: "unavailable" };
    return { status: "unauthenticated" };
  }
}

export class CmsSessionAccessError extends Error {
  constructor(readonly resolution: Exclude<CmsSessionResolution, { status: "authenticated" }>) {
    super(resolution.status);
    this.name = "CmsSessionAccessError";
  }
}

export async function requireCmsUser() {
  const resolution = await resolveCmsSession();
  if (resolution.status === "authenticated") return resolution.user;
  throw new CmsSessionAccessError(resolution);
}
