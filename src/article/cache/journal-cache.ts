export const JOURNAL_POSTS_TAG = "journal-posts";
export const journalPostTag = (slug: string) => `journal-post-${slug}`;
export const journalRelatedTag = (slug: string) => `journal-related-${slug}`;

export function journalMutationTags(oldSlug?: string | null, newSlug?: string | null) {
  const slugs = [...new Set([oldSlug, newSlug].filter((slug): slug is string => Boolean(slug)))];
  return [JOURNAL_POSTS_TAG, ...slugs.flatMap((slug) => [journalPostTag(slug), journalRelatedTag(slug)])];
}
