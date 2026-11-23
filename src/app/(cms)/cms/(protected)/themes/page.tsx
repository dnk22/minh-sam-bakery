import { Suspense } from "react";

import { ThemesPage } from "@/cms/features/themes/components/themes-page/themes-page";

export default function CmsThemesPage() {
  return <Suspense fallback={null}><ThemesPage /></Suspense>;
}
