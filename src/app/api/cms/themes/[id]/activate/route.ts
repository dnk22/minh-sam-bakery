import { isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireThemeAccess, themeError, themeJson, validThemeId } from "@/cms/features/themes/api/theme-bff";
import { backendActivateTheme, backendThemeDetail } from "@/cms/features/themes/api/themes.server";
import { parseThemeConfig } from "@/theme/contracts/theme-config.schema";
import { revalidateLandingActiveTheme } from "@/landing/features/theme/theme-cache";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return themeError(403);
  const { id } = await context.params;
  if (!validThemeId(id)) return themeError(400);
  const access = await requireThemeAccess();
  if ("response" in access) return access.response;
  try {
    const theme = await backendThemeDetail(access.accessToken, id, request.signal);
    if (theme.isActive) return themeError(409, undefined, "Theme này đã được kích hoạt.");
    if (!parseThemeConfig(theme.config).success) return themeError(422, undefined, "Config ThemeConfigV1 không hợp lệ.");
    // Backend must atomically deactivate the previously active theme.
    const result = await backendActivateTheme(access.accessToken, id);
    if (result.id !== id || !result.isActive) {
      return themeError(502, undefined, "Backend chưa xác nhận kích hoạt theme.");
    }
    revalidateLandingActiveTheme();
    return themeJson(result);
  } catch (error) {
    return themeError(502, error);
  }
}
