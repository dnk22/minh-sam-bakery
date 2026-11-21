import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireSystemConfigAccess, systemConfigError, systemConfigJson } from "@/cms/features/system-configs/api/system-config-bff";
import { backendCreateSystemConfig, backendSystemConfigList } from "@/cms/features/system-configs/api/system-configs.server";
import { systemConfigCreateSchema } from "@/cms/features/system-configs/schemas/system-config.schema";

export async function GET(request: Request) {
  const auth = await requireSystemConfigAccess();
  if ("response" in auth) return auth.response;
  const query = new URL(request.url).searchParams;
  const page = Number(query.get("page") ?? 1);
  const limit = Number(query.get("limit") ?? 20);
  const search = query.get("search")?.trim() || undefined;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (search && search.length > 200)) return systemConfigError(400);
  try { return systemConfigJson(await backendSystemConfigList(auth.accessToken, { page, limit, search }, request.signal)); }
  catch (error) { return systemConfigError(502, error); }
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return systemConfigError(403);
  if (!hasJsonContentType(request)) return systemConfigError(400);
  const auth = await requireSystemConfigAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return systemConfigError(400); }
  const parsed = systemConfigCreateSchema.safeParse(body);
  if (!parsed.success) return systemConfigError(400, undefined, parsed.error.issues[0]?.message);
  try { return systemConfigJson(await backendCreateSystemConfig(auth.accessToken, parsed.data), 201); }
  catch (error) { return systemConfigError(502, error); }
}
