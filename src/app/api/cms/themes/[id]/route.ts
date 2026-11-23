import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireThemeAccess, themeError, themeJson, validThemeId } from "@/cms/features/themes/api/theme-bff";
import { backendDeleteTheme, backendThemeDetail, backendUpdateTheme } from "@/cms/features/themes/api/themes.server";
import { themePatchSchema } from "@/cms/features/themes/schemas/theme.schema";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!validThemeId(id)) return themeError(400);
  const auth = await requireThemeAccess();
  if ("response" in auth) return auth.response;
  try { return themeJson(await backendThemeDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return themeError(502, error); }
}

export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return themeError(403);
  if (!hasJsonContentType(request)) return themeError(400);
  const { id } = await context.params;
  if (!validThemeId(id)) return themeError(400);
  const auth = await requireThemeAccess();
  if ("response" in auth) return auth.response;
  let input: unknown;
  try { input = await request.json(); } catch { return themeError(400); }
  const parsed = themePatchSchema.safeParse(input);
  if (!parsed.success) return themeError(400, undefined, parsed.error.issues[0]?.message);
  try {
    // An active theme is immutable via Phase 3 CMS. Duplicate it instead.
    // Final enforcement of concurrent activation races remains Backend responsibility.
    const current = await backendThemeDetail(auth.accessToken, id, request.signal);
    if (current.isActive) return themeError(409, undefined, "Theme đang hoạt động. Hãy nhân bản để chỉnh sửa, tránh thay đổi website live.");
    return themeJson(await backendUpdateTheme(auth.accessToken, id, parsed.data));
  } catch (error) {
    return themeError(502, error);
  }
}

export async function DELETE(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return themeError(403);
  const { id } = await context.params;
  if (!validThemeId(id)) return themeError(400);
  const auth = await requireThemeAccess();
  if ("response" in auth) return auth.response;
  try {
    const current = await backendThemeDetail(auth.accessToken, id, request.signal);
    if (current.isActive) return themeError(409, undefined, "Không thể xóa theme đang hoạt động.");
    return themeJson(await backendDeleteTheme(auth.accessToken, id));
  } catch (error) {
    return themeError(502, error);
  }
}
