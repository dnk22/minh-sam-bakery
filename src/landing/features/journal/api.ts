import "server-only";

import { cache } from "react";
import { JOURNAL_POSTS_TAG, journalPostTag, journalRelatedTag } from "@/article/cache/journal-cache";
import { apiGet, backendAssetUrl } from "@/lib/api/client";
import type { PaginatedResponse, PublicPostResponseDto } from "@/lib/api/types";
import { adaptPublicPost, uniqueRelatedPosts, visiblePublicPosts } from "./adapters";
import { buildPublicPostsPath, buildRelatedPostsPath, isSafeJournalSlug } from "./query";
import { isPublicPost, isPublicPostPage } from "./schema";
import type { JournalListQuery, JournalPageData } from "./types";

const publicAsset = (url: string) => backendAssetUrl(url) ?? url;

export async function getPublicPosts(query: JournalListQuery): Promise<JournalPageData> {
  const response = await apiGet(buildPublicPostsPath(query), isPublicPostPage, { tags: [JOURNAL_POSTS_TAG] });
  return { items: visiblePublicPosts(response.data.items.map((item) => adaptPublicPost(item, publicAsset))), pagination: response.data.pagination };
}

export const getPublicPost = cache(async (slug: string) => {
  if (!isSafeJournalSlug(slug)) return null;
  const response = await apiGet(`/api/v1/public/posts/${encodeURIComponent(slug)}`, isPublicPost, { tags: [JOURNAL_POSTS_TAG, journalPostTag(slug)] });
  return adaptPublicPost(response.data, publicAsset);
});

export async function getRelatedPublicPosts(slug: string, limit = 3) {
  if (!isSafeJournalSlug(slug)) return [];
  const response = await apiGet<PaginatedResponse<PublicPostResponseDto>>(buildRelatedPostsPath(slug, 1, limit), isPublicPostPage, { tags: [JOURNAL_POSTS_TAG, journalRelatedTag(slug)] });
  return uniqueRelatedPosts(response.data.items.map((item) => adaptPublicPost(item, publicAsset)), slug, limit);
}

export function resolvePublicJournalAsset(url: string) {
  return publicAsset(url);
}
