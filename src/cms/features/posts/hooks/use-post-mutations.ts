"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/cms/lib/notifications";
import { createPost, deletePost, publishPost, updatePost } from "../api/posts.client";
import { postQueryKeys } from "../lib/post-query-keys";
import type { PostCreateInput, PostPatchInput } from "../types";
export function usePostMutations() {
  const client = useQueryClient();
  const invalidate = async (id?: string) => Promise.all([client.invalidateQueries({ queryKey: postQueryKeys.lists() }), id ? client.invalidateQueries({ queryKey: postQueryKeys.detail(id) }) : Promise.resolve()]);
  return {
    create: useMutation({ mutationFn: (input: PostCreateInput) => createPost(input), onSuccess: async (post) => { await invalidate(post.id); notify.success("Đã tạo bài viết."); }, onError: () => notify.error("Không thể tạo bài viết. Vui lòng thử lại.") }),
    update: useMutation({ mutationFn: ({ id, input }: { id: string; input: PostPatchInput }) => updatePost(id, input), onSuccess: async (post) => { await invalidate(post.id); notify.success("Đã lưu thay đổi."); }, onError: () => notify.error("Không thể lưu thay đổi. Vui lòng thử lại.") }),
    publish: useMutation({ mutationFn: publishPost, onSuccess: async (post) => { await invalidate(post.id); notify.success("Đã xuất bản bài viết."); }, onError: () => notify.error("Không thể xuất bản bài viết. Vui lòng thử lại.") }),
    remove: useMutation({ mutationFn: deletePost, onSuccess: async (result) => { await invalidate(result.id); notify.success("Đã xóa bài viết."); }, onError: () => notify.error("Không thể xóa bài viết. Vui lòng thử lại.") }),
  };
}
