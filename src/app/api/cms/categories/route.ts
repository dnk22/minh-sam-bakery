import { isTrustedSameOriginRequest, hasJsonContentType } from "@/cms/features/auth/lib/csrf";
import { backendCategoryList, backendCreateCategory } from "@/cms/features/categories/api/categories.server";
import { categoryError, categoryJson, requireCategoryAccess } from "@/cms/features/categories/api/category-bff";
import { categoryWriteSchema } from "@/cms/features/categories/schemas/category.schema";
import { revalidatePublicCategoryCache } from "@/cms/features/categories/api/category-cache";

export async function GET(request: Request) {
  const auth = await requireCategoryAccess();
  if ("response" in auth) return auth.response;
  const query = new URL(request.url).searchParams;
  const page = Number(query.get("page") ?? 1);
  const limit = Number(query.get("limit") ?? 20);
  const search = query.get("search")?.trim() || undefined;
  const rawStatus = query.get("status");
  const status = rawStatus === "VISIBLE" || rawStatus === "HIDDEN" ? rawStatus : undefined;
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (search && search.length > 200) || (rawStatus && !status)) return categoryError(400);
  try {
    return categoryJson(await backendCategoryList(auth.accessToken, { page, limit, search, status }, request.signal));
  } catch (error) {
    return categoryError(502, error);
  }
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return categoryError(403);
  if (!hasJsonContentType(request)) return categoryError(400);
  const auth = await requireCategoryAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return categoryError(400); }
  const parsed = categoryWriteSchema.safeParse(body);
  if (!parsed.success) return categoryError(400, undefined, parsed.error.issues[0]?.message);
  try {
    const category = await backendCreateCategory(auth.accessToken, parsed.data);
    revalidatePublicCategoryCache(category);
    return categoryJson(category, 201);
  } catch (error) {
    return categoryError(502, error);
  }
}
