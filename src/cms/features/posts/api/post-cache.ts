import { revalidateTag } from "next/cache";
import { journalMutationTags } from "@/article/cache/journal-cache";

export function revalidatePublicJournal(oldSlug?: string | null, newSlug?: string | null) {
  journalMutationTags(oldSlug, newSlug).forEach((tag) => revalidateTag(tag, "max"));
}
