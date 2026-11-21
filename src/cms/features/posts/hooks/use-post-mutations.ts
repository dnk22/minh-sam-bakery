"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, publishPost, updatePost } from "../api/posts.client";
import { postQueryKeys } from "../lib/post-query-keys";
import type { PostCreateInput, PostPatchInput } from "../types";
export function usePostMutations() {
  const client = useQueryClient();
  const invalidate = async (id?: string) => Promise.all([client.invalidateQueries({ queryKey: postQueryKeys.lists() }), id ? client.invalidateQueries({ queryKey: postQueryKeys.detail(id) }) : Promise.resolve()]);
  return {
    create: useMutation({ mutationFn: (input: PostCreateInput) => createPost(input), onSuccess: (post) => invalidate(post.id) }),
    update: useMutation({ mutationFn: ({ id, input }: { id: string; input: PostPatchInput }) => updatePost(id, input), onSuccess: (post) => invalidate(post.id) }),
    publish: useMutation({ mutationFn: publishPost, onSuccess: (post) => invalidate(post.id) }),
    remove: useMutation({ mutationFn: deletePost, onSuccess: (result) => invalidate(result.id) }),
  };
}
