import { backendMe } from "@/cms/features/auth/api/auth.server";
import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { CmsAuthBackendError } from "@/cms/features/auth/lib/auth-errors";
import { clearCmsSessionCookies, readCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { toCmsProfileUser } from "@/cms/features/auth/types";

export async function GET() {
  const session = await readCmsSessionCookies();
  if (!session.accessToken) return authErrorResponse("unauthorized");
  try {
    const user = await backendMe(session.accessToken);
    if (user.status === "LOCKED") {
      const response = authErrorResponse("locked");
      clearCmsSessionCookies(response);
      return response;
    }
    return noStoreJson({ ok: true, user: toCmsProfileUser(user) });
  } catch (error) {
    return error instanceof CmsAuthBackendError ? authErrorResponse(error.kind) : authErrorResponse("unavailable");
  }
}
