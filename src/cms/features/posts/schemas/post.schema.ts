import { z } from "zod";
import { isMeaningfulPostHtml } from "../lib/post-html.ts";
import type { Post, PostCreateInput, PostFormValues, PostPatchInput } from "../types";

const optionalText = z.string().trim().max(10_000);
const postBase = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống.").max(500),
  slug: z.string().trim().max(500).optional(),
  thumbnailUrl: z.string().trim().max(2_000).optional(),
  content: z.string().max(1_000_000).refine(isMeaningfulPostHtml, "Nội dung bài viết không được để trống."),
  excerpt: optionalText.optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  showOnLanding: z.boolean().optional(),
  seoTitle: optionalText.optional(),
  seoDescription: optionalText.optional(),
}).strict();

export const postCreateSchema = postBase;
export const postPatchSchema = postBase.partial().refine((value) => Object.keys(value).length > 0, "Không có thay đổi để lưu.");
export const postFormSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được để trống.").max(500),
  slug: z.string().trim().max(500), thumbnailUrl: z.string().trim().max(2_000), excerpt: optionalText,
  content: z.string().max(1_000_000).refine(isMeaningfulPostHtml, "Nội dung bài viết không được để trống."),
  showOnLanding: z.boolean(), seoTitle: optionalText, seoDescription: optionalText,
});

export function postToForm(post?: Post): PostFormValues {
  return { title: post?.title ?? "", slug: post?.slug ?? "", thumbnailUrl: post?.thumbnailUrl ?? "", excerpt: post?.excerpt ?? "", content: post?.content ?? "<p></p>", showOnLanding: post?.showOnLanding ?? false, seoTitle: post?.seoTitle ?? "", seoDescription: post?.seoDescription ?? "" };
}

const present = (value: string) => value.trim();
export function formToPostCreate(values: PostFormValues): PostCreateInput {
  return { title: present(values.title), content: values.content, status: "DRAFT", showOnLanding: values.showOnLanding,
    ...(present(values.slug) ? { slug: present(values.slug) } : {}), ...(present(values.thumbnailUrl) ? { thumbnailUrl: present(values.thumbnailUrl) } : {}),
    ...(present(values.excerpt) ? { excerpt: present(values.excerpt) } : {}), ...(present(values.seoTitle) ? { seoTitle: present(values.seoTitle) } : {}),
    ...(present(values.seoDescription) ? { seoDescription: present(values.seoDescription) } : {}) };
}

export function formToPostPatch(values: PostFormValues, original: Post, options: { contentChanged: boolean; contentCompatible: boolean }): PostPatchInput {
  const patch: PostPatchInput = {};
  if (present(values.title) !== original.title) patch.title = present(values.title);
  if (present(values.slug) && present(values.slug) !== original.slug) patch.slug = present(values.slug);
  const optional: Array<["excerpt" | "seoTitle" | "seoDescription", string, string | null | undefined]> = [
    ["excerpt", values.excerpt, original.excerpt], ["seoTitle", values.seoTitle, original.seoTitle], ["seoDescription", values.seoDescription, original.seoDescription],
  ];
  for (const [key, value, current] of optional) if (present(value) !== (current ?? "")) patch[key] = present(value);
  if (values.showOnLanding !== original.showOnLanding) patch.showOnLanding = values.showOnLanding;
  if (present(values.thumbnailUrl) && present(values.thumbnailUrl) !== (original.thumbnailUrl ?? "")) patch.thumbnailUrl = present(values.thumbnailUrl);
  if (options.contentChanged && options.contentCompatible && values.content !== original.content) patch.content = values.content;
  return patch;
}

export function vietnamesePostSlug(value: string) {
  return value.trim().toLocaleLowerCase("vi").replace(/đ/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
