import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireUserAccess, userError, userJson, validUserId } from "@/cms/features/users/api/user-bff";
import { backendDeleteUser, backendUpdateUser, backendUserDetail } from "@/cms/features/users/api/users.server";
import { updateUserSchema } from "@/cms/features/users/schemas/user.schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!validUserId(id)) return userError(400);
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  try { return userJson(await backendUserDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return userError(502, error); }
}

export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return userError(403);
  if (!hasJsonContentType(request)) return userError(400);
  const { id } = await context.params;
  if (!validUserId(id)) return userError(400);
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return userError(400); }
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) return userError(400, undefined, parsed.error.issues[0]?.message);
  try { return userJson(await backendUpdateUser(auth.accessToken, id, parsed.data)); }
  catch (error) { return userError(502, error); }
}

export async function DELETE(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return userError(403);
  const { id } = await context.params;
  if (!validUserId(id)) return userError(400);
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  try { return userJson(await backendDeleteUser(auth.accessToken, id)); }
  catch (error) { return userError(502, error, undefined, "delete"); }
}
