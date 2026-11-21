import { cmsApiClient } from "@/cms/lib/api/client";
import { postDeleteRequest, postPublishRequest } from "../lib/post-data";
import type { Post, PostCreateInput, PostList, PostListParams, PostPatchInput } from "../types";

export function getPosts(params: PostListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set("search", params.search); if (params.status) query.set("status", params.status);
  if (params.showOnLanding !== undefined) query.set("showOnLanding", String(params.showOnLanding));
  return cmsApiClient.get<PostList>(`/posts?${query}`, { signal });
}
export const getPost = (id: string, signal?: AbortSignal) => cmsApiClient.get<Post>(`/posts/${encodeURIComponent(id)}`, { signal });
export const createPost = (input: PostCreateInput) => cmsApiClient.post<Post>("/posts", input);
export const updatePost = (id: string, input: PostPatchInput) => cmsApiClient.patch<Post>(`/posts/${encodeURIComponent(id)}`, input);
export const publishPost = (id: string) => { const request = postPublishRequest(id); return cmsApiClient.patch<Post>(request.path, request.body); };
export const deletePost = (id: string) => { const request = postDeleteRequest(id); return cmsApiClient.delete<{ id: string }>(request.path); };
