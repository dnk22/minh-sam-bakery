import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { postError, postJson, requirePostAccess } from "@/cms/features/posts/api/post-bff";
import { backendDeletePost, backendPostDetail, backendUpdatePost } from "@/cms/features/posts/api/posts.server";
import { validPostId } from "@/cms/features/posts/lib/post-data";
import { postPatchSchema } from "@/cms/features/posts/schemas/post.schema";
import { revalidatePublicJournal } from "@/cms/features/posts/api/post-cache";

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) {
  const auth = await requirePostAccess(); if ("response" in auth) return auth.response;
  const { id } = await params; if (!validPostId(id)) return postError(400);
  try { return postJson(await backendPostDetail(auth.accessToken, id, request.signal)); } catch (error) { return postError(502, error); }
}
export async function PATCH(request: Request, { params }: Context) {
  if (!isTrustedSameOriginRequest(request)) return postError(403); if (!hasJsonContentType(request)) return postError(400);
  const auth = await requirePostAccess(); if ("response" in auth) return auth.response;
  const { id } = await params; if (!validPostId(id)) return postError(400);
  let body: unknown; try { body = await request.json(); } catch { return postError(400); }
  const parsed = postPatchSchema.safeParse(body); if (!parsed.success) return postError(400);
  try { const current = await backendPostDetail(auth.accessToken, id, request.signal); const saved = await backendUpdatePost(auth.accessToken, id, parsed.data); revalidatePublicJournal(current.slug, saved.slug); return postJson(saved); }
  catch (error) { return postError(502, error); }
}
export async function DELETE(request: Request, { params }: Context) {
  if (!isTrustedSameOriginRequest(request)) return postError(403);
  const auth = await requirePostAccess(); if ("response" in auth) return auth.response;
  const { id } = await params; if (!validPostId(id)) return postError(400);
  try { const current = await backendPostDetail(auth.accessToken, id, request.signal); const result = await backendDeletePost(auth.accessToken, id); revalidatePublicJournal(current.slug, null); return postJson(result); }
  catch (error) { return postError(502, error); }
}
