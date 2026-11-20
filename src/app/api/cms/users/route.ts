import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireUserAccess, userError, userJson } from "@/cms/features/users/api/user-bff";
import { backendCreateUser, backendUserList } from "@/cms/features/users/api/users.server";
import { createUserSchema } from "@/cms/features/users/schemas/user.schema";

export async function GET(request: Request) {
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  const query = new URL(request.url).searchParams;
  const page = Number(query.get("page") ?? 1);
  const limit = Number(query.get("limit") ?? 20);
  const search = query.get("search")?.trim() || undefined;
  const rawStatus = query.get("status");
  const status = rawStatus === "ACTIVE" || rawStatus === "LOCKED" ? rawStatus : undefined;
  const roleId = query.get("roleId")?.trim() || undefined;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (search && search.length > 200) || (rawStatus && !status) || (roleId && roleId.length > 200)) return userError(400);
  try { return userJson(await backendUserList(auth.accessToken, { page, limit, search, status, roleId }, request.signal)); }
  catch (error) { return userError(502, error); }
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return userError(403);
  if (!hasJsonContentType(request)) return userError(400);
  const auth = await requireUserAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return userError(400); }
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) return userError(400, undefined, parsed.error.issues[0]?.message);
  try { return userJson(await backendCreateUser(auth.accessToken, parsed.data), 201); }
  catch (error) { return userError(502, error); }
}
