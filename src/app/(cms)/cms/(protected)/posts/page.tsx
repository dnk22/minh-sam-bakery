import { Suspense } from "react";
import { PostsPage } from "@/cms/features/posts/components/posts-page/posts-page";
export default function CmsPostsPage() { return <Suspense fallback={null}><PostsPage /></Suspense>; }
