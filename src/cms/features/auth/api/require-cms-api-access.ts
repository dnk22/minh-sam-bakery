import "server-only";

import { readCmsSessionCookies } from "../session/cookies";
import { resolveCmsSession } from "../session/current-session";
import { CMS_PREAUTH_REJECTION_HEADER } from "../lib/replay-policy";

export async function requireCmsApiAccess(errorResponse: (status: number) => Response): Promise<{ accessToken: string } | { response: Response }> {
  const session = await resolveCmsSession();
  if (session.status !== "authenticated") {
    const status = session.status === "forbidden" ? 403 : session.status === "locked" ? 423 : session.status === "unavailable" ? 503 : 401;
    const response = errorResponse(status);
    // Only this pre-operation guard may authorize replaying a mutation.
    if (status === 401) response.headers.set(CMS_PREAUTH_REJECTION_HEADER, "1");
    return { response };
  }
  const accessToken = (await readCmsSessionCookies()).accessToken;
  if (accessToken) return { accessToken };
  const response = errorResponse(401);
  response.headers.set(CMS_PREAUTH_REJECTION_HEADER, "1");
  return { response };
}
