import { hasJsonContentType, isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { postError, postJson, requirePostAccess } from "@/cms/features/posts/api/post-bff";
import { backendCreatePost, backendPostList } from "@/cms/features/posts/api/posts.server";
import { parsePostListQuery } from "@/cms/features/posts/lib/post-data";
import { postCreateSchema } from "@/cms/features/posts/schemas/post.schema";
import { revalidatePublicJournal } from "@/cms/features/posts/api/post-cache";

export async function GET(request: Request) {
  const auth = await requirePostAccess(); if ("response" in auth) return auth.response;
  const parsed = parsePostListQuery(new URL(request.url).searchParams); if (!parsed.ok) return postError(400);
  try { return postJson(await backendPostList(auth.accessToken, parsed.data, request.signal)); } catch (error) { return postError(502, error); }
}
export async function POST(request: Request) {
  if (!isTrustedSameOriginRequest(request)) return postError(403); if (!hasJsonContentType(request)) return postError(400);
  const auth = await requirePostAccess(); if ("response" in auth) return auth.response;
  let body: unknown; try { body = await request.json(); } catch { return postError(400); }
  const parsed = postCreateSchema.safeParse(body); if (!parsed.success) return postError(400);
  try { const saved = await backendCreatePost(auth.accessToken, parsed.data); revalidatePublicJournal(null, saved.slug); return postJson(saved, 201); }
  catch (error) { return postError(502, error); }
}
