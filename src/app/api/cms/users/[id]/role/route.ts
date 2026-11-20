import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireUserAccess, userError, userJson, validUserId } from "@/cms/features/users/api/user-bff";
import { backendAssignUserRole } from "@/cms/features/users/api/users.server";
import { assignUserRoleSchema } from "@/cms/features/users/schemas/user.schema";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return userError(403);
  if (!hasJsonContentType(request)) return userError(400);
  const { id } = await context.params;
  if (!validUserId(id)) return userError(400);
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return userError(400); }
  const parsed = assignUserRoleSchema.safeParse(body);
  if (!parsed.success) return userError(400, undefined, parsed.error.issues[0]?.message, "action");
  try { return userJson(await backendAssignUserRole(auth.accessToken, id, parsed.data.roleId)); }
  catch (error) { return userError(502, error, undefined, "action"); }
}
