import { PostEditLoader } from "@/cms/features/posts/components/post-edit-loader";
export const instant = false;
export default async function CmsEditPostPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PostEditLoader id={id} />; }
