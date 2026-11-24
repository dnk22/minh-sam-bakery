import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireThemeAccess, themeError, themeJson, validThemeId } from "@/cms/features/themes/api/theme-bff";
import { backendActivateTheme, backendThemeDetail } from "@/cms/features/themes/api/themes.server";
import { executeThemeActivation, ThemeActivationError } from "@/cms/features/themes/lib/theme-activation";
import { revalidateLandingActiveTheme } from "@/landing/features/theme/theme-cache";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return themeError(403);
  if (!hasJsonContentType(request)) return themeError(400);
  const { id } = await context.params;
  if (!validThemeId(id)) return themeError(400);
  const access = await requireThemeAccess();
  if ("response" in access) return access.response;
  let input: unknown;
  try { input = await request.json(); } catch { return themeError(400); }
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length !== 2 || !("acceptWarnings" in input) || typeof input.acceptWarnings !== "boolean" || !("syncOnly" in input) || typeof input.syncOnly !== "boolean") return themeError(400);
  try {
    return themeJson(await executeThemeActivation(id, input.acceptWarnings, {
      read: () => backendThemeDetail(access.accessToken, id),
      activate: () => backendActivateTheme(access.accessToken, id),
      synchronize: revalidateLandingActiveTheme,
      reportSyncFailure: () => console.warn("[theme-activation] Cache synchronization failed", { themeId: id }),
    }, input.syncOnly));
  } catch (error) {
    if (error instanceof ThemeActivationError) return themeError(error.status, undefined, error.message);
    return themeError(502, error);
  }
}
