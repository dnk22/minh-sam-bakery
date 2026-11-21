"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "../api/posts.client";
import { postQueryKeys } from "../lib/post-query-keys";
import type { PostListParams } from "../types";
export const usePosts = (params: PostListParams) => useQuery({ queryKey: postQueryKeys.list(params), queryFn: ({ signal }) => getPosts(params, signal), placeholderData: keepPreviousData, staleTime: 20_000 });
export const usePostDetail = (id?: string) => useQuery({ queryKey: postQueryKeys.detail(id ?? ""), queryFn: ({ signal }) => getPost(id ?? "", signal), enabled: Boolean(id), retry: false, staleTime: 10_000 });
