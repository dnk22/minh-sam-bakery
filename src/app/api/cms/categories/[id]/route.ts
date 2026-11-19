import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { backendCategoryDetail, backendDeleteCategory, backendUpdateCategory } from "@/cms/features/categories/api/categories.server";
import { categoryError, categoryJson, requireCategoryAccess, validCategoryId } from "@/cms/features/categories/api/category-bff";
import { categoryPatchSchema } from "@/cms/features/categories/schemas/category.schema";
import { revalidatePublicCategoryCache } from "@/cms/features/categories/api/category-cache";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!validCategoryId(id)) return categoryError(400);
  const auth = await requireCategoryAccess();
  if ("response" in auth) return auth.response;
  try { return categoryJson(await backendCategoryDetail(auth.accessToken, id, request.signal)); }
  catch (error) { return categoryError(502, error); }
}

export async function PATCH(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return categoryError(403);
  if (!hasJsonContentType(request)) return categoryError(400);
  const { id } = await context.params;
  if (!validCategoryId(id)) return categoryError(400);
  const auth = await requireCategoryAccess();
  if ("response" in auth) return auth.response;
  let body: unknown;
  try { body = await request.json(); } catch { return categoryError(400); }
  const parsed = categoryPatchSchema.safeParse(body);
  if (!parsed.success) return categoryError(400, undefined, parsed.error.issues[0]?.message);
  try {
    const category = await backendUpdateCategory(auth.accessToken, id, parsed.data);
    revalidatePublicCategoryCache(category);
    return categoryJson(category);
  }
  catch (error) { return categoryError(502, error); }
}

export async function DELETE(request: Request, context: Context) {
  if (!isTrustedSameOriginRequest(request)) return categoryError(403);
  const { id } = await context.params;
  if (!validCategoryId(id)) return categoryError(400);
  const auth = await requireCategoryAccess();
  if ("response" in auth) return auth.response;
  try {
    const result = await backendDeleteCategory(auth.accessToken, id);
    revalidatePublicCategoryCache();
    return categoryJson(result);
  }
  catch (error) { return categoryError(502, error, undefined, "delete"); }
}
