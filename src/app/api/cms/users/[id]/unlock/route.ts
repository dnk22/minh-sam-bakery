import { isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireUserAccess, userError, userJson, validUserId } from "@/cms/features/users/api/user-bff";
import { backendChangeUserLock } from "@/cms/features/users/api/users.server";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return userError(403);
  const { id } = await context.params;
  if (!validUserId(id)) return userError(400);
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  try { return userJson(await backendChangeUserLock(auth.accessToken, id, "unlock")); }
  catch (error) { return userError(502, error, undefined, "action"); }
}
