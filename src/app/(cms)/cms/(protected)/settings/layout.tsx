import type { ReactNode } from "react";
import { SettingsShell } from "@/cms/features/settings/settings-shell";

export default function CmsSettingsLayout({ children }: { children: ReactNode }) {
  return <SettingsShell>{children}</SettingsShell>;
}
