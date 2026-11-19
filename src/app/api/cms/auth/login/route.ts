import { backendLogin } from "@/cms/features/auth/api/auth.server";
import { authErrorResponse, noStoreJson } from "@/cms/features/auth/api/browser-response";
import { CmsAuthBackendError } from "@/cms/features/auth/lib/auth-errors";
import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { parseLoginInput } from "@/cms/features/auth/schemas/login.schema";
import { clearCmsSessionCookies, writeCmsSessionCookies } from "@/cms/features/auth/session/cookies";
import { toCmsProfileUser } from "@/cms/features/auth/types";

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return authErrorResponse("forbidden");
  if (!hasJsonContentType(request)) return authErrorResponse("validation");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return authErrorResponse("validation");
  }
  const input = parseLoginInput(body);
  if (!input.ok) return authErrorResponse("validation", { fields: input.fields });

  try {
    const result = await backendLogin(input.data);
    if (result.user.status === "LOCKED") {
      const response = authErrorResponse("locked");
      clearCmsSessionCookies(response);
      return response;
    }
    const response = noStoreJson({ ok: true, user: toCmsProfileUser(result.user) });
    writeCmsSessionCookies(response, result, Date.now());
    return response;
  } catch (error) {
    return error instanceof CmsAuthBackendError ? authErrorResponse(error.kind) : authErrorResponse("unavailable");
  }
}
