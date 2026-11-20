import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireRoleAccess, roleError, roleJson, validRoleId } from "@/cms/features/roles/api/role-bff";
import { backendDeleteRole, backendRoleDetail, backendUpdateRole } from "@/cms/features/roles/api/roles.server";
import { rolePatchSchema } from "@/cms/features/roles/schemas/role.schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!validRoleId(id)) return roleError(400);
  const auth = await requireRoleAccess();
  if ("response" in auth) return auth.response;
  try { return roleJson(await backendRoleDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return roleError(502, error); }
}

export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return roleError(403);
  if (!hasJsonContentType(request)) return roleError(400);
  const { id } = await context.params;
  if (!validRoleId(id)) return roleError(400);
  const auth = await requireRoleAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return roleError(400); }
  const parsed = rolePatchSchema.safeParse(body);
  if (!parsed.success) return roleError(400, undefined, parsed.error.issues[0]?.message);
  try { return roleJson(await backendUpdateRole(auth.accessToken, id, parsed.data)); }
  catch (error) { return roleError(502, error); }
}

export async function DELETE(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return roleError(403);
  const { id } = await context.params;
  if (!validRoleId(id)) return roleError(400);
  const auth = await requireRoleAccess();
  if ("response" in auth) return auth.response;
  try { return roleJson(await backendDeleteRole(auth.accessToken, id)); }
  catch (error) { return roleError(502, error, undefined, "delete"); }
}
