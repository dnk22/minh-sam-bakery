import "server-only";
import { backendRequest } from "@/lib/api/backend-client";
import { isDeletedPost, isPost, isPostList } from "../lib/post-data";
import type { Post, PostCreateInput, PostList, PostListParams, PostPatchInput } from "../types";

export async function backendPostList(accessToken: string, params: PostListParams, signal?: AbortSignal): Promise<PostList> {
  return (await backendRequest({ path: "/api/v1/posts", query: params, accessToken, cache: "no-store", signal, validate: isPostList })).data;
}
export async function backendPostDetail(accessToken: string, id: string, signal?: AbortSignal): Promise<Post> {
  return (await backendRequest({ path: `/api/v1/posts/${encodeURIComponent(id)}`, accessToken, cache: "no-store", signal, validate: isPost })).data;
}
export async function backendCreatePost(accessToken: string, input: PostCreateInput): Promise<Post> {
  return (await backendRequest({ path: "/api/v1/posts", method: "POST", body: input, accessToken, cache: "no-store", validate: isPost })).data;
}
export async function backendUpdatePost(accessToken: string, id: string, input: PostPatchInput): Promise<Post> {
  return (await backendRequest({ path: `/api/v1/posts/${encodeURIComponent(id)}`, method: "PATCH", body: input, accessToken, cache: "no-store", validate: isPost })).data;
}
export async function backendPublishPost(accessToken: string, id: string): Promise<Post> {
  return (await backendRequest({ path: `/api/v1/posts/${encodeURIComponent(id)}/publish`, method: "PATCH", accessToken, cache: "no-store", validate: isPost })).data;
}
export async function backendDeletePost(accessToken: string, id: string): Promise<{ id: string }> {
  return (await backendRequest({ path: `/api/v1/posts/${encodeURIComponent(id)}`, method: "DELETE", accessToken, cache: "no-store", validate: isDeletedPost })).data;
}
