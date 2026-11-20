import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireRoleAccess, roleError, roleJson } from "@/cms/features/roles/api/role-bff";
import { backendCreateRole, backendRoleList } from "@/cms/features/roles/api/roles.server";
import { roleCreateSchema } from "@/cms/features/roles/schemas/role.schema";

export async function GET(request: Request) {
  const auth = await requireRoleAccess();
  if ("response" in auth) return auth.response;
  const query = new URL(request.url).searchParams;
  const page = Number(query.get("page") ?? 1);
  const limit = Number(query.get("limit") ?? 20);
  const search = query.get("search")?.trim() || undefined;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (search && search.length > 200)) return roleError(400);
  try { return roleJson(await backendRoleList(auth.accessToken, { page, limit, search }, request.signal)); }
  catch (error) { return roleError(502, error); }
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return roleError(403);
  if (!hasJsonContentType(request)) return roleError(400);
  const auth = await requireRoleAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return roleError(400); }
  const parsed = roleCreateSchema.safeParse(body);
  if (!parsed.success) return roleError(400, undefined, parsed.error.issues[0]?.message);
  try { return roleJson(await backendCreateRole(auth.accessToken, parsed.data), 201); }
  catch (error) { return roleError(502, error); }
}
