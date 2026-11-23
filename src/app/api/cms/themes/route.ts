import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { requireThemeAccess, themeError, themeJson } from "@/cms/features/themes/api/theme-bff";
import { backendCreateTheme, backendThemeList } from "@/cms/features/themes/api/themes.server";
import { parseThemeActive, parseThemePage } from "@/cms/features/themes/lib/theme-data";
import { themeCreateSchema } from "@/cms/features/themes/schemas/theme.schema";

export async function GET(request: Request) {
  const auth = await requireThemeAccess();
  if ("response" in auth) return auth.response;
  const query = new URL(request.url).searchParams;
  const rawPage = query.get("page");
  const page = parseThemePage(rawPage);
  const limit = Number(query.get("limit") ?? 20);
  const search = query.get("search")?.trim() || undefined;
  const rawActive = query.get("isActive");
  const isActive = parseThemeActive(rawActive);
  if ((rawPage !== null && String(page) !== rawPage) ||
      !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
      (search && search.length > 200) || (rawActive !== null && isActive === undefined)) {
    return themeError(400);
  }
  try {
    return themeJson(await backendThemeList(auth.accessToken, { page, limit, search, isActive }, request.signal));
  } catch (error) {
    return themeError(502, error);
  }
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return themeError(403);
  if (!hasJsonContentType(request)) return themeError(400);
  const auth = await requireThemeAccess();
  if ("response" in auth) return auth.response;
  let input: unknown;
  try { input = await request.json(); } catch { return themeError(400); }
  const parsed = themeCreateSchema.safeParse(input);
  if (!parsed.success) return themeError(400, undefined, parsed.error.issues[0]?.message);
  try {
    // Creating an active theme is a Phase 4 operation, not a Phase 3 CRUD side effect.
    return themeJson(await backendCreateTheme(auth.accessToken, { ...parsed.data, isActive: false }), 201);
  } catch (error) {
    return themeError(502, error);
  }
}
