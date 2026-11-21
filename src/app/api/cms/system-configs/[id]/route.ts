import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireSystemConfigAccess, systemConfigError, systemConfigJson, validSystemConfigId } from "@/cms/features/system-configs/api/system-config-bff";
import { backendDeleteSystemConfig, backendSystemConfigDetail, backendUpdateSystemConfig } from "@/cms/features/system-configs/api/system-configs.server";
import { systemConfigPatchSchema } from "@/cms/features/system-configs/schemas/system-config.schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!validSystemConfigId(id)) return systemConfigError(400);
  const auth = await requireSystemConfigAccess();
  if ("response" in auth) return auth.response;
  try { return systemConfigJson(await backendSystemConfigDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return systemConfigError(502, error); }
}

export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return systemConfigError(403);
  if (!hasJsonContentType(request)) return systemConfigError(400);
  const { id } = await context.params;
  if (!validSystemConfigId(id)) return systemConfigError(400);
  const auth = await requireSystemConfigAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return systemConfigError(400); }
  const parsed = systemConfigPatchSchema.safeParse(body);
  if (!parsed.success) return systemConfigError(400, undefined, parsed.error.issues[0]?.message);
  try { return systemConfigJson(await backendUpdateSystemConfig(auth.accessToken, id, parsed.data)); }
  catch (error) { return systemConfigError(502, error); }
}

export async function DELETE(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return systemConfigError(403);
  const { id } = await context.params;
  if (!validSystemConfigId(id)) return systemConfigError(400);
  const auth = await requireSystemConfigAccess();
  if ("response" in auth) return auth.response;
  try { return systemConfigJson(await backendDeleteSystemConfig(auth.accessToken, id)); }
  catch (error) { return systemConfigError(502, error, undefined, "delete"); }
}
