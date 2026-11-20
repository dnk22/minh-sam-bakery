import { Suspense } from "react";

import { RolesPage } from "@/cms/features/roles/components/roles-page/roles-page";

export default function CmsRolesPage() {
  return <Suspense fallback={null}><RolesPage /></Suspense>;
}
