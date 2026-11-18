import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CmsShell } from "@/cms/components/layout/cms-shell";
import { CmsPreferencesProvider } from "@/cms/context/cms-preferences";
import "@/cms/styles/cms.css";

export const metadata: Metadata = {
  title: "CMS Preview | Minh Sâm Bakery",
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: ReactNode }) {
  return <CmsPreferencesProvider><CmsShell>{children}</CmsShell></CmsPreferencesProvider>;
}
