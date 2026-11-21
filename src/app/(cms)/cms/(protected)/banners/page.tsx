import { Suspense } from "react";
import { BannersPage } from "@/cms/features/banners/components/banners-page/banners-page";
export default function CmsBannersPage() { return <Suspense fallback={null}><BannersPage /></Suspense>; }
