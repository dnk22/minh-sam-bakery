import { isTrustedSameOriginRequest } from "@/cms/features/auth/lib/csrf";
import { postError, postJson, requirePostAccess } from "@/cms/features/posts/api/post-bff";
import { backendPublishPost } from "@/cms/features/posts/api/posts.server";
import { validPostId } from "@/cms/features/posts/lib/post-data";
import { revalidatePublicJournal } from "@/cms/features/posts/api/post-cache";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTrustedSameOriginRequest(request)) return postError(403);
  const auth = await requirePostAccess(); if ("response" in auth) return auth.response;
  const { id } = await params; if (!validPostId(id)) return postError(400);
  try { const saved = await backendPublishPost(auth.accessToken, id); revalidatePublicJournal(saved.slug, saved.slug); return postJson(saved); }
  catch (error) { return postError(502, error); }
}
