import { Suspense } from "react";

import { SystemConfigsPage } from "@/cms/features/system-configs/components/system-configs-page/system-configs-page";

export default function CmsSystemConfigsPage() {
  return <Suspense fallback={null}><SystemConfigsPage /></Suspense>;
}
